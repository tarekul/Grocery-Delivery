const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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
  serverTimestamp,
  doc,
  setDoc,
} = require("firebase/firestore");
const orderConfirmationEmail = require("./mailjet.js");
const db = require("./firebase-config.js");

const app = express();
const PORT = process.env.PORT || 5001;

const inventory = require("./inventory.js");
const verifyUpdateUserRequest = require("./middleware/verifyUpdateUser.js");

const allowedOrigins = [
  "http://localhost:3000", // Local development
  "http://192.168.1.8:3000", // On Network
  "https://local-grocery-delivery.netlify.app", // Deployed frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // allow non-browser requests (like Postman, curl)
      return callback(null, true);
    }

    // Allow if explicitly in the list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow Netlify preview URLs (deploy-preview-* subdomains)
    try {
      const hostname = new URL(origin).hostname;
      if (
        hostname === "local-grocery-delivery.netlify.app" || // main site
        /^deploy-preview-\d+--local-grocery-delivery\.netlify\.app$/.test(
          hostname
        )
      ) {
        return callback(null, true);
      }
    } catch (err) {
      return callback(new Error("Invalid origin"));
    }

    // Otherwise block
    return callback(new Error("Not allowed by CORS"));
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: false,
  allowedHeaders: ["Content-Type", "Authorization"],
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

app.post("/register", verifyInputRequest, async (req, res) => {
  const {
    uid,
    email,
    firstName,
    lastName,
    address,
    zipcode,
    city,
    state,
    phone,
  } = req.body;

  try {
    await setDoc(doc(db, "customers", uid), {
      email,
      firstName,
      lastName,
      address,
      zipcode,
      city,
      state,
      phone,
    });

    res.status(201).send("User registered successfully.");
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to register user.",
      error: error.message,
    });
  }
});

app.get("/user", async (req, res) => {
  const uid = req.query.uid;

  try {
    const docRef = doc(db, "customers", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(200).send(docSnap.data());
    } else {
      res.status(404).send("User not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to fetch user info.",
      error: error.message,
    });
  }
});

app.put("/update-user", verifyUpdateUserRequest, async (req, res) => {
  const { uid, ...rest } = req.body;
  try {
    const docRef = doc(db, "customers", uid);
    const updateData = {};
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).send({ message: "No fields provided to update." });
    }

    await updateDoc(docRef, updateData);
    const updatedUser = await getDoc(docRef);
    if (updatedUser.exists()) {
      res.status(200).send(updatedUser.data());
    } else {
      res.status(404).send("User not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to update user.",
      error: error.message,
    });
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
    customerId,
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
      status: "pending",
      num_items: items.length,
      customer_id: customerId,
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

app.get("/orders/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const ordersDocRef = query(
      collection(db, "orders"),
      where("customer_id", "==", customerId),
      where("status", "in", ["Pending", "In Progress"])
    );
    const ordersDoc = await getDocs(ordersDocRef);

    if (ordersDoc.empty) {
      return res.status(200).send([]);
    }

    const ordersData = ordersDoc.docs.map((doc) => doc.data());
    res.status(200).send(ordersData);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to fetch active orders.",
      error: error.message,
    });
  }
});

app.get("/past-orders/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const pastOrdersDocRef = query(
      collection(db, "orders"),
      where("customer_id", "==", customerId),
      where("status", "==", "Completed")
    );
    const pastOrdersDoc = await getDocs(pastOrdersDocRef);

    if (pastOrdersDoc.empty) {
      return res.status(200).send([]);
    }

    const pastOrdersData = pastOrdersDoc.docs.map((doc) => doc.data());
    res.status(200).send(pastOrdersData);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch active orders.",
      error: error.message,
    });
  }
});

app.post("/chat-message", async (req, res) => {
  const { customerId, message, from } = req.body;
  if (!customerId || !message || !from) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const messagesRef = collection(db, "chats", customerId, "messages");
    const docRef = await addDoc(messagesRef, {
      message,
      from,
      timestamp: serverTimestamp(),
    });

    return res.status(200).json({ success: true, messageId: docRef.id });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({ error: "Failed to save message" });
  }
});

app.get("/chat-messages/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const messagesRef = collection(db, "chats", customerId, "messages");
    const querySnapshot = await getDocs(messagesRef);
    const messages = querySnapshot.docs.map((doc) => doc.data());
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

const activeRooms = {};
const shopperRooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", ({ orderId, isShopper, userId }) => {
    const roomName = `room-${orderId}`;
    socket.join(roomName);

    if (!isShopper) {
      activeRooms[orderId] = activeRooms[orderId] || [];
      if (!activeRooms[orderId].includes(socket.id)) {
        activeRooms[orderId].push(socket.id);
      }
      console.log(
        `Customer ${userId} joined ${roomName}`,
        activeRooms[orderId]
      );
    } else {
      shopperRooms[userId] = shopperRooms[userId] || [];
      if (!shopperRooms[userId].includes(orderId)) {
        shopperRooms[userId].push(orderId);
      }
      console.log(
        `Shopper ${userId} connected for ${roomName}`,
        shopperRooms[userId]
      );
    }
  });

  socket.on(
    "chat-message",
    ({ orderId, message, customerId, isShopper, socketId }) => {
      const roomName = `room-${orderId}`;
      io.to(roomName).emit("chat-message", {
        customerId,
        message,
        from: isShopper ? "shopper" : "customer",
        socketId,
      });
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    // Remove from activeRooms
    for (const [orderId, sockets] of Object.entries(activeRooms)) {
      activeRooms[orderId] = sockets.filter((id) => id !== socket.id);
      if (activeRooms[orderId].length === 0) delete activeRooms[orderId];
    }

    // Remove from shopperRooms
    for (const [userId, orders] of Object.entries(shopperRooms)) {
      shopperRooms[userId] = orders.filter((id) => id !== socket.id);
      if (shopperRooms[userId].length === 0) delete shopperRooms[userId];
    }
  });
});

// Start server
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
