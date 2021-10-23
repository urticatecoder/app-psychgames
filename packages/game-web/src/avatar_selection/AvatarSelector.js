import React, {useState} from "react";
import { Typography, Box, withStyles } from "@material-ui/core";
import '../util/stylings/FullScreenDiv.css';
import OptionButton from '../icons/components/OptionButton';
import ContinueButton from '../util/components/ContinueButton';
import { Variants } from "../util/constants/stylings/StylingsBundler";

const FULL_DIV = "fullDiv";
const PLAYER_OPTION_NUMBERS = Array.from(Array(24).keys());
const NUMBER_OPTIONS = 25;
const SELECTED = true;
const NOT_SELECTED = false;

const NUM_COLUMNS = 8;
const NUM_ROWS = 3;

const BASE_HEIGHT_OFFSET = 30;
const OPTION_HEIGHT_OFFSET = 18;

const BASE_WIDTH_OFFSET = 10;
const OPTION_WIDTH_OFFSET = 10.5;

const BUTTON_POSITION_TYPE = "absolute";
const BUTTON_MESSAGE = "Return to Lobby";
const LOBBY_ROUTE = '/lobby';
const DISABLED = false;

const AVATAR_SELECTION_MESSAGE = "Please choose your avatar from the options below."
const ITALIC_FONT = "italic";

const LARGE_TEXT_THRESHOLD = 1325;
const MEDIUM_TEXT_THRESHOLD = 1076;

const styles = {
  instructionText: {
    marginTop: "12vh",
    opacity: .9
  },
  confirmButton: {
    marginTop: "68vh",
    marginBottom: '5vh',
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

  const [selectedPlayers, setSelectedPlayers] = useState(getUpdatedSelectionArray(props.selectedIndex));

  return (
    <div className={FULL_DIV}>
      <div>
        <Typography
          className={classes.instructionText}
          variant={getVariant(props.windowWidth)}
        >
          <Box fontStyle={ITALIC_FONT}>
            {AVATAR_SELECTION_MESSAGE}
          </Box>
        </Typography>
      </div>

      <div>
      {PLAYER_OPTION_NUMBERS.map((player) => {
        let leftMargin = getDivX(player);
        let topMargin = getDivY(player);

        return (
          <div style={{position: BUTTON_POSITION_TYPE, left: leftMargin, top: topMargin}}>
            <OptionButton
              player={player}
              selected={selectedPlayers[player]}
              onSelect={() => selectPlayer(player, setSelectedPlayers, props.setSelectedIndex)}
              windowWidth={props.windowWidth}
              windowHeight={props.windowHeight}
            />
          </div>
            )
      })}
      </div>

      <div className = {classes.confirmButton}>
        <ContinueButton
          message={BUTTON_MESSAGE} 
          route={LOBBY_ROUTE} 
          disabled={DISABLED}
          height='50px' 
          width='200px'
        />
      </div>
    </div>
    
  );
}

function getVariant(windowWidth) {
  if (windowWidth >= LARGE_TEXT_THRESHOLD) {
    return Variants.LARGE_TEXT;
  } else if (windowWidth >= MEDIUM_TEXT_THRESHOLD) {
    return Variants.NORMAL_TEXT;
  } else return Variants.SMALL_TEXT;
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

function getUpdatedSelectionArray(selectedIndex) {
  let selectedPlayers = getFalseArray();
  if (selectedIndex < 0) return selectedPlayers;
  else {
    selectedPlayers[selectedIndex] = true;
  }
  return selectedPlayers;
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
