import React from "react";
import CardItemsCarousel from "../card-item-carousel/card-items-carousel";
import "./carousel-container.styles.css";

const CarouselContainer = ({ inventory, cart, editCart, topSelling }) => {
  return (
    <div className="carousel-container">
      {topSelling.length > 0 && (
        <CardItemsCarousel
          inventory={topSelling}
          category="Top Selling"
          editCart={editCart}
          cart={cart}
        />
      )}
      {Object.entries(inventory).map(([category, items]) => (
        <CardItemsCarousel
          key={category}
          inventory={items}
          category={category}
          editCart={editCart}
          cart={cart}
        />
      ))}
    </div>
  );
};

export default CarouselContainer;
