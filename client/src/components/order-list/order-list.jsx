import OrderCard from "../order-card/order-card";
import "./order-list.styles.css";

const OrderList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p>No orders found</p>;
  }

  return (
    <div className="order-list">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;
