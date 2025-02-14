const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const verifyInputRequest = require("./middleware/verifyInputRequest.js");
const {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} = require("firebase/firestore");
const orderConfirmationEmail = require("./resend.js");
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
};

app.use(cors(corsOptions));
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
  const total_price = parseFloat(totalPrice);

  try {
    const orderRef = await addDoc(collection(db, "orders"), {
      name,
      email,
      phone,
      address,
      city,
      state,
      zipcode,
      items,
      total_price,
      created_at: new Date(),
      deletedAt: null,
    });

    orderConfirmationEmail({ ...req.body, orderId: orderRef.id });

    res.status(201).send({
      message: "Order placed successfully.",
      orderId: orderRef.id,
    });
  } catch (error) {
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

    const FIVE_MINUTES = 5 * 60 * 1000;
    if (
      orderData.createdAt &&
      Date.now() - orderData.createdAt.toMillis() > FIVE_MINUTES
    ) {
      return res.status(403).send("Order cannot be cancelled after 5 minutes.");
    }

    if (orderData.deletedAt) {
      return res.status(409).send("Order has already been cancelled.");
    }

    await updateDoc(doc(db, "orders", orderDoc.id), {
      deletedAt: new Date(),
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

app.get("/orders", async (req, res) => {
  try {
    const q = query(collection(db, "orders"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).send("No orders found.");
    }

    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ ...doc.data(), id: doc.id });
    });

    return res.status(200).send(orders);
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
