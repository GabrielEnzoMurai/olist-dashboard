import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(__dirname, 'public', 'data.json');

// In-memory mappings
const customerMap = {}; // { customer_id: { unique_id, state } }
const orderMap = {}; // { order_id: { month, status, customer_id } }
const productMap = {}; // { product_id: category_name }

// Transactions Array
const transactions = [];

// Helper to read CSV files as promises
function processCSV(filename, onData) {
	return new Promise((resolve, reject) => {
		const filePath = path.join(dataDir, filename);
		if (!fs.existsSync(filePath)) {
			console.warn(`File not found: ${filePath}, skipping...`);
			return resolve();
		}
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', onData)
			.on('end', resolve)
			.on('error', reject);
	});
}

async function prepareData() {
	console.log("Iniciando preparação do Super Data Lake Olist...");

	// 1. Customers
	console.log("Carregando clientes...");
	await processCSV('olist_customers_dataset.csv', (row) => {
		customerMap[row.customer_id] = {
			unique_id: row.customer_unique_id,
			state: row.customer_state
		};
	});

	// 2. Products -> Categories
	console.log("Carregando produtos...");
	await processCSV('olist_products_dataset.csv', (row) => {
		let cat = row.product_category_name;
		productMap[row.product_id] = cat ? cat.replace(/_/g, ' ') : 'Desconhecido';
	});

	// 3. Orders
	console.log("Carregando pedidos...");
	await processCSV('olist_orders_dataset.csv', (row) => {
		let month = null;
		if (row.order_purchase_timestamp) {
			month = row.order_purchase_timestamp.substring(0, 7); // "YYYY-MM"
		}
		
		orderMap[row.order_id] = {
			month,
			status: row.order_status,
			customer_id: row.customer_id
		};
	});

	// 4. Order Items (Flat Map)
	console.log("Processando e cruzando ~112.000 transações...");
	await processCSV('olist_order_items_dataset.csv', (row) => {
		const price = parseFloat(row.price);
		const freight = parseFloat(row.freight_value);
		
		if (isNaN(price)) return;
		
		const order = orderMap[row.order_id];
		if (!order) return; // Ignore orphan items if any

		const customer = customerMap[order.customer_id];
		const category = productMap[row.product_id] || 'Desconhecido';

		// Formato minificado para gastar pouco JSON:
		transactions.push({
			o: row.order_id,             // order_id
			m: order.month,              // month
			st: order.status,            // status
			s: customer ? customer.state : '?', // state
			u: customer ? customer.unique_id : '?', // unique_id
			c: category,                 // category
			p: price,                    // price
			f: isNaN(freight) ? 0 : freight, // freight
			se: row.seller_id,           // seller_id
			pr: row.product_id           // product_id
		});
	});

	console.log("Formatando saída centralizada...");
	// Save
	const publicDir = path.join(__dirname, 'public');
	if (!fs.existsSync(publicDir)) {
		fs.mkdirSync(publicDir);
	}
	fs.writeFileSync(outputFile, JSON.stringify(transactions));
	console.log(`Sucesso! Script salvou Array achatada (Data Lake) de ${transactions.length} registros em ${outputFile}`);
}

prepareData().catch(console.error);
