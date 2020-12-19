import React from "react";
import PlayerOptions from "./PlayerOptions";

const SELECTED = "#32a852";
const NOT_SELECTED = "#0093f542";
const BORDER_RADIUS = 30;

/**
 * Component that wraps around a player option and allows it to be clicked in Avatar Selection.
 * Calls the onSelect() method when clicked, which indicates that the option was chosen.
 * @param {*} props provide a method to indicate the option was selected.
 * 
 * @author Eric Doppelt
 */
function OptionButton(props) {
  let background = getBackgroundColor(props.selected);

  return (
    <div
      style={{ backgroundColor: background, borderRadius: BORDER_RADIUS }}
      onClick={() => props.onSelect()}
    >
      {PlayerOptions[props.player]}
    </div>
  );
}

function getBackgroundColor(isSelected) {
  if (isSelected) return SELECTED;
  else return NOT_SELECTED;
}

export default OptionButton;
