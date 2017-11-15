import React from "react"

const Cell = (props) => {

  const handleCellClick = () => {
    console.log("Cell " + props.location + " has been clicked, status is " + props.grid[props.location])

    // props.checkGridPosition(props.location)
    props.onClick(props.location)
  }


  const battleship = "grid-cell " + props.grid[props.location].imageName + "-cell"

  return (
    <div className={battleship} onClick={handleCellClick}>{props.grid[props.location].status}</div>
  )
}

export default Cell
