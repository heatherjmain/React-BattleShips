import React from "react"
import Cell from "./Cell.jsx"

const Grid = (props) => {

  const cellNodes = props.grid.map(function(cell, index) {
    return (
      <Cell key={index} location={index}  grid={props.grid} onClick={props.onClick} />
    )
  })

  return (
    <div className="grid">
      {cellNodes}
    </div>
  )
}

export default Grid
