import SkeletonOrderCard from "../skeleton-order-card/skeleton-order-card";

const Orders = () => {
  return (
    <div>
      <h1>Active Orders</h1>
      <div>
        <SkeletonOrderCard />
        <SkeletonOrderCard />
      </div>
      <h1>Past Orders</h1>
      <div>
        <SkeletonOrderCard />
        <SkeletonOrderCard />
      </div>
    </div>
  );
};

export default Orders;
