import React from "react"

const Ship = (props) => {

  // console.log(props);

  const handleShipClick = (event) => {
    if (event.type === "click") {
      console.log("ship left clicked-" + props.id)
      props.updateSelectedShip(props.id)
    } else if (event.type === "contextmenu") {
      event.preventDefault()
      console.log("ship right clicked-" + props.id);
      props.updateSelectedShipAndFlip(props.id)
    }

  }

  return(
    <div onClick={handleShipClick} onContextMenu={handleShipClick}>
      <img className={props.imageName} src={props.image} alt={props.name} />
      <p className="ship-name-text">{props.name}</p>
    </div>
  )
}

export default Ship
