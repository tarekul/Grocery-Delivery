const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5001;

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
const inventory = {
    Grains: [
        { id: 1, name: 'Rice (Basmati)', price: 10, image: 'https://imgs.search.brave.com/fnuk3MWnUede8LbArSs_K6dudhDXXkyV0FOkykk7s8Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzYyLzIwLzQ3/LzM2MF9GXzE2MjIw/NDc2MF9IeUJMRncx/akpQbTN1Q0FlQkc3/cmJYSWZxbDFiT0Ry/Vy5qcGc', category: 'Grains' },
        { id: 2, name: 'Rice (Gobindobhog)', price: 12, image: 'https://www.grainka.com/wp-content/uploads/images/Gobindobhog-Rice-aQV.jpeg', category: 'Grains' },
        { id: 3, name: 'Rice (Miniket)', price: 11, image: 'https://www.goodfoodbar.com/cdn/shop/files/minikit-rice-500x500.webp?v=1694594976&width=1445', category: 'Grains' },
        { id: 4, name: 'Flattened Rice (Chire/Poha)', price: 5, image: 'https://m.media-amazon.com/images/I/91mBGUHA+LL.jpg', category: 'Grains' },
        { id: 5, name: 'Puffed Rice (Muri)', price: 4, image: 'https://api.c2k2y3nvy0-heuschena1-p1-public.model-t.cc.commerce.ondemand.com/medias/625Wx625H-recipe-272.jpg?context=bWFzdGVyfHJvb3R8NjM5NTV8aW1hZ2UvanBlZ3xhR1l3TDJnME1DODRPRGd5TWpBMU1qWXhPRFUwTHpZeU5WZDROakkxU0Y5eVpXTnBjR1V0TWpjeUxtcHdad3xiYzQxYThiNmUxNDJiMzcyMmY0ZTU3OTM0NDQ5YzVjY2Q0NzgxOTRhNjFjMDQwOGE3OTk2MjRlZmRkMmE1Mzkx', category: 'Grains' },
        { id: 6, name: 'Wheat Flour (Atta)', price: 8, image: 'https://myfavouritepastime.com/wp-content/uploads/2019/07/img_9226.jpg?w=730', category: 'Grains' },
        { id: 7, name: 'Semolina (Suji)', price: 6, image: 'https://cdnimg.webstaurantstore.com/uploads/blog/2019/6/blog-semolina_in-blog3.jpg', category: 'Grains' }
    ],
    Lentils: [
        { id: 8, name: 'Red Lentils (Masoor Dal)', price: 5, image: 'https://www.curiouscuisiniere.com/wp-content/uploads/2020/12/Masoor-Dal-Red-Lentils-Dry-14.680.jpg', category: 'Lentils' },
        { id: 9, name: 'Split Pigeon Peas (Arhar/Tur Dal)', price: 7, image: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Split_pea.jpg', category: 'Lentils' },
        { id: 10, name: 'Split Green Gram (Moong Dal)', price: 6, image: 'https://m.media-amazon.com/images/I/41r6UnzyZ9L.jpg', category: 'Lentils' },
        { id: 11, name: 'Black Gram (Urad Dal)', price: 7, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Black_gram.jpg/512px-Black_gram.jpg', category: 'Lentils' },
        { id: 12, name: 'Split Chickpeas (Chana Dal)', price: 6, image: 'https://m.media-amazon.com/images/I/51iO2Sphg2L.jpg', category: 'Lentils' },
        { id: 13, name: 'Yellow Lentils (Matar Dal)', price: 5, image: 'https://cdn.loveandlemons.com/wp-content/uploads/2019/12/lentils.jpg', category: 'Lentils' }
    ],
    Spices: [
        { id: 14, name: 'Turmeric Powder (Haldi)', price: 2, image: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Turmeric-powder.jpg', category: 'Spices' },
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
        { id: 26, name: 'Panch Phoron', price: 4, image: 'https://via.placeholder.com/100', category: 'Spices' }
    ],
    Vegetables: [
        { id: 27, name: 'Potato (Aloo)', price: 1, image: 'https://m.media-amazon.com/images/I/61yXL70-RaL._SL1500_.jpg', category: 'Vegetables' },
        { id: 28, name: 'Onion (Peyaj)', price: 2, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
        { id: 29, name: 'Tomato', price: 3, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
        { id: 30, name: 'Eggplant (Begun)', price: 3, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
        { id: 31, name: 'Bottle Gourd (Lau)', price: 4, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
        { id: 32, name: 'Pointed Gourd (Patal)', price: 4, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
        { id: 33, name: 'Ridge Gourd (Jhinge)', price: 4, image: 'https://via.placeholder.com/100', category: 'Vegetables' },
        { id: 34, name: 'Spinach (Palong Shaak)', price: 2, image: 'https://via.placeholder.com/100', category: 'Vegetables' }
    ],
    Dairy: [
        { id: 35, name: 'Milk (Dudh)', price: 2, image: 'https://via.placeholder.com/100', category: 'Dairy' },
        { id: 36, name: 'Curd/Yogurt (Doi)', price: 3, image: 'https://via.placeholder.com/100', category: 'Dairy' }
    ],
    Fruits: [
        { id: 37, name: 'Banana (Kola)', price: 1, image: 'https://m.media-amazon.com/images/I/61fZ+YAYGaL._SL1500_.jpg', category: 'Fruits' },
        { id: 38, name: 'Mango (Aam)', price: 5, image: 'https://via.placeholder.com/100', category: 'Fruits' }
    ],
    Miscellaneous: [
        { id: 39, name: 'Mustard Oil (Shorsher Tel)', price: 7, image: 'https://via.placeholder.com/100', category: 'Miscellaneous' },
        { id: 40, name: 'Jaggery (Gur)', price: 4, image: 'https://via.placeholder.com/100', category: 'Miscellaneous' }
    ]
};

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

app.post('/order', (req, res) => {
    const { name, phone, address, items } = req.body;
    const total_price = items.reduce((total, item) => {
        const itemData = Object.values(inventory).flat().find(i => i.id === item.id);
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