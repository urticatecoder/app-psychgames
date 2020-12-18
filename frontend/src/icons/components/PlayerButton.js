import React from "react";
import PlayerImages from "./PlayerImages";

const SELECTED = "#32a852";
const NOT_SELECTED = "#0093f542";
const DOUBLE_BONUS = "#fca103";
const TRIPLE_BONUS = "#0010f5";
const BORDER_RADIUS = 30;

/**
 * Component that wraps around a player image and allows it to be clicked in Game One.
 * Calls the onSelect() method when clicked, which indicates that the player was chosen in Game One.
 * @param {*} props provide a method to indicate the player was selected, and it also provides whether the avatar is in a triple or double bonus, which changes the background.
 * 
 * @author Eric Doppelt
 */
function PlayerButton(props) {
  let background = getBackgroundColor(props.double, props.triple, props.selected);

  return (
    <div
      style={{ backgroundColor: background, borderRadius: BORDER_RADIUS }}
      onClick={() => handleSelect(props.disabled, props.onSelect)}
    >
      {PlayerImages[props.player]}
    </div>
  );
}

function handleSelect(disabled, onSelect) {
  if (!disabled) onSelect();
}

function getBackgroundColor(isDouble, isTriple, isSelected) {
  if (isDouble) return DOUBLE_BONUS;
  else if (isTriple) return TRIPLE_BONUS;
  else if (isSelected) return SELECTED;
  else return NOT_SELECTED;
}

export default PlayerButton;
