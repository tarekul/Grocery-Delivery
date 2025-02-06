const db = require("./db.js");

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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deletedAt DATETIME DEFAULT NULL
    )`);

exports.db = db;
