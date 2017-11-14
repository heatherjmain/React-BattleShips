import React from "react"

const Cell = (props) => {

  const handleCellClick = () => {
    console.log("Cell " + props.location + " has been clicked, status is " + props.grid[props.location])

    props.checkGridPosition(props.location)
  }


  const battleship = "grid-cell " + props.grid[props.location] + "-cell"

  return (
    <div className={battleship} onClick={handleCellClick}></div>
  )
}

export default Cell
