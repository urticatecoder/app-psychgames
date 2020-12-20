import React from "react";

function GameImage(props) {
  return (
    <img
      src={props.image}
      id={props.id}
      alt={props.id}
      width={props.width}
      height={props.height}
    />
  );
}

export default GameImage;
