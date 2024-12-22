import './title.styles.css'

const Title = ({ setShowMission, showMission }) => {
    return (
        <h1 className="title" onClick={() => setShowMission(!showMission)}>
            Local Grocery Delivery
        </h1>
    )
}

export default Title