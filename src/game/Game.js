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
      pile: {
        tiles: []
      },
      shapes: [
        {
          name: "triangle",
          tiles: [
            {"x": 1, "y": 0, "fill": "orange"},
            {"x": 0, "y": 1, "fill": "orange"},
            {"x": 1, "y": 1, "fill": "orange"},
            {"x": 2, "y": 1, "fill": "orange"}
          ]
        },
        {
          name: "rectangle",
          tiles: [
            {"x": 0, "y": 0, "fill": "skyblue"},
            {"x": 1, "y": 0, "fill": "skyblue"},
            {"x": 0, "y": 1, "fill": "skyblue"},
            {"x": 1, "y": 1, "fill": "skyblue"}
          ]
        },
        {
          name: "line",
          tiles: [
            {"x": 0, "y": 0, "fill": "red"},
            {"x": 1, "y": 0, "fill": "red"},
            {"x": 2, "y": 0, "fill": "red"},
            {"x": 3, "y": 0, "fill": "red"}
          ]
        },
        {
          name: "S-shape",
          tiles: [
            {"x": 0, "y": 0, "fill": "rebeccapurple"},
            {"x": 1, "y": 0, "fill": "rebeccapurple"},
            {"x": 1, "y": 1, "fill": "rebeccapurple"},
            {"x": 2, "y": 1, "fill": "rebeccapurple"}
          ]
        },
        {
          name: "Z-shape",
          tiles: [
            {"x": 0, "y": 1, "fill": "hotpink"},
            {"x": 1, "y": 1, "fill": "hotpink"},
            {"x": 1, "y": 0, "fill": "hotpink"},
            {"x": 2, "y": 0, "fill": "hotpink"}
          ]
        },
        {
          name: "L-shape",
          tiles: [
            {"x": 0, "y": 1, "fill": "salmon"},
            {"x": 1, "y": 1, "fill": "salmon"},
            {"x": 2, "y": 0, "fill": "salmon"},
            {"x": 2, "y": 1, "fill": "salmon"}
          ]
        },
        {
          name: "flipped L-shape",
          tiles: [
            {"x": 0, "y": 0, "fill": "tomato"},
            {"x": 0, "y": 1, "fill": "tomato"},
            {"x": 1, "y": 1, "fill": "tomato"},
            {"x": 2, "y": 1, "fill": "tomato"}
          ]
        }
      ],
      fallingObject: {
        tiles: []
      },
      rotation: 0,
      fallingInterval: "",
      gameSpeed: 1000,
      onFalling: this.onFalling.bind(this),
      onLanded: this.onLanded.bind(this),
      onEnd: this.onEnd.bind(this),
      drop: this.drop.bind(this),
      clearRow: this.clearRow.bind(this),
      handleKeys: this.handleKeys.bind(this),
      moveObject: this.moveObject.bind(this),
      rotateObject: this.rotateObject.bind(this)
    };
  }

  clearRow () {
    console.log("clearRow");

    let pile = this.state.pile;
    let shiftLevel = 0;
    for (let i = this.state.boardHeight; i > 0 ; i--) {
      // in each row
      let rowFullfilled = true;
      let rowTiles = [];
      for (let j = 0; j < this.state.boardWidth; j++) {
        // in each column
        let blockFilled = false;
        let pileMatching;
        for (let k = 0; k < pile.tiles.length; k++) {
          // in each existing items
          let pileElem = pile.tiles[k];

          if (pileElem.x === j && pileElem.y === i-1) {
            // found
            blockFilled = true;
            pileMatching = pileElem;
            pileElem.fill = "yellow";
          }
        }
        if (blockFilled) {
          rowTiles.push(pileMatching);
        } else {
          rowFullfilled = false;
          //continue;
        }
      }
      if (rowFullfilled) {
        shiftLevel ++;
        console.log("rowFullfilled", rowTiles);
        for (let l = 0; l < rowTiles.length; l++) {
          let element = rowTiles[l].fill = "darkslategray";
          let tiles = this.state.pile.tiles;
          let index = tiles.indexOf(rowTiles[l])
          tiles.splice(index, 1);
          this.setState({tiles});
        }
      } else {
        for (let l = 0; l < rowTiles.length; l++) {
          let element = rowTiles[l];
          element.y += shiftLevel;
        }
      }
    }
  }

  onEnd () {
    console.log("end");
    clearInterval(this.state.fallingInterval);
  }

  onFalling () {
    //console.log("falling");
    this.state.moveObject("down");
  }

  onLanded () {
    //console.log("landed");
    clearInterval(this.state.fallingInterval);
    let fallingTiles = this.state.fallingObject.tiles;
    let tiles = this.state.pile.tiles;

    for (let i = 0; i < fallingTiles.length; i++) {
      tiles.push(fallingTiles[i]);
    }

    //this.setState({tiles});
    this.state.clearRow();
    this.state.drop();
  }

  drop () {
    //console.log("drop");
    let shapes = this.state.shapes;
    let randomTile = Math.floor(shapes.length * Math.random());
    let tiles = [];

    for (let i = 0; i < shapes[randomTile].tiles.length; i++) {
      tiles.push(Object.assign({}, shapes[randomTile].tiles[i]));
      //tiles.push(JSON.parse(JSON.stringify(shapes[randomTile].tiles[i])));
    }
    let fallingObject = {};
    fallingObject.tiles = tiles;

    this.setState({
      fallingObject
    });

    let pile = this.state.pile;
    // check if move is possible
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];

      for (let j = 0; j < pile.tiles.length; j++) {
        let pileElem = pile.tiles[j];

        if (pileElem.x === tile.x) {
          // tile is beside on pile
          if (pileElem.y === tile.y) {
            this.state.onEnd();
            return;
          }
        }
      }
    }

    clearInterval(this.state.fallingInterval);
    this.state.fallingInterval = setInterval(this.state.onFalling, this.state.gameSpeed);
  }

  componentDidMount() {
    this.state.drop();

    document.addEventListener("keydown", this.state.handleKeys, false);
  }

  moveObject (dir) {
    let tiles = this.state.fallingObject.tiles;
    let pile = this.state.pile;
    let boundariesRight = Math.max.apply(Math,tiles.map(function(o){return o.x;}));
    let boundariesLeft = Math.min.apply(Math,tiles.map(function(o){return o.x;}));
    let boundariesBottom = Math.max.apply(Math,tiles.map(function(o){return o.y;}));
    if (dir === "right") {


      if (boundariesRight + 1 < this.state.boardWidth) {

        // check if falling tiles are already touching pile of tiles
        for (let i = 0; i < tiles.length; i++) {
          let tile = tiles[i];

          for (let j = 0; j < pile.tiles.length; j++) {
            let pileElem = pile.tiles[j];

            if (pileElem.y === tile.y) {
              // tile is beside on pile
              if (pileElem.x === tile.x + 1) {
                return;
              }
            }
          }
        }
        for (let i = 0; i < tiles.length; i++) {
          tiles[i].x ++;
        }
      }
      this.setState({
        fallingObject: {
          tiles
        }
      });
    } else if (dir === "left") {


      if (boundariesLeft > 0) {
        // check if falling tiles are already touching pile of tiles
        for (let i = 0; i < tiles.length; i++) {
          let tile = tiles[i];

          for (let j = 0; j < pile.tiles.length; j++) {
            let pileElem = pile.tiles[j];

            if (pileElem.y === tile.y) {
              // tile is beside on pile
              if (pileElem.x === tile.x - 1) {
                return;
              }
            }
          }
        }

        for (let i = 0; i < tiles.length; i++) {
          tiles[i].x --;
        }
      }
      this.setState({
        fallingObject: {
          tiles
        }
      });
    } else if (dir === "down") {

      // check if falling tiles are already touching pile of tiles
      for (let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];

        for (let j = 0; j < pile.tiles.length; j++) {
          let pileElem = pile.tiles[j];

          if (pileElem.x === tile.x) {
            // tile is landed on pile
            if (pileElem.y === tile.y + 1) {
              this.state.onLanded();
              return;
            }
          }
        }

      }
      if (boundariesBottom + 1 < this.state.boardHeight) {
        for (let i = 0; i < tiles.length; i++) {
          tiles[i].y ++;
        }
        this.setState({
          fallingObject: {
            tiles
          }
        });
      } else {
        this.state.onLanded();
      }
    }

  }

  rotate(cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
  }

  rotateObject () {
    let tiles = this.state.fallingObject.tiles;
    let boundariesRight = Math.round(Math.max.apply(Math,tiles.map(function(o){return o.x;})));
    let boundariesLeft = Math.round(Math.min.apply(Math,tiles.map(function(o){return o.x;})));
    let boundariesBottom = Math.round(Math.max.apply(Math,tiles.map(function(o){return o.y;})));
    let boundariesTop = Math.round(Math.min.apply(Math,tiles.map(function(o){return o.y;})));

    let width = Math.round(boundariesRight - boundariesLeft);
    let height = Math.round(boundariesBottom - boundariesTop);
    let cx = boundariesRight - Math.round(width / 2);
    let cy = boundariesBottom - Math.round(height / 2);
    let rotation = this.state.rotation || 0;

    // TODO correct rotation
    if (width % 2 === 1) {
      if (rotation % 4 < 3) {
        cy ++;
      } else if (rotation % 4 > 1) {
        cx ++;
      }
    }

    //console.log(width, height, cx, cy, rotation);

    for (let i = 0; i < tiles.length; i++) {
      let x = Math.round(tiles[i].x);
      let y = Math.round(tiles[i].y);

      let rotated = this.rotate(cx, cy, x, y, -90);
      tiles[i].x = Math.round(rotated[0]);
      tiles[i].y = Math.round(rotated[1]);
    }
    rotation ++;

    this.setState({
      fallingObject: {
        tiles
      },
      rotation
    });
  }

  handleKeys (event) {
    switch (event.key) {
      case "ArrowLeft":
        this.state.moveObject("left");
        break;
      case "ArrowRight":
        this.state.moveObject("right");
        break;
      case "ArrowUp":
        this.state.rotateObject();
        break;
      case "ArrowDown":
        this.state.moveObject("down");
        break;

      default:
        break;
    }

  }
  render() {
    let gameWidth = this.state.boardWidth * this.state.tileWidth;
    let gameHeight = this.state.boardHeight * this.state.tileHeight;
    let tileWidth = this.state.tileWidth;
    let tileHeight = this.state.tileHeight;

    let bgArray = [];

    for (let i = 0; i < this.state.boardHeight; i++) {
      for (let j = 0; j < this.state.boardWidth; j++) {
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
        }
        {
          this.state.pile.tiles.map(function(item, index) {
            return <GameTile
              key={index}
              tileObj={item}
              width={tileWidth}
              height={tileHeight}
            />
          })
        }
        {
          this.state.fallingObject.tiles.map(function(item, index) {
            return <GameTile
              key={index}
              tileObj={item}
              width={tileWidth}
              height={tileHeight}
            />
          })
        }

        </svg>
      </div>
    )
  }
}
