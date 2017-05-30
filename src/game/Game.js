require("./game.scss");
import React from "react";
import GameTile from "./GameTile";

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      boardWidth: 10,
      boardHeight: 10,
      tileWidth: 20,
      tileHeight: 20,
      tiles: [
        {
          "id": 0,
          "x": 1,
          "y": 2,
          "fill": "#39f",
        }
      ],
      shapes: [
        {
          name: "triangle",
          tiles: [
            {"x": 1, "y": 0, "fill": "orange"},
            {"x": 0, "y": 1, "fill": "orange"},
            {"x": 1, "y": 1, "fill": "orange"},
            {"x": 2, "y": 1, "fill": "orange"}
          ]
        }
      ],
      get fallingElement() {
        return this.shapes[0];
      }
    };
  }

  render() {
    let gameWidth = this.state.boardWidth * this.state.tileWidth;
    let gameHeight = this.state.boardHeight * this.state.tileHeight;
    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;

    let bgArray = [];

    for (var i = 0; i < this.state.boardHeight; i++) {
      for (var j = 0; j < this.state.boardWidth; j++) {
        let bgTile = {
          "id": (i * this.state.boardWidth + j),
          "x": i,
          "y": j,
          "fill": "#ddd",
        };
        bgArray.push(bgTile);
      }
    }

    return (
      <div class="game">
        <svg className="game__svg" version="1.1" viewBox={"0 0 " + gameWidth + " " + gameHeight}>
        {
          bgArray.map(function(item) {
            return <GameTile
              key={item.id}
              tileObj={item}
              width={tileWidth}
              height={tileHeight}
            />
          })
        };
        {
          this.state.fallingElement.tiles.map(function(item, index) {
            return <GameTile
              key={index}
              tileObj={item}
              width={tileWidth}
              height={tileHeight}
            />
          })
        };

        </svg>
      </div>
    )
  }
}
