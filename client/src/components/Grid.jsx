import React from "react"
import Cell from "./Cell.jsx"

const Grid = (props) => {

  const cellNodes = props.grid.map(function(cell, index) {
    return (
      <Cell key={index} location={index} checkGridPosition={props.checkGridPosition} grid={props.grid} />
    )
  })

  return (
    <div className="grid">
      {cellNodes}
    </div>
  )
}

export default Grid
