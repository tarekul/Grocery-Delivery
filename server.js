const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

const inventory  = require('./inventory.js');
const db = require('./database/db_create.js').db;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Grocery MVP App!');
});

app.get('/inventory', (req, res) => {
    try {
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.use('/inventory_images', express.static('inventory_images'));

app.post('/order', (req, res) => {
    const { firstName, lastName, email, phone, address, city, state, zipcode, items, totalPrice } = req.body;
    const name = `${firstName} ${lastName}`; 
    total_price = parseFloat(totalPrice);

    if (!name || !email || !phone || !address || !city || !state || !zipcode || !items || !totalPrice) {
        return res.status(400).send('Invalid request.');
    }

    if(isNaN(total_price)) {
        return res.status(400).send('Invalid total price.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log(email);
        return res.status(400).send('Invalid email address.');
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).send('Invalid phone number.');
    }

    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zipcode)) {
        return res.status(400).send('Invalid zip code.');
    }

    const sql = `
        INSERT INTO orders (name, email, phone, address, city, state, zipcode, items, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [name, email, phone, address, city, state, zipcode, JSON.stringify(items), total_price], function (err) {
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