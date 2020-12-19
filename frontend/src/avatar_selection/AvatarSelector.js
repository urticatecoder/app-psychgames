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
            return (
              <OptionButton
                player={player}
                selected={selectedPlayers[player]}
                onSelect={() => selectPlayer(player, setSelectedPlayers, setSelectedIndex)}
              />
            )
      })}
    </div>
  );
}

function selectPlayer(index, setSelectedPlayers, setSelectedIndex) {
  let selectedPlayers = getFalseArray();
  console.log(selectedPlayers);
  selectedPlayers[index] = SELECTED;
  setSelectedPlayers(selectedPlayers);
  setSelectedIndex(index);
}

function getFalseArray() {
  return new Array(NUMBER_OPTIONS).fill(NOT_SELECTED);
}

export default withStyles(styles)(AvatarSelector);
