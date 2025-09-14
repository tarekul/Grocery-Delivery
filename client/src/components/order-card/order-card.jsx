import { useNavigate } from "react-router-dom";
import "./order-card.styles.css";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const formattedDate = new Date(
    order.created_at.seconds * 1000
  ).toLocaleDateString();

  return (
    <div
      className={`order-card ${
        order.status === "Completed"
          ? "completed"
          : order.status === "In Progress"
          ? "in-progress"
          : "pending"
      }`}
      onClick={() => navigate(`/order-details/${order.id}`)}
    >
      <div className="order-header">
        <h3>Order Summary</h3>
        <p>{formattedDate}</p>
      </div>

      <div className="order-info">
        <p>Items: {order.num_items}</p>
        <p>Total: ${order.total_price.toFixed(2)}</p>
        <p>
          Status:{" "}
          {order.status === "Completed"
            ? "Completed"
            : order.status === "In Progress"
            ? "In Progress"
            : "Pending"}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
