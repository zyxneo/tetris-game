require("./game.scss");
import React from "react";
import GameTile from "./GameTile";

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      // sizes:
      boardWidth: 10,
      boardHeight: 18,
      tileWidth: 20,
      tileHeight: 20,
      sidebarWidth: 140,
      headerHeight: 50,
      footerHeight: 20,

      // user properties:
      level: 1,
      levelScoreRequirement: 500,
      score: 0,
      tileValue: 10,
      lines: 0,
      combo: 0,

      // game tiles:
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
      nextObject: {
        tiles: []
      },
      parkingObject: {
        tiles: []
      },
      rotation: 0,
      fallingInterval: "",
      gameSpeed: 1000,

      // functions:
      onFalling: this.onFalling.bind(this),
      onLanded: this.onLanded.bind(this),
      onEnd: this.onEnd.bind(this),
      drop: this.drop.bind(this),
      getRandomTiles: this.getRandomTiles.bind(this),
      clearRow: this.clearRow.bind(this),
      handleKeys: this.handleKeys.bind(this),
      moveObject: this.moveObject.bind(this),
      rotateObject: this.rotateObject.bind(this),
      swapObject: this.swapObject.bind(this)
    };
  }

  clearRow () {
    console.log("clearRow");

    let pile = this.state.pile;
    let shiftLevel = 0;
    let combo = -1;
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
            pileElem.fill = "#ddd";
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
        // row to delete
        shiftLevel ++;
        this.state.lines ++;
        combo++;

        for (let l = 0; l < rowTiles.length; l++) {
          // delete elements in the tow
          let tiles = this.state.pile.tiles;
          let index = tiles.indexOf(rowTiles[l])
          tiles.splice(index, 1);
          this.setState({tiles});
        }
      } else {
        // move elements above the gap down
        for (let l = 0; l < rowTiles.length; l++) {
          let element = rowTiles[l];
          element.y += shiftLevel;
        }
      }
    }

    let score = shiftLevel * this.state.tileValue * this.state.boardWidth;

    if (combo > 0) {
      score *= combo;
      score += this.state.score;
      combo += this.state.combo;
      this.setState({combo, score});
    } else {
      score += this.state.score;
      this.setState({score});
    }
    let level = Math.floor(score / this.state.levelScoreRequirement) + 1;
    let gameSpeed = 1000 - level * 100;
    this.setState({level, gameSpeed});
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

  getRandomTiles () {
    let shapes = this.state.shapes;
    let randomTile = Math.floor(shapes.length * Math.random());
    let tiles = [];

    for (let i = 0; i < shapes[randomTile].tiles.length; i++) {
      tiles.push(Object.assign({}, shapes[randomTile].tiles[i]));
    }
    return tiles;
  }

  drop () {
    //console.log("drop");

    // create parkingObject if not exist
    let parkingObject = this.state.parkingObject;
    if (parkingObject.tiles.length === 0) {
      parkingObject = {};
      parkingObject.tiles = this.state.getRandomTiles();
    }

    // next item
    let nextObject = this.state.nextObject;
    let tiles = [];
    let fallingObject = {};

    // if nextObject defined, use it, unless create new one
    if (nextObject.tiles.length === 0) {
      nextObject = {};
      nextObject.tiles = this.state.getRandomTiles();
      tiles = this.state.getRandomTiles();
    } else {
      for (let i = 0; i < nextObject.tiles.length; i++) {
        tiles.push(Object.assign({}, nextObject.tiles[i]));
      }
      nextObject.tiles = this.state.getRandomTiles();
    }

    fallingObject.tiles = tiles;

    // center dropped shape

    let boundariesRight = Math.max.apply(Math,tiles.map(function(o){return o.x;}));
    let boundariesLeft = Math.min.apply(Math,tiles.map(function(o){return o.x;}));
    let shiftToCenter = this.state.boardWidth / 2 - (boundariesRight - boundariesLeft);
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      tile.x += shiftToCenter;
    }


    this.setState({
      fallingObject,
      nextObject,
      parkingObject
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

  swapObject () {
    console.log("swap");
    let nextObject = this.state.nextObject;
    let parkingObject = this.state.parkingObject;
    this.setState((prevState, props) => ({
      nextObject: prevState.parkingObject,
      parkingObject: prevState.nextObject
    }));

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
      case "s":
        this.state.swapObject("down");
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
    let sidebarWidth = this.state.sidebarWidth;
    let headerHeight = this.state.headerHeight;
    let footerHeight = this.state.footerHeight;
    let rightSidebarCenter = sidebarWidth + gameWidth + sidebarWidth / 2;
    let leftSidebarCenter = sidebarWidth / 2;

    let nextObject = this.state.nextObject.tiles;
    let nextObjectBoundariesRight = Math.round(Math.max.apply(Math,nextObject.map(function(o){return o.x;})));
    let nextObjectBoundariesLeft = Math.round(Math.min.apply(Math,nextObject.map(function(o){return o.x;})));
    let nextObjectWidth = (nextObjectBoundariesRight - nextObjectBoundariesLeft) * tileWidth;

    let parkingObject = this.state.parkingObject.tiles;
    let parkingObjectBoundariesRight = Math.round(Math.max.apply(Math,parkingObject.map(function(o){return o.x;})));
    let parkingObjectBoundariesLeft = Math.round(Math.min.apply(Math,parkingObject.map(function(o){return o.x;})));
    let parkingObjectWidth = (parkingObjectBoundariesRight - parkingObjectBoundariesLeft) * tileWidth;

    let bgArray = [];
    for (let i = 0; i < this.state.boardHeight; i++) {
      for (let j = 0; j < this.state.boardWidth; j++) {
        let bgTile = {
          "id": (i * this.state.boardWidth + j),
          "x": j,
          "y": i,
          "fill": "#333",
        };
        bgArray.push(bgTile);
      }
    }

    return (
      <svg className="game__svg" version="1.1" viewBox={"0 0 " + (gameWidth + sidebarWidth * 2)  + " " + (gameHeight + headerHeight + footerHeight)}>

      <text className="game__title big-text" x={(gameWidth + sidebarWidth * 2) / 2} y="30" textAnchor="middle">Tetris game</text>


      <text className="game__level-label label-text" x={rightSidebarCenter} y="60" textAnchor="middle">Next</text>


      <text className="game__level-label label-text" x={rightSidebarCenter} y="150" textAnchor="middle">level</text>
      <text className="game__level big-text" x={rightSidebarCenter} y="180" textAnchor="middle">{this.state.level}</text>

      <text className="game__score-label label-text" x={rightSidebarCenter} y="210" textAnchor="middle">score</text>
      <text className="game__score big-text" x={rightSidebarCenter} y="240" textAnchor="middle">{this.state.score}</text>

      <text className="game__lines-label label-text" x={leftSidebarCenter} y="60" textAnchor="middle">switch (s)</text>


      <text className="game__lines-label label-text" x={leftSidebarCenter} y="150" textAnchor="middle">lines</text>
      <text className="game__lines big-text" x={leftSidebarCenter} y="180" textAnchor="middle">{this.state.lines}</text>

      <text className="game__combo-label label-text" x={leftSidebarCenter} y="210" textAnchor="middle">combo</text>
      <text className="game__combo big-text" x={leftSidebarCenter} y="240" textAnchor="middle">{this.state.combo}</text>

      {
        bgArray.map(function(item) {
          return <GameTile
            key={item.id}
            tileObj={item}
            width={tileWidth}
            height={tileHeight}
            translateX={sidebarWidth}
            translateY={headerHeight}
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
            translateX={sidebarWidth}
            translateY={headerHeight}
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
            translateX={sidebarWidth}
            translateY={headerHeight}
          />
        })
      }
      {
        this.state.nextObject.tiles.map(function(item, index) {
          return <GameTile
            key={index}
            tileObj={item}
            width={tileWidth}
            height={tileHeight}
            translateX={rightSidebarCenter - Math.round(nextObjectWidth / 2)}
            translateY={headerHeight + 20}
          />
        })
      }
      {
        this.state.parkingObject.tiles.map(function(item, index) {
          return <GameTile
            key={index}
            tileObj={item}
            width={tileWidth}
            height={tileHeight}
            translateX={leftSidebarCenter - Math.round(parkingObjectWidth / 2)}
            translateY={headerHeight + 20}
          />
        })
      }

      </svg>
    )
  }
}
