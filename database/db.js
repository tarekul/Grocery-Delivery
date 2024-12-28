const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./grocery.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

db.run(`
    Create table if not exists orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zipcode TEXT,
        items TEXT,
        total_price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

module.exports = db;