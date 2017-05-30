import React, {PropTypes} from "react";

export default function GameTile (props) {
  let tileObj = props.tileObj;
  let x = tileObj.x * props.width || 0;
  let y = tileObj.y * props.height || 0;

  return (
    <rect fill={tileObj.fill} className="tile" x={x} y={y} width={props.width} height={props.height}/>
  );
}
