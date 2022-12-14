import React from "react";
import PlayerImages from "./PlayerImages";
import MainPlayerImages from "./MainPlayerImages";
import AvatarImages from "./MainPlayerImages";
import GameImage from './GameImage';

const IMAGE = 'image';
const NAME = 'name';
const IMAGE_HEIGHT = '85vh';
const IMAGE_WIDTH = '85vw';

function getImage(playerNumber, selectedIndex, frontendIndex, isSelf) {
  // console.log("is self: ", isSelf);
  return (
    // <GameImage
    //   image={PlayerImages[IMAGE + playerNumber]}
    //   id={PlayerImages[NAME + playerNumber]}
    //   alt={PlayerImages[NAME + playerNumber]}
    //   width={IMAGE_HEIGHT}
    //   height={IMAGE_WIDTH}
    // />
    <GameImage
      image={MainPlayerImages.images[playerNumber]}
      // id={MainPlayerImages.[NAME + playerNumber]}
      // alt={PlayerImages[LABEL + playerNumber]}
      width={IMAGE_HEIGHT}
      height={IMAGE_WIDTH}
      isSelf={isSelf}
    />
  );
  }

export default getImage;