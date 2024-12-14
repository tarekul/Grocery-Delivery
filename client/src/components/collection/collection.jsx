import './collection.styles.css';

const collection = ({ getInventoryByCategory }) => {
    return (
    <select id="category-filter" onChange={e => getInventoryByCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="grains">Grains</option>
        <option value="lentils">Lentils</option>
        <option value="spices">Spices</option>
        <option value="vegetables">Vegetables</option>
        <option value="dairy">Dairy</option>
        <option value="fruits">Fruits</option>
        <option value="miscellaneous">Miscellaneous</option>
    </select>
  )
}

export default collection;