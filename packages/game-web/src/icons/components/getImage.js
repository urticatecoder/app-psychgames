import React from "react";
import PlayerImages from "./PlayerImages";
import AvatarImages from "./MainPlayerImages";
import GameImage from './GameImage';

const IMAGE = 'image';
const NAME = 'name';
const IMAGE_HEIGHT = '85vh';
const IMAGE_WIDTH = '85vw';

function getImage(playerNumber, selectedIndex, frontendIndex) {
  if (playerNumber != frontendIndex) {
    if (playerNumber > frontendIndex) {
      playerNumber -= 1
    } 
      return (
        <GameImage
          image={PlayerImages[IMAGE + playerNumber]}
          id={PlayerImages[NAME + playerNumber]}
          alt={PlayerImages[NAME + playerNumber]}
          width={IMAGE_HEIGHT}
          height={IMAGE_WIDTH}
        />
      );
    } else {
      return (
        <GameImage
          image={AvatarImages.images[selectedIndex]}
          width={IMAGE_HEIGHT}
          height={IMAGE_WIDTH}
        />
      );
    }
  }

export default getImage;