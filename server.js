const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const verifyInputRequest = require("./middleware/verifyInputRequest.js");
const orderConfirmationEmail = require("./resend.js");

const app = express();
const PORT = process.env.PORT || 5001;

const inventory = require("./inventory.js");
const db = require("./database/db_create.js").db;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Grocery MVP App!");
});

app.get("/inventory", (req, res) => {
  try {
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.use("/inventory_images", express.static("inventory_images"));

app.post("/order", verifyInputRequest, (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    zipcode,
    items,
    totalPrice,
  } = req.body;

  const name = `${firstName} ${lastName}`;
  const total_price = parseFloat(totalPrice);

  const sql = `
        INSERT INTO orders (name, email, phone, address, city, state, zipcode, items, total_price, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.run(
    sql,
    [
      name,
      email,
      phone,
      address,
      city,
      state,
      zipcode,
      JSON.stringify(items),
      total_price,
      new Date(),
    ],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error placing order.");
      } else {
        res.status(201).send({
          message: "Order placed successfully.",
          orderId: this.lastID,
        });
        orderConfirmationEmail({ ...req.body, orderId: this.lastID });
      }
    }
  );
});

app.delete("/order/:id", (req, res) => {
  const orderId = req.params.id;

  db.run("DELETE FROM orders WHERE id = ?", [orderId], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error deleting order.");
    } else {
      res.status(204).send();
    }
  });
});

app.get("/order/:id", (req, res) => {
  const orderId = req.params.id;

  db.get("SELECT * FROM orders WHERE id = ?", [orderId], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error fetching order.");
    } else if (!row) {
      res.status(404).send("Order not found.");
    } else {
      res.json(row);
    }
  });
});

app.get("/orders", (req, res) => {
  db.all("SELECT * FROM orders", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error fetching orders.");
    } else {
      res.json(rows);
    }
  });
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
