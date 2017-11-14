import React from "react"
import Ship from "./Ship.jsx"

const ShipList = (props) => {

  const shipNodes = props.ships.map(function(ship) {
    return (
      <Ship name={ship.name} image={ship.image} imageName={ship.imageName} key={ship.id} id={ship.id} updateSelectedShip={props.updateSelectedShip} updateSelectedShipAndFlip={props.updateSelectedShipAndFlip}></Ship>
    )
  })

  return (
    <div className="ship-list" id="ship-list">
      {shipNodes}
    </div>
  )

}

export default ShipList
