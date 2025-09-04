import { MessageCircle, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import apiUrl from "../../apiUrl";
import { useAuth } from "../../contexts/authContext";
import { searchFAQ } from "../../functions/faqSearch";
import getInProgressOrder from "../../functions/getInProgressOrder";
import "./chat.styles.css";

const Chat = () => {
  const { firebaseUser } = useAuth();
  const [startChat, setStartChat] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!firebaseUser) return;
    const getActiveOrders = async () => {
      const orders = await getInProgressOrder(firebaseUser.uid);
      setOrders(orders);
    };
    getActiveOrders();
  }, [firebaseUser]);

  useEffect(() => {
    if (!startChat || !activeOrderId) return;
    socketRef.current = io(apiUrl, { transports: ["websocket"] });

    socketRef.current.emit("join-room", {
      orderId: activeOrderId,
      userType: "customer",
      userId: firebaseUser.uid,
      socketId: socketRef.current.id,
      isShopper: false,
    });

    socketRef.current.on("chat-message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("chat-message");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [startChat, firebaseUser, activeOrderId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const faqAnswer = searchFAQ(message);
    if (faqAnswer) {
      setChat((prev) => [
        ...prev,
        {
          from: socketRef.current?.id,
          message,
          customerId: firebaseUser.uid,
        },
        { from: "bot", message: faqAnswer },
      ]);

      setMessage("");
      return;
    }

    socketRef.current.emit("chat-message", {
      customerId: firebaseUser.uid,
      message,
      socketId: socketRef.current.id,
      isShopper: false,
    });

    setMessage("");
  };

  return (
    <div className="chat-container">
      {!startChat && activeOrderId && (
        <button className="chat-button" onClick={() => setStartChat(true)}>
          <MessageCircle className="chat-icon" />
        </button>
      )}

      <div className={`chat-window ${startChat ? "open" : ""}`}>
        {startChat && !activeOrderId && (
          <div className="order-selection">
            <h4>Select an order to chat about:</h4>
            {orders.length === 0 ? (
              <p>No active orders.</p>
            ) : (
              <ul>
                {orders.map((order) => (
                  <li key={order.id}>
                    <button onClick={() => setActiveOrderId(order.id)}>
                      Order #{order.id} - {order.status}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {startChat && activeOrderId && (
          <>
            <div className="chat-header">
              <h3>Order Chat</h3>

              <button
                className="icon-btn"
                aria-label="End chat"
                onClick={() => {
                  if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                  }
                  setChat([]);
                  setStartChat(false);
                }}
              >
                <X />
              </button>
            </div>
            <div className="chat-messages">
              {chat.map((msg, i) => (
                <div key={i} className="chat-msg">
                  <b>
                    {msg.from === "bot"
                      ? "Bot"
                      : msg.from === socketRef.current?.id
                      ? "You"
                      : "Shopper"}
                  </b>{" "}
                  {msg.message}
                </div>
              ))}
            </div>

            <div className="chat-composer">
              <input
                type="text"
                value={message}
                placeholder="Type a message…"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && message.trim() && sendMessage()
                }
              />
              <button
                className="send-btn"
                disabled={!message.trim()}
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
