import React from "react";
import PlayerOptions from "./PlayerOptions";

const SELECTED = "#32a852";
const NOT_SELECTED = "#0093f542";
const BORDER_RADIUS = 30;

const WIDTH_THRESHOLD = 1500;
const HEIGHT_THRESHOLD = 700;

const SMALL_IMAGE = '50';
const LARGE_IMAGE = '100';

const IMAGE = 'image';
const NAME = 'name';
const LABEL = 'label';

/**
 * Component that wraps around a player option and allows it to be clicked in Avatar Selection.
 * Calls the onSelect() method when clicked, which indicates that the option was chosen.
 * @param {*} props provide a method to indicate the option was selected.
 * 
 * @author Eric Doppelt
 */
function OptionButton(props) {
  let background = getBackgroundColor(props.selected);
  let size = getSize(props.windowWidth, props.windowHeight);
  return (
    <div
      style={{ backgroundColor: background, borderRadius: BORDER_RADIUS }}
      onClick={() => props.onSelect()}
      >
      <img
        src={PlayerOptions[IMAGE + props.player]}
        id={PlayerOptions[NAME + props.player]}
        alt={[LABEL + props.player]}
        width={size}
        height={size}
      />
    </div>
  );
}

function getSize(windowWidth, windowHeight) {
  if (windowWidth >= WIDTH_THRESHOLD && windowHeight >= HEIGHT_THRESHOLD) return LARGE_IMAGE;
  else return SMALL_IMAGE;
}


function getBackgroundColor(isSelected) {
  if (isSelected) return SELECTED;
  else return NOT_SELECTED;
}

export default OptionButton;
