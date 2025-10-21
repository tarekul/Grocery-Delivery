import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import apiUrl from "../../apiUrl";
import { useAuth } from "../../contexts/authContext";
import "./chat.styles.css";

const Chat = ({ orderDetails }) => {
  const { firebaseUser } = useAuth();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(apiUrl, { transports: ["websocket"] });

    socketRef.current.emit("join-room", {
      orderId: orderDetails.id,
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
  }, [firebaseUser]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setChat((prev) => [
      ...prev,
      {
        from: socketRef.current?.id,
        message,
        customerId: firebaseUser.uid,
      },
    ]);

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
      <div className="chat-window">
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
      </div>
    </div>
  );
};

export default Chat;
