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
          "x": 8,
          "y": 9,
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
      fallingObject: {
        tiles: []
      },
      rotation: 0,
      fallingInterval: "",
      gameSpeed: 1000,
      onFalling: this.onFalling.bind(this),
      onLanded: this.onLanded.bind(this),
      handleKeys: this.handleKeys.bind(this),
      moveObject: this.moveObject.bind(this),
      rotateObject: this.rotateObject.bind(this)
    };
  }

  onFalling () {
    //console.log("falling");
    this.state.moveObject("down");
  }

  onLanded () {
    //console.log("landed");
    clearInterval(this.state.fallingInterval);
  }

  componentDidMount() {
    this.setState({
      fallingObject: this.state.shapes[0]
    });

    this.state.fallingInterval = setInterval(this.state.onFalling, this.state.gameSpeed);
    document.addEventListener("keydown", this.state.handleKeys, false);
  }

  moveObject (dir) {
    let tiles = this.state.fallingObject.tiles;
    let boundariesRight = Math.max.apply(Math,tiles.map(function(o){return o.x;}));
    let boundariesLeft = Math.min.apply(Math,tiles.map(function(o){return o.x;}));
    let boundariesBottom = Math.max.apply(Math,tiles.map(function(o){return o.y;}));
    if (dir === "right") {
      if (boundariesRight + 1 < this.state.boardWidth) {
        for (var i = 0; i < tiles.length; i++) {
          tiles[i].x ++;
        }
      }
    } else if (dir === "left") {
      if (boundariesLeft > 0) {
        for (var i = 0; i < tiles.length; i++) {
          tiles[i].x --;
        }
      }
    } else if (dir === "down") {
      if (boundariesBottom + 1 < this.state.boardHeight) {
        for (var i = 0; i < tiles.length; i++) {
          tiles[i].y ++;
        }
      } else {
        this.state.onLanded();
      }
    }

    this.setState({
      fallingObject: {
        tiles
      }
    });
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
    let boundariesRight = Math.max.apply(Math,tiles.map(function(o){return o.x;}));
    let boundariesLeft = Math.min.apply(Math,tiles.map(function(o){return o.x;}));
    let boundariesBottom = Math.max.apply(Math,tiles.map(function(o){return o.y;}));
    let boundariesTop = Math.min.apply(Math,tiles.map(function(o){return o.y;}));

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

    for (var i = 0; i < tiles.length; i++) {
      let x = tiles[i].x;
      let y = tiles[i].y;

      let rotated = this.rotate(cx, cy, x, y, -90);
      tiles[i].x = rotated[0];
      tiles[i].y = rotated[1];
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
          this.state.fallingObject.tiles.map(function(item, index) {
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
