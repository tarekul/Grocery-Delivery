import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { cancelOrder } from "../../functions/cancelOrder";
import getOrder from "../../functions/getOrder";
import { reOrder } from "../../functions/reOrder";
import "./order-details.styles.css";

const OrderDetails = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [reOrdering, setReOrdering] = useState(false);
  const { firebaseUser } = useAuth();

  const formattedDate = orderDetails?.created_at?.seconds
    ? new Date(orderDetails.created_at.seconds * 1000).toLocaleDateString()
    : "N/A";

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderDetails = await getOrder(id);
      setOrderDetails(orderDetails);
    };
    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async () => {
    const token = await firebaseUser.getIdToken();
    setCancelling(true);
    await cancelOrder(id, token);
    setCancelling(false);

    setOrderDetails((prev) => ({
      ...prev,
      status: "Cancelled",
    }));
  };

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const handleReOrder = async () => {
    setReOrdering(true);
    const token = await firebaseUser.getIdToken();
    await reOrder(id, token);
    setReOrdering(false);

    setOrderDetails((prev) => ({
      ...prev,
      status: "Pending",
    }));
  };

  return (
    <div className="order-details">
      {/* Status Section */}
      <header className="order-header">
        <h1 className="order-header-title">
          Status:
          <span className={`status ${orderDetails.status.toLowerCase()}`}>
            {orderDetails.status}
          </span>
        </h1>
        <p>Order #{orderDetails.id}</p>
        <p>Placed on {formattedDate}</p>

        {/* Cancel button only if pending */}
        {orderDetails.status === "Pending" && (
          <button
            className="cancel-btn"
            onClick={handleCancelOrder}
            disabled={cancelling}
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

        {/* Reorder button only if cancelled */}
        {orderDetails.status === "Cancelled" && (
          <button
            className="reorder-btn"
            onClick={handleReOrder}
            disabled={reOrdering}
          >
            {reOrdering ? "Reordering..." : "Reorder"}
          </button>
        )}

        <div className="order-tracker">
          <div
            className={`step ${
              orderDetails.status === "Pending" ? "active" : ""
            }`}
          >
            <span className="circle">1</span>
            <p>Pending</p>
          </div>

          <div
            className={`step ${
              orderDetails.status === "In Progress" ? "active" : ""
            }`}
          >
            <span className="circle">2</span>
            <p>In Progress</p>
          </div>

          <div
            className={`step ${
              orderDetails.status === "Completed" ? "active" : ""
            }`}
          >
            <span className="circle">3</span>
            <p>Completed</p>
          </div>
        </div>
      </header>

      {/* Items Section */}
      <section className="order-items">
        <h2>Your Items</h2>
        {orderDetails.items.map((item) => (
          <div key={item.id} className="item">
            <div className="item-info">
              <span>{item.name}</span>
              <small>
                {item.quantity} × ${item.price.toFixed(2)}
              </small>
            </div>
          </div>
        ))}
        <div className="subtotal">
          Subtotal: ${orderDetails.sub_total.toFixed(2)}
        </div>
      </section>

      {/* Total Section */}
      <section className="order-total">
        <h2>Total Paid</h2>
        <div className="breakdown">
          <p>
            <span>Tax:</span> ${orderDetails.tax.toFixed(2)}
          </p>
          <p>
            <span>Service Fee:</span> ${orderDetails.service_fee.toFixed(2)}
          </p>
          <p>
            <span>Delivery Fee:</span> ${orderDetails.delivery_fee.toFixed(2)}
          </p>
        </div>
        <p className="total-amount">${orderDetails.total_price.toFixed(2)}</p>
      </section>

      {/* Delivery Info */}
      <section className="delivery-info">
        <h2>Delivery To</h2>
        <p>{orderDetails.name}</p>
        <p>
          {orderDetails.address}, {orderDetails.city}, {orderDetails.state}{" "}
          {orderDetails.zipcode}
        </p>
      </section>

      {/* Help Section */}
      <footer className="order-help">
        <p>Need help with your order?</p>
        <button>Contact Support</button>
      </footer>
    </div>
  );
};

export default OrderDetails;
