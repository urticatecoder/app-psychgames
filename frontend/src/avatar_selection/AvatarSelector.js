import React, {useState} from "react";
import { Typography, withStyles } from "@material-ui/core";
import '../util/common_stylings/FullScreenDiv.css';
import OptionButton from '../icons/components/OptionButton';

const FULL_DIV = "fullDiv";
const PLAYER_OPTION_NUMBERS = Array.from(Array(25).keys());
const DEFAULT_SELECTION_INDEX = 0;
const NUMBER_OPTIONS = 25;
const SELECTED = true;
const NOT_SELECTED = false;

const NUM_COLUMNS = 8;
const NUM_ROWS = 3;

const BASE_HEIGHT_OFFSET = 40;
const OPTION_HEIGHT_OFFSET = 20;

const BASE_WIDTH_OFFSET = 10;
const OPTION_WIDTH_OFFSET = 10;

const styles = {
  confirmButton: {
    position: "absolute",
    top: "68vh",
    left: "5vw",
    height: "5vh",
    width: "15vw",
    opacity: ".9",
    borderRadius: "8px",
    alignItems: "center",
    fontSize: "15px",
  },
};

/**
 * Component that allows the submission of choices in Game One.
 * Handles the web socket call and sends choices passed in as props from Game One.
 * @param {*} props tell the choices to send in the web socket call.
 * 
 * @author Eric Doppelt
 */
function AvatarSelector(props) {
  const { classes } = props;

  const [selectedPlayers, setSelectedPlayers] = useState(getFalseArray());
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_SELECTION_INDEX);

  return (
    <div className={FULL_DIV}>
      {PLAYER_OPTION_NUMBERS.map((player) => {
        let leftMargin = getDivX(player);
        let topMargin = getDivY(player);
        console.log(leftMargin);
        console.log(topMargin);
        return (
          <div style={{position: "absolute", left: leftMargin, top: topMargin}}>
            <OptionButton
              player={player}
              selected={selectedPlayers[player]}
              onSelect={() => selectPlayer(player, setSelectedPlayers, setSelectedIndex)}
            />
          </div>
            )
      })}
    </div>
  );
}

function selectPlayer(index, setSelectedPlayers, setSelectedIndex) {
  let selectedPlayers = getFalseArray();
  selectedPlayers[index] = SELECTED;
  setSelectedPlayers(selectedPlayers);
  setSelectedIndex(index);
}

function getFalseArray() {
  return new Array(NUMBER_OPTIONS).fill(NOT_SELECTED);
}

function getDivX(player) {
  let column = player % NUM_COLUMNS;
  return BASE_WIDTH_OFFSET + column * OPTION_WIDTH_OFFSET + 'vw';
}

function getDivY(player) {
  let row = player % NUM_ROWS;
  return BASE_HEIGHT_OFFSET + row *  OPTION_HEIGHT_OFFSET + 'vh';
}

export default withStyles(styles)(AvatarSelector);
