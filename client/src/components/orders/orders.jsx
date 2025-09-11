import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import getActiveOrders from "../../functions/getActiveOrders";
import getPastOrders from "../../functions/getPastOrders";
import OrderList from "../order-list/order-list";
import SkeletonOrderCard from "../skeleton-order-card/skeleton-order-card";
import "./orders.styles.css";

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [error, setError] = useState(null);

  const { firebaseUser } = useAuth();

  useEffect(() => {
    if (!firebaseUser) return;

    let isMounted = true;

    async function fetchOrders() {
      try {
        const [active, past] = await Promise.all([
          getActiveOrders(firebaseUser.uid),
          getPastOrders(firebaseUser.uid),
        ]);

        if (isMounted) {
          setActiveOrders(active);
          setPastOrders(past);
          setLoading(false);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching orders:", err);
          setError("Failed to load orders. Please try again.");
        }
      }
    }

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, [firebaseUser]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="tab-container">
        {activeTab === "past" ? (
          <button className="active-tab" onClick={() => setActiveTab("active")}>
            Active Orders
          </button>
        ) : (
          <button className="past-tab" onClick={() => setActiveTab("past")}>
            Past Orders
          </button>
        )}
      </div>
      <div className="order-container">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <SkeletonOrderCard key={`active-skeleton-${i}`} />
          ))
        ) : activeTab === "active" ? (
          <OrderList orders={activeOrders} />
        ) : (
          <OrderList orders={pastOrders} />
        )}
      </div>
    </div>
  );
};

export default Orders;
