import React, {PropTypes} from "react";

export default function GameTile (props) {
  let tileObj = props.tileObj;
  let x = tileObj.x * props.width + props.translateX - 1 || 0;
  let y = tileObj.y * props.height + props.translateY - 1 || 0;

  return (
    <rect fill={tileObj.fill} className="tile" x={x} y={y} width={props.width - 2} height={props.height - 2}/>
  );
}

