const { default: CardItemsCarousel } = require("../card-item-carousel/card-items-carousel")

const CategoryCarousel = ({inventory, editCart, isDropdownOpen}) => {
    return (
        <div className="category-carousel">
            {
                Object.entries(inventory).map(([category, items]) => (
                    <CardItemsCarousel 
                        key={category} 
                        inventory={items} 
                        category={category} 
                        editCart={editCart} 
                        isDropdownOpen={isDropdownOpen} 
                    />
                ))
            }
        </div>
    )
}

export default CategoryCarousel;