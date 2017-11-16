//to run
// npm install
// nodemon server.js
// npm run build


import React from "react"
import ShipList from "../components/ShipLIst.jsx"
import Grid from "../components/Grid.jsx"
import PlayerSelectButtons from "../components/PlayerSelectButtons"
import io from "socket.io-client"

class GameContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ships: [
        {
          id: 1,
          name: "Battleship",
          imageName: "battleship",
          length: 6,
          image: "./images/battleship",
          placed: false,
          direction: "horizontal"
        },
        {
          id: 2,
          name: "Aircraft Carrier",
          imageName: "aircraftcarrier",
          length: 5,
          image: "./images/aircraft_carrier",
          placed: false,
          direction: "horizontal"
        },
        {
          id: 3,
          name: "Destroyer",
          imageName: "destroyer",
          length: 4,
          image: "./images/destroyer",
          placed: false,
          direction: "horizontal"
        },
        {
          id: 4,
          name: "Submarine",
          imageName: "submarine",
          length: 3,
          image: "./images/submarine",
          placed: false,
          direction: "horizontal"
        },
        {
          id: 5,
          name: "Samll Ship 1",
          imageName: "smallship1",
          length: 2,
          image: "./images/small_ship",
          placed: false,
          direction: "horizontal"
        },
        {
          id: 6,
          name: "Small Ship 2",
          imageName: "smallship2",
          length: 2,
          image: "./images/small_ship",
          placed: false,
          direction: "horizontal"
        }
      ],

      grid: Array(64).fill({imageName: null, status: null}),

      oppGrid: Array(64).fill({imageName: null, status: null}),

      selectedShip: null,

      player: null,

      currentGuess: null
    }

    this.socket = io("http://localhost:3001");
    this.socket.on('confirmGuess', this.checkIfItsMyGuess.bind(this));
    this.socket.on('confirmGuessResult', this.updateGrid.bind(this));


    this.checkGridPosition = this.checkGridPosition.bind(this)
    this.checkPositionAvailable = this.checkPositionAvailable.bind(this)
    this.updateSelectedShip = this.updateSelectedShip.bind(this)
    this.updateShipHasBeenPlaced = this.updateShipHasBeenPlaced.bind(this)
    this.updateSelectedShipAndFlip = this.updateSelectedShipAndFlip.bind(this)
    this.assignPlayer = this.assignPlayer.bind(this)
    this.emitGuess = this.emitGuess.bind(this)
  }


  emitGuess(guess) {
    this.socket.emit("makeGuess", {guessingPlayer: this.state.player, guess: guess})
    // console.log("GUESS; ", guess)
  }

  checkGuess(currentGuess) {
    console.log("Guess is being checked ", currentGuess)
    const checkCell = this.state.grid[currentGuess.guess]
    console.log("checkCell", checkCell)
    if (checkCell.imageName === null) {
      this.socket.emit("guessResult", {guessingPlayer: currentGuess.guessingPlayer, guess: currentGuess.guess, status: "❌"})
    } else {
      this.socket.emit("guessResult", {guessingPlayer: currentGuess.guessingPlayer, guess: currentGuess.guess, status: "🔥"})

    }
    // console.log("oppGrid", this.state.oppGrid);
  }

  updateGrid(result){
    console.log("inupdateGrid", result)
    if (result.guessingPlayer === this.state.player) {
      const newCell = {imageName: this.state.oppGrid[result.guess].imageName, status: this.state.oppGrid[result.guess].status}
      newCell.status = result.status;
      const newOppGrid = JSON.parse(JSON.stringify(this.state.oppGrid))
      newOppGrid[result.guess] = newCell
      console.log(newOppGrid)
      this.setState({oppGrid: newOppGrid})
    } else {
      const newCell = {imageName: this.state.grid[result.guess].imageName, status: this.state.grid[result.guess].status}
      newCell.status = result.status;
      const newGrid = JSON.parse(JSON.stringify(this.state.grid))
      newGrid[result.guess] = newCell
      this.setState({grid: newGrid})
    }
  }


  checkIfItsMyGuess(currentGuess) {
    console.log("currentGuess", currentGuess)
    if (currentGuess.guessingPlayer !== this.state.player) {
      this.checkGuess(currentGuess)
    }
  }

  assignPlayer(player) {
    if (this.state.player === null) {
      this.setState({
        player: player
      })
    }
  }


  updateSelectedShip(id) {
    for (let ship of this.state.ships) {
      if ((id === ship.id) && (ship.placed === false)) {
        console.log("left clicked ship", ship);
        this.setState({
          selectedShip: ship
        })
        // console.log("selectedShip", this.state.selectedShip)
      }
    }
  }

  updateSelectedShipAndFlip(id) {
    for (let ship of this.state.ships) {
      if ((id === ship.id) && (ship.placed === false)) {
        ship.direction = "vertical"
        console.log("right clicked ship", ship);
        this.setState({
          selectedShip: ship
        })
      }
    }
  }



  updateShipHasBeenPlaced(id) {
    for (let ship of this.state.ships) {
      if (id === ship.id) {
        ship.placed = true
      }
      // console.log(ship)
    }
  }

  onSameRow(shipPosition) {
    const divisibleBy8 = []
    for (let index of shipPosition) {
      divisibleBy8.push(Math.floor(index/8))
    }
    // console.log(divisibleBy8)

    for (let i = 0; i < divisibleBy8.length-1; i++) {
      if (divisibleBy8[i] !== divisibleBy8[i+1]) {
        return false
      }
    }
    return true
  }


  checkPositionAvailable(location, shipLength, direction) {

    if (direction === "horizontal") {
      const shipPosition = []
      // console.log(location, shipLength)
      for (let i=location; i<location+shipLength; i++) {
        if (this.state.grid[i].imageName === null) {
          shipPosition.push(i)
          // console.log(Math.floor(i/8))
          // console.log(this.state.grid[i])
        }
        if ((shipPosition.length === shipLength) && (this.onSameRow(shipPosition))) {
          const newGrid = [...this.state.grid]
          for (let cell of shipPosition) {
            const cellContents = {imageName: this.state.selectedShip.imageName, status: null}
            newGrid[cell] = cellContents
          }
          this.setState({
            grid: newGrid
          })

          this.setState({
            selectedShip: null
          })

          this.updateShipHasBeenPlaced(this.state.selectedShip.id)
          // console.log("ID", this.state.selectedShip.id)
        }
      }
      console.log(shipPosition)

    } else if (direction === "vertical") {
      // console.log("VERTICAL");
        const verticalShipPosition = []

        for (let i=location; i<location+(shipLength*8); i+=8) {
        if (this.state.grid[i].imageName === null) {
          verticalShipPosition.push(i)
          // console.log("I", this.state.grid[i]);
        }

        if (verticalShipPosition.length === shipLength) {
          const newGrid = [...this.state.grid]
          for (let cell of verticalShipPosition) {
            const cellContents = {imageName: this.state.selectedShip.imageName, status:null}
            newGrid[cell] = cellContents
          }
          this.setState({
            grid: newGrid
          })

          this.setState({
            selectedShip: null
          })

          this.updateShipHasBeenPlaced(this.state.selectedShip.id)
        }
      }
      console.log(verticalShipPosition);
    }
  }


  checkGridPosition(location) {
    // console.log(this.state.grid[location])
    if (this.state.grid[location].imageName === null && this.state.player !== null) {
      this.checkPositionAvailable(location, this.state.selectedShip.length, this.state.selectedShip.direction)
      // console.log(this.state.selectedShip.length)
    }
  }

  render() {
    return (
      <div>

        <h1 className="title">BattleShips</h1>
        <h3 className="choose-player-text">Which player are you?</h3>

        <div>
          <PlayerSelectButtons assignPlayer={this.assignPlayer} />
        </div>

        <div className="instructions">
          {/* <p>Place your ships...</p> */}
          <p>Choose a ship and then click on the map to position it!</p>

          <div className="instructions-small">
            <p>Left click the ship to place it horizontally</p>
            <p>Right click the ship to place it vertically</p>
          </div>

        </div>

        <div className="map-and-ships">

          <div>
            <h3 className="grid-title">My Fleet</h3>
            <Grid grid={this.state.grid} onClick={this.checkGridPosition} emitGuess={this.emitGuess} />
          </div>

          <div className="ships">
            <ShipList ships={this.state.ships} updateSelectedShip={this.updateSelectedShip} updateSelectedShipAndFlip={this.updateSelectedShipAndFlip} />
          </div>

          <div>
            <h3 className="grid-title">Enemy Fleet</h3>
            <Grid grid={this.state.oppGrid} onClick={this.emitGuess}/>
          </div>

        </div>



      </div>
    )
  }
}

export default GameContainer









// import React from "react"
// import ShipList from "../components/ShipLIst.jsx"
// import Grid from "../components/Grid.jsx"
//
// class GameContainer extends React.Component {
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       ships: [
//         {
//           id: 1,
//           name: "Battleship",
//           imageName: "battleship",
//           length: 6,
//           image: "./images/battleship",
//           placed: false,
//           direction: "horizontal"
//         },
//         {
//           id: 2,
//           name: "Aircraft Carrier",
//           imageName: "aircraftcarrier",
//           length: 5,
//           image: "./images/aircraft_carrier",
//           placed: false,
//           direction: "horizontal"
//         },
//         {
//           id: 3,
//           name: "Destroyer",
//           imageName: "destroyer",
//           length: 4,
//           image: "./images/destroyer",
//           placed: false,
//           direction: "horizontal"
//         },
//         {
//           id: 4,
//           name: "Submarine",
//           imageName: "submarine",
//           length: 3,
//           image: "./images/submarine",
//           placed: false,
//           direction: "horizontal"
//         },
//         {
//           id: 5,
//           name: "Samll Ship 1",
//           imageName: "smallship1",
//           length: 2,
//           image: "./images/small_ship",
//           placed: false,
//           direction: "horizontal"
//         },
//         {
//           id: 6,
//           name: "Small Ship 2",
//           imageName: "smallship2",
//           length: 2,
//           image: "./images/small_ship",
//           placed: false,
//           direction: "horizontal"
//         }
//       ],
//
//       grid: Array(64).fill(null),
//
//       selectedShip: null
//     }
//
//
//
//     this.checkGridPosition = this.checkGridPosition.bind(this)
//     this.checkPositionAvailable = this.checkPositionAvailable.bind(this)
//     this.updateSelectedShip = this.updateSelectedShip.bind(this)
//     this.updateShipHasBeenPlaced = this.updateShipHasBeenPlaced.bind(this)
//     this.updateSelectedShipAndFlip = this.updateSelectedShipAndFlip.bind(this)
//   }
//
//
//   updateSelectedShip(id) {
//     for (let ship of this.state.ships) {
//       if ((id === ship.id) && (ship.placed === false)) {
//         console.log("left clicked ship", ship);
//         this.setState({
//           selectedShip: ship
//         })
//         // console.log("selectedShip", this.state.selectedShip)
//       }
//     }
//   }
//
//   updateSelectedShipAndFlip(id) {
//     for (let ship of this.state.ships) {
//       if ((id === ship.id) && (ship.placed === false)) {
//         ship.direction = "vertical"
//         console.log("right clicked ship", ship);
//         this.setState({
//           selectedShip: ship
//         })
//       }
//     }
//   }
//
//
//
//   updateShipHasBeenPlaced(id) {
//     for (let ship of this.state.ships) {
//       if (id === ship.id) {
//         ship.placed = true
//       }
//       // console.log(ship)
//     }
//   }
//
//   onSameRow(shipPosition) {
//     const divisibleBy8 = []
//     for (let index of shipPosition) {
//       divisibleBy8.push(Math.floor(index/8))
//     }
//     // console.log(divisibleBy8)
//
//     for (let i = 0; i < divisibleBy8.length-1; i++) {
//       if (divisibleBy8[i] !== divisibleBy8[i+1]) {
//         return false
//       }
//     }
//     return true
//   }
//
//
//   checkPositionAvailable(location, shipLength, direction) {
//
//     if (direction === "horizontal") {
//       const shipPosition = []
//       // console.log(location, shipLength)
//       for (let i=location; i<location+shipLength; i++) {
//         if (this.state.grid[i] === null) {
//           shipPosition.push(i)
//           // console.log(Math.floor(i/8))
//           // console.log(this.state.grid[i])
//         }
//         // console.log(shipPosition);
//         if ((shipPosition.length === shipLength) && (this.onSameRow(shipPosition))) {
//           const newGrid = [...this.state.grid]
//           for (let cell of shipPosition) {
//             newGrid[cell] = this.state.selectedShip.imageName
//           }
//           this.setState({
//             grid: newGrid
//           })
//
//           this.setState({
//             selectedShip: null
//           })
//
//           this.updateShipHasBeenPlaced(this.state.selectedShip.id)
//           // console.log("ID", this.state.selectedShip.id)
//         }
//       }
//
//     } else if (direction === "vertical") {
//       console.log("VERTICAL");
//         const verticalShipPosition = []
//
//         for (let i=location; i<location+(shipLength*8); i+=8) {
//         if (this.state.grid[i] === null) {
//           verticalShipPosition.push(i)
//           console.log("I", this.state.grid[i]);
//         }
//
//         if (verticalShipPosition.length === shipLength) {
//           const newGrid = [...this.state.grid]
//           for (let cell of verticalShipPosition) {
//             newGrid[cell] = this.state.selectedShip.imageName
//           }
//           this.setState({
//             grid: newGrid
//           })
//
//           this.setState({
//             selectedShip: null
//           })
//
//           this.updateShipHasBeenPlaced(this.state.selectedShip.id)
//         }
//       }
//       console.log(verticalShipPosition);
//     }
//   }
//
//
//   checkGridPosition(location) {
//     // console.log(this.state.grid[location])
//     if (this.state.grid[location] === null) {
//       this.checkPositionAvailable(location, this.state.selectedShip.length, this.state.selectedShip.direction)
//       // console.log(this.state.selectedShip.length)
//     }
//   }
//
//   render() {
//     return (
//       <div>
//
//         <h1 className="title">BattleShips</h1>
//
//         <div className="map-and-ships">
//           <Grid grid={this.state.grid} checkGridPosition={this.checkGridPosition} />
//
//           <div className="instructions">
//             <p>Place your ships...</p>
//             <p>Choose a ship and then click on the map to position it!</p>
//             <div className="instructions-small">
//               <p>Left click the ship to place it horizontally</p>
//               <p>Right click the ship to place it vertically</p>
//             </div>
//           </div>
//
//
//           <div className="ships">
//             <ShipList ships={this.state.ships} updateSelectedShip={this.updateSelectedShip} updateSelectedShipAndFlip={this.updateSelectedShipAndFlip} />
//           </div>
//
//         </div>
//
//       </div>
//     )
//   }
// }
//
// export default GameContainer
