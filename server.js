const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const verifyInputRequest = require("./middleware/verifyInputRequest.js");
const {
  collection,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} = require("firebase/firestore");
const orderConfirmationEmail = require("./mailjet.js");
const db = require("./firebase-config.js");

const app = express();
const PORT = process.env.PORT || 5001;

const inventory = require("./inventory.js");

const allowedOrigins = [
  "http://localhost:3000", // Local development
  "http://192.168.1.8:3000", // On Network
  "https://local-grocery-delivery.netlify.app", // Deployed frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Grocery MVP App!");
});

app.use(
  "/shelf-images",
  express.static(path.join(__dirname, "shelf-images"), {
    maxAge: "30d",
    setHeaders: (res) => {
      res.set("Cache-Control", "public, max-age=2592000");
    },
  })
);

app.get("/inventory", (req, res) => {
  try {
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.post("/order", verifyInputRequest, async (req, res) => {
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
  const total_price = Math.round(parseFloat(totalPrice) * 100) / 100;

  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipcode,
      total_price,
      created_at: new Date(),
      deleted_at: null,
      is_completed: false,
      num_items: items.length,
    });

    for (const itemData of items) {
      await addDoc(collection(db, "order-items"), {
        order_id: orderRef.id,
        item_id: itemData.id,
        name: itemData.name,
        price: itemData.price,
        quantity: itemData.quantity,
      });
    }

    orderConfirmationEmail({ ...req.body, orderId: orderRef.id });

    res.status(201).send({
      message: "Order placed successfully.",
      orderId: orderRef.id,
    });
  } catch (error) {
    // Rollback the order if it was created
    if (orderRef?.id) {
      await deleteDoc(doc(db, "orders", orderRef.id));
    }

    res.status(500).send({
      message: "Failed to place order.",
      error: error.message,
    });
  }
});

app.post("/order/cancel", async (req, res) => {
  const orderId = req.body.orderId;
  const email = req.body.email;

  if (!orderId || !email) {
    return res.status(400).send("Order ID and Email are required.");
  }

  try {
    const orderDocRef = doc(db, "orders", orderId);
    const orderDoc = await getDoc(orderDocRef);

    if (!orderDoc.exists()) {
      return res.status(404).send("Order not found.");
    }

    const orderData = orderDoc.data();

    if (orderData.email != email) {
      return res.status(403).send("Forbidden. Email does not match record.");
    }

    if (orderData.deleted_at) {
      return res.status(409).send("Order has already been cancelled.");
    }

    if (orderData.is_completed) {
      return res.status(409).send("Order has already been completed.");
    }

    const TEN_MINUTES = 10 * 60 * 1000;

    if (
      orderData.created_at &&
      Date.now() - orderData.created_at.toMillis() > TEN_MINUTES
    ) {
      return res
        .status(403)
        .send("Order cannot be cancelled after 10 minutes.");
    }

    await updateDoc(doc(db, "orders", orderDoc.id), {
      deleted_at: new Date(),
    });

    res.status(200).send("Order cancelled successfully.");
  } catch (error) {
    res.status(500).send({
      message: "Failed to cancel order.",
      error: error.message,
    });
  }
});

app.get("/order/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const q = query(collection(db, "orders"), where("id", "==", orderId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).send("Order not found.");
    }

    const orderDoc = querySnapshot.docs[0];
    const orderData = orderDoc.data();

    return res.status(200).send(orderData);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch order.",
      error: error.message,
    });
  }
});

function sortByQuantity(items) {
  return Object.entries(items)
    .sort((a, b) => b[1][0] - a[1][0])
    .map(([key, value]) => value[1]);
}

app.get("/top-selling-items", async (req, res) => {
  try {
    const q = query(collection(db, "order-items"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).send("No items found.");
    }

    const itemCount = {};

    querySnapshot.forEach((doc) => {
      const { item, quantity } = doc.data();
      const itemKey = `${item.name}`;

      if (itemCount[itemKey]) {
        itemCount[itemKey][0] += quantity;
      } else {
        itemCount[itemKey] = [quantity, item];
      }
    });

    const topSellingItems = sortByQuantity(itemCount).slice(0, 8);

    res.status(200).send(topSellingItems);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
