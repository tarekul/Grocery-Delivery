const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database
const db = new sqlite3.Database('./grocery.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

// Create tables
db.run(`
    Create table if not exists orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        address TEXT,
        items TEXT,
        total_price REAL
    )`);


// Inventory
const inventory = [
    { id: 1, name: 'Rice (Basmati)', price: 10, image: 'https://via.placeholder.com/100', category: 'Grains' },
    { id: 2, name: 'Rice (Gobindobhog)', price: 12, image: 'https://via.placeholder.com/100', category: 'Grains' },
    { id: 3, name: 'Rice (Miniket)', price: 11, image: 'https://via.placeholder.com/100', category: 'Grains' },
    { id: 4, name: 'Flattened Rice (Chire/Poha)', price: 5, image: 'https://via.placeholder.com/100', category: 'Grains' },
    { id: 5, name: 'Puffed Rice (Muri)', price: 4, image: 'https://via.placeholder.com/100', category: 'Grains' },
    { id: 6, name: 'Wheat Flour (Atta)', price: 8, image: 'https://via.placeholder.com/100', category: 'Grains' },
    { id: 7, name: 'Semolina (Suji)', price: 6, image: 'https://via.placeholder.com/100', category: 'Grains' },
    { id: 8, name: 'Red Lentils (Masoor Dal)', price: 5, image: 'https://via.placeholder.com/100', category: 'Lentils' },
    { id: 9, name: 'Split Pigeon Peas (Arhar/Tur Dal)', price: 7, image: 'https://via.placeholder.com/100', category: 'Lentils' },
    { id: 10, name: 'Split Green Gram (Moong Dal)', price: 6, image: 'https://via.placeholder.com/100', category: 'Lentils' },
    { id: 11, name: 'Black Gram (Urad Dal)', price: 7, image: 'https://via.placeholder.com/100', category: 'Lentils' },
    { id: 12, name: 'Split Chickpeas (Chana Dal)', price: 6, image: 'https://via.placeholder.com/100', category: 'Lentils' },
    { id: 13, name: 'Yellow Lentils (Matar Dal)', price: 5, image: 'https://via.placeholder.com/100', category: 'Lentils' },
    { id: 14, name: 'Turmeric Powder (Haldi)', price: 2, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 15, name: 'Red Chili Powder', price: 2, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 16, name: 'Cumin Seeds (Jeera)', price: 3, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 17, name: 'Coriander Powder', price: 3, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 18, name: 'Mustard Seeds (Shorshe)', price: 2, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 19, name: 'Bay Leaves (Tejpatta)', price: 1, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 20, name: 'Cloves (Lavang)', price: 4, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 21, name: 'Cinnamon (Daruchini)', price: 5, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 22, name: 'Cardamom (Elaichi)', price: 6, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 23, name: 'Nigella Seeds (Kalo Jeera)', price: 3, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 24, name: 'Fenugreek Seeds (Methi)', price: 2, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 25, name: 'Asafoetida (Hing)', price: 7, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 26, name: 'Panch Phoron', price: 4, image: 'https://via.placeholder.com/100', category: 'Spices' },
    { id: 27, name: 'Potato (Aloo)', price: 1, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
    { id: 28, name: 'Onion (Peyaj)', price: 2, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
    { id: 29, name: 'Tomato', price: 3, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
    { id: 30, name: 'Eggplant (Begun)', price: 3, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
    { id: 31, name: 'Bottle Gourd (Lau)', price: 4, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
    { id: 32, name: 'Pointed Gourd (Patal)', price: 4, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
    { id: 33, name: 'Ridge Gourd (Jhinge)', price: 4, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
    { id: 34, name: 'Spinach (Palong Shaak)', price: 2, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
    { id: 35, name: 'Milk (Dudh)', price: 2, image: 'https://via.placeholder.com/100', category: 'Dairy' },
    { id: 36, name: 'Curd/Yogurt (Doi)', price: 3, image: 'https://via.placeholder.com/100', category: 'Dairy' },
    { id: 37, name: 'Banana (Kola)', price: 1, image: 'https://via.placeholder.com/100', category: 'Fruits' },
    { id: 38, name: 'Mango (Aam)', price: 5, image: 'https://via.placeholder.com/100', category: 'Fruits' },
    { id: 39, name: 'Mustard Oil (Shorsher Tel)', price: 7, image: 'https://via.placeholder.com/100', category: 'Miscellaneous' },
    { id: 40, name: 'Jaggery (Gur)', price: 4, image: 'https://via.placeholder.com/100', category: 'Miscellaneous' },
];

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Grocery MVP App!');
});

app.get('/inventory', (req, res) => {
    try {
        res.json({
            success: true,
            data: inventory,
            count: inventory.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.post('/order', (req, res) => {
    const { name, phone, address, items } = req.body;
    const total_price = items.reduce((total, item) => {
        const itemData = inventory.find(i => i.id === item.id);
        if (!itemData) {
            return total;
        }

        return total + itemData.price * item.quantity;
    }, 0);

    const sql = `
        INSERT INTO orders (name, phone, address, items, total_price)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [name, phone, address, JSON.stringify(items), total_price], function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).send('Error placing order.');
        } else {
          res.status(201).send('Order placed successfully.');
        }
    });
});

app.get('/orders', (req, res) => {
    db.all('SELECT * FROM orders', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error fetching orders.');
        } else {
            res.json(rows);
        }
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));