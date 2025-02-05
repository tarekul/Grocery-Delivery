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

let isProcessingOrder = false;
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

  isProcessingOrder = true;

  setTimeout(() => {
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
        isProcessingOrder = false;
        if (err) {
          console.error(err.message);
          res.status(500).send("Error placing order.");
        } else {
          res.status(201).send("Order placed successfully.");
          orderConfirmationEmail(req.body);
        }
      }
    );
  }, 180000);

  res.status(202).send("Order is being processed.");
});

app.get("/order/status", (req, res) => {
  if (isProcessingOrder) {
    res.status(202).send("Order is still being processed.");
  } else {
    res.status(200).send("No order is currently being processed.");
  }
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
