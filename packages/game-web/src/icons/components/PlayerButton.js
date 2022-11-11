import React from "react";
import PlayerImages from "./PlayerImages";
import MainPlayerImages from "./MainPlayerImages";
import GameImage from './GameImage';
import { withStyles } from "@material-ui/core";

const SELECTED = "#32a852";
const NOT_SELECTED = "#0093f542";
const SINGLE_BONUS = "#f26b78";
const DOUBLE_BONUS = "#fca103";
const TRIPLE_BONUS = "#0010f5";
const SELF = "#faf3b1";

const BORDER_RADIUS = 30;
const IMAGE = 'image';
const NAME = 'name';
const LABEL = 'label';

const LARGE_WIDTH_THRESHOLD = 1275;
const MEDIUM_WIDTH_THRESHOLD = 1075;

const LARGE_SIZE = '85';
const MEDIUM_SIZE = '75';
const SMALL_SIZE = '65';

const styles = {
  glowingDiv: {
    boxShadow: "0px 0px 1px #0093f542 inset, 0px 0px 20px #32a852",
    borderRadius: BORDER_RADIUS 
  },
};

/**
 * Component that wraps around a player image and allows it to be clicked in Game One.
 * Calls the onSelect() method when clicked, which indicates that the player was chosen in Game One.
 * @param {*} props provide a method to indicate the player was selected, and it also provides whether the avatar is in a triple or double bonus, which changes the background.
 * 
 * @author Eric Doppelt
 */
function PlayerButton(props) {

  const { classes } = props
  let background = getBackgroundColor(props.single, props.double, props.triple, props.selected, props.isSelf);

  if (props.player == props.frontendIndex && !props.single && !props.double && !props.triple && !props.isSelf) {
    background = SELECTED
  }
  
  let boxShadowStyle = "0px 0px 1px #0093f542 inset, 0px 0px 20px " + background
  return (
    <div
      style={{ backgroundColor: background, borderRadius: BORDER_RADIUS }}
      onClick={() => handleSelect(props.disabled, props.onSelect)}
    >
      <div
      className={classes.glowingDiv} style={{boxShadow: boxShadowStyle}}>
        {getImage(props.avatar, props.selectedIndex, props.windowWidth, props.frontendIndex)}
      </div>
    </div>
  );
}

function getImage(playerNumber, selectedIndex, windowWidth, frontendIndex) {
   // Adjust the player number if it is greater than the frontendIndex.
   // Ex: player 4 is player 3, if frontend index is 1. This is done to map to avatars correctly.
  
  // If the player is the main player, return the selection.
  if (playerNumber != frontendIndex) {
    return (
      <GameImage
        image={PlayerImages[IMAGE + playerNumber]}
        id={PlayerImages[NAME + playerNumber]}
        alt={PlayerImages[LABEL + playerNumber]}
        width={getSize(windowWidth)}
        height={getSize(windowWidth)}
      />
    );
  } else {
    return (
        <GameImage
          image={MainPlayerImages.image[selectedIndex]}
          width={getSize(windowWidth)}
          height={getSize(windowWidth)}
        />
    );
  }
}

function getSize(windowWidth) {
  if (windowWidth >= LARGE_WIDTH_THRESHOLD) return LARGE_SIZE;
  else if (windowWidth >= MEDIUM_WIDTH_THRESHOLD) return MEDIUM_SIZE;
  else return SMALL_SIZE;
}

function handleSelect(disabled, onSelect) {
  if (!disabled) onSelect();
}

function getBackgroundColor(isSingle, isDouble, isTriple, isSelected, isSelf) {
  if (isSingle) return SINGLE_BONUS;
  else if (isDouble) return DOUBLE_BONUS;
  else if (isTriple) return TRIPLE_BONUS;
  else if (isSelected) return SELECTED;
  else if (isSelf) return SELF;
  else return NOT_SELECTED;
}

export default withStyles(styles)(PlayerButton);
