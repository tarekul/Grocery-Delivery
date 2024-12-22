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
        { id: 1, name: 'Royal Basmati Rice (5g)', price: 10, image: '/inventory_images/royal_basmati_rice.webp', category: 'Grains' },
        { id: 2, name: 'Gobindobhog Rice (5g)', price: 12, image: '/inventory_images/grihika_gobingobhog_rice.webp', category: 'Grains' },
        { id: 3, name: 'Heritage Basmati Rice (5g)', price: 11, image: '/inventory_images/heritage-basmati-rice.webp', category: 'Grains' },
        { id: 4, name: 'Rice (Kataribhog)', price: 13, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 5, name: 'Rice (Kalijira)', price: 14, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 6, name: 'Rice (Tulaipanji)', price: 12, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 7, name: 'Flattened Rice (Chire/Poha)', price: 5, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 8, name: 'Puffed Rice (Muri)', price: 4, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 9, name: 'Puffed Rice Premium (Jhuri Muri)', price: 5, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 10, name: 'Wheat Flour (Atta)', price: 8, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 11, name: 'All Purpose Flour (Maida)', price: 7, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 12, name: 'Semolina (Suji)', price: 6, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 13, name: 'Vermicelli (Semai)', price: 5, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 14, name: 'Puffed Rice Cakes (Khoi)', price: 4, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 68, name: 'Rice (Chinigura)', price: 15, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 69, name: 'Rice (Paijam)', price: 11, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 70, name: 'Rice (Najirshail)', price: 13, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 71, name: 'Panta Bhat Mix', price: 6, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 72, name: 'Muri (Kalo Bhaja)', price: 5, image: '/inventory_images/placeholder.png', category: 'Grains' },
        { id: 73, name: 'Khichuri Mix', price: 7, image: '/inventory_images/placeholder.png', category: 'Grains' }
    ],
    Lentils: [
        { id: 15, name: 'Red Lentils (Masoor Dal)', price: 5, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 16, name: 'Split Pigeon Peas (Arhar/Tur Dal)', price: 7, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 17, name: 'Split Green Gram (Moong Dal)', price: 6, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 18, name: 'Black Gram (Urad Dal)', price: 7, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 19, name: 'Split Chickpeas (Chana Dal)', price: 6, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 20, name: 'Yellow Peas (Matar Dal)', price: 5, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 21, name: 'Whole Masoor Dal', price: 6, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 22, name: 'Khesari Dal', price: 5, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 23, name: 'Whole Mung Beans (Sabut Moong)', price: 7, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 74, name: 'Motor Dal (Whole)', price: 6, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 75, name: 'Boot Dal', price: 5, image: '/inventory_images/placeholder.png', category: 'Lentils' },
        { id: 76, name: 'Mixed Dal Pack', price: 8, image: '/inventory_images/placeholder.png', category: 'Lentils' }
    ],
    Spices: [
        { id: 24, name: 'Turmeric Powder (Holud)', price: 3, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 25, name: 'Red Chili Powder (Morich)', price: 3, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 26, name: 'Cumin Seeds (Jeera)', price: 4, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 27, name: 'Cumin Powder (Jeera Gura)', price: 4, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 28, name: 'Coriander Powder (Dhonia Gura)', price: 3, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 29, name: 'Mustard Seeds (Shorshe)', price: 2, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 30, name: 'Bay Leaves (Tejpata)', price: 2, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 31, name: 'Cloves (Lobongo)', price: 5, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 32, name: 'Cinnamon (Daruchini)', price: 5, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 33, name: 'Green Cardamom (Elach)', price: 6, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 34, name: 'Black Cardamom (Boro Elach)', price: 7, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 35, name: 'Nigella Seeds (Kalojeera)', price: 3, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 36, name: 'Fenugreek Seeds (Methi)', price: 2, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 37, name: 'Panch Phoron', price: 4, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 38, name: 'Radhuni', price: 4, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 39, name: 'Dried Red Chilies (Shukna Morich)', price: 3, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 40, name: 'Poppy Seeds (Posto)', price: 8, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 41, name: 'Dried Mango Powder (Amchur)', price: 4, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 77, name: 'Kalo Jire Gura (Ground Nigella)', price: 4, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 78, name: 'Shorisher Gura (Ground Mustard)', price: 3, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 79, name: 'Golmorich Gura (Black Pepper)', price: 5, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 80, name: 'Tej Pata Gura (Ground Bay Leaf)', price: 3, image: '/inventory_images/placeholder.png', category: 'Spices' },
        { id: 81, name: 'Kashundi (Mustard Sauce)', price: 4, image: '/inventory_images/placeholder.png', category: 'Spices' }
    ],
    Snacks: [
        { id: 42, name: 'Chanachur', price: 4, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 43, name: 'Jhalmuri Mix', price: 3, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 44, name: 'Bhaja Moshla', price: 5, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 45, name: 'Daler Bora Mix', price: 4, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 46, name: 'Nimki', price: 4, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 47, name: 'Muri Mixture', price: 3, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 48, name: 'Chaler Bora Mix', price: 4, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 82, name: 'Moa', price: 5, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 83, name: 'Batasa', price: 3, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 84, name: 'Murki', price: 4, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 85, name: 'Kodma', price: 4, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 86, name: 'Teler Pitha Mix', price: 6, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 87, name: 'Bhapa Pitha Mix', price: 6, image: '/inventory_images/placeholder.png', category: 'Snacks' },
        { id: 88, name: 'Patishapta Mix', price: 6, image: '/inventory_images/placeholder.png', category: 'Snacks' }
    ],
    Pickles: [
        { id: 49, name: 'Mango Pickle (Amer Achar)', price: 5, image: '/inventory_images/placeholder.png', category: 'Pickles' },
        { id: 50, name: 'Olive Pickle (Jolpaier Achar)', price: 6, image: '/inventory_images/placeholder.png', category: 'Pickles' },
        { id: 51, name: 'Chili Pickle (Morich Achar)', price: 4, image: '/inventory_images/placeholder.png', category: 'Pickles' },
        { id: 52, name: 'Lemon Pickle (Lebur Achar)', price: 4, image: '/inventory_images/placeholder.png', category: 'Pickles' },
        { id: 53, name: 'Tetul Achar', price: 5, image: '/inventory_images/placeholder.png', category: 'Pickles' },
        { id: 54, name: 'Mixed Pickle (Mix Achar)', price: 5, image: '/inventory_images/placeholder.png', category: 'Pickles' },
        { id: 89, name: 'Dried Mango Pickle (Amshotto)', price: 6, image: '/inventory_images/placeholder.png', category: 'Pickles' },
        { id: 90, name: 'Chalta Pickle', price: 5, image: '/inventory_images/placeholder.png', category: 'Pickles' },
        { id: 91, name: 'Karela Pickle (Ucche)', price: 5, image: '/inventory_images/placeholder.png', category: 'Pickles' },
        { id: 92, name: 'Ada Pickle (Ginger)', price: 5, image: '/inventory_images/placeholder.png', category: 'Pickles' }
    ],
    'Sweets & Ingredients': [
        { id: 55, name: 'Date Palm Jaggery (Khejur Gur)', price: 8, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' },
        { id: 56, name: 'Nolen Gur', price: 10, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' },
        { id: 57, name: 'Chhana (For Sweets)', price: 6, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' },
        { id: 58, name: 'Khoya/Mawa', price: 7, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' },
        { id: 59, name: 'Coconut Powder (Narkel Kora)', price: 4, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' },
        { id: 93, name: 'Patali Gur', price: 7, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' },
        { id: 94, name: 'Roshogolla Mix', price: 8, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' },
        { id: 95, name: 'Mishti Doi Mix', price: 6, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' },
        { id: 96, name: 'Sandesh Mix', price: 7, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' },
        { id: 97, name: 'Chamcham Mix', price: 7, image: '/inventory_images/placeholder.png', category: 'Sweets & Ingredients' }
    ],
    'Fish Products': [
        { id: 60, name: 'Dried Fish (Shutki Mach)', price: 8, image: '/inventory_images/placeholder.png', category: 'Fish Products' },
        { id: 61, name: 'Dried Shrimp (Chingri Shutki)', price: 10, image: '/inventory_images/placeholder.png', category: 'Fish Products' },
        { id: 62, name: 'Fish Masala Mix', price: 4, image: '/inventory_images/placeholder.png', category: 'Fish Products' },
        { id: 98, name: 'Loitta Shutki', price: 9, image: '/inventory_images/placeholder.png', category: 'Fish Products' },
        { id: 99, name: 'Churi Shutki', price: 8, image: '/inventory_images/placeholder.png', category: 'Fish Products' },
        { id: 100, name: 'Kachki Shutki', price: 7, image: '/inventory_images/placeholder.png', category: 'Fish Products' },
        { id: 101, name: 'Dried Fish Powder (Shutki Gura)', price: 6, image: '/inventory_images/placeholder.png', category: 'Fish Products' }
    ],
    'Cooking Essentials': [
        { id: 63, name: 'Mustard Oil (Shorsher Tel)', price: 8, image: '/inventory_images/placeholder.png', category: 'Cooking Essentials' },
        { id: 64, name: 'Ghee', price: 12, image: '/inventory_images/placeholder.png', category: 'Cooking Essentials' },
        { id: 65, name: 'Coconut Oil (Narkel Tel)', price: 7, image: '/inventory_images/placeholder.png', category: 'Cooking Essentials' },
        { id: 66, name: 'Panchforan Masala', price: 4, image: '/inventory_images/placeholder.png', category: 'Cooking Essentials' },
        { id: 67, name: 'Garam Masala', price: 5, image: '/inventory_images/placeholder.png', category: 'Cooking Essentials' },
        { id: 102, name: 'Posto Bata Mix', price: 6, image: '/inventory_images/placeholder.png', category: 'Cooking Essentials' },
        { id: 103, name: 'Shorshe Bata Mix', price: 5, image: '/inventory_images/placeholder.png', category: 'Cooking Essentials' },
        { id: 104, name: 'Doi Maach Masala', price: 4, image: '/inventory_images/placeholder.png', category: 'Cooking Essentials' },
        { id: 105, name: 'Bhapa Ilish Masala', price: 5, image: '/inventory_images/placeholder.png', category: 'Cooking Essentials' }
    ],
    'Ready-to-Cook': [
        { id: 106, name: 'Biryani Masala (Bengali Style)', price: 6, image: '/inventory_images/placeholder.png', category: 'Ready-to-Cook' },
        { id: 107, name: 'Chingri Malai Curry Mix', price: 7, image: '/inventory_images/placeholder.png', category: 'Ready-to-Cook' },
        { id: 108, name: 'Shorshe Ilish Mix', price: 7, image: '/inventory_images/placeholder.png', category: 'Ready-to-Cook' },
        { id: 109, name: 'Kosha Mangsho Masala', price: 6, image: '/inventory_images/placeholder.png', category: 'Ready-to-Cook' },
        { id: 110, name: 'Dhokar Dalna Mix', price: 5, image: '/inventory_images/placeholder.png', category: 'Ready-to-Cook' },
        { id: 111, name: 'Cholar Dal Mix', price: 5, image: '/inventory_images/placeholder.png', category: 'Ready-to-Cook' }
    ],
    'Dairy Products': [
        { id: 112, name: 'Sweet Curd (Mishti Doi)', price: 5, image: '/inventory_images/placeholder.png', category: 'Dairy Products' },
        { id: 113, name: 'Regular Curd (Tok Doi)', price: 4, image: '/inventory_images/placeholder.png', category: 'Dairy Products' },
        { id: 114, name: 'Ghee (Ghritam)', price: 12, image: '/inventory_images/placeholder.png', category: 'Dairy Products' },
        { id: 115, name: 'Butter (Makhan)', price: 8, image: '/inventory_images/placeholder.png', category: 'Dairy Products' },
        { id: 116, name: 'Cottage Cheese (Chhana)', price: 6, image: '/inventory_images/placeholder.png', category: 'Dairy Products' },
        { id: 117, name: 'Kheer Mix', price: 7, image: '/inventory_images/placeholder.png', category: 'Dairy Products' },
        { id: 118, name: 'Rabri Mix', price: 8, image: '/inventory_images/placeholder.png', category: 'Dairy Products' },
        { id: 119, name: 'Paneer', price: 7, image: '/inventory_images/placeholder.png', category: 'Dairy Products' },
        { id: 120, name: 'Lassi Mix', price: 4, image: '/inventory_images/placeholder.png', category: 'Dairy Products' }
    ],
    'Fruits & Dry Fruits': [
        { id: 121, name: 'Mango (Himsagar)', price: 8, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 122, name: 'Mango (Langra)', price: 7, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 123, name: 'Mango (Fazli)', price: 7, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 124, name: 'Litchi (Bombai)', price: 6, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 125, name: 'Jackfruit (Kathal) Chips', price: 5, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 126, name: 'Dried Mango (Amshotto)', price: 6, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 127, name: 'Banana (Chompa)', price: 4, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 128, name: 'Banana (Sagar)', price: 4, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 129, name: 'Dried Dates (Khejur)', price: 5, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 130, name: 'Raisins (Kishmish)', price: 6, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 131, name: 'Coconut (Narkel) - Dried', price: 4, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' },
        { id: 132, name: 'Palm Fruit (Tal) - Dried', price: 5, image: '/inventory_images/placeholder.png', category: 'Fruits & Dry Fruits' }
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

app.use('/inventory_images', express.static('inventory_images'));

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