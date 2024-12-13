import './dropdown-container.styles.css'

const DropdownContainer = ({ children }) => {
    return (
        <div className="dropdown-container">
            {children}
        </div>
    );
}

export default DropdownContainer;