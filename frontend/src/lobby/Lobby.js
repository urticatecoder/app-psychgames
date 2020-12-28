import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import StartTimer from "./StartTimer";
import StartButton from "./StartButton";
import "../util/common_stylings/FullScreenDiv.css";
import ContinueButton from "../util/common_components/ContinueButton";

const AVATAR_BUTTON_MESSAGE = "Choose Avatar";
const GAME_BUTTON_MESSAGE = "Begin Game One";
const AVATAR_SELECTION_ROUTE = "/avatar-selection";
const NOT_DISABLED = false;
const DEFAULT_START_STATUS = false;
const FULL_DIV = "fullDiv";
const GAME_ONE_TUTORIAL_ROUTE = "/game-one-tutorial";

const styles = {
  avatarButton: {
    marginTop: '10vh',
  },
  gameButton: {
    marginTop: '5vh',
  },
};

/**
 * Component used to visualize the lobby where users wait to enter the game.
 * @param {*} props is used to tell the component the login code, which is provided to the StartTimer.
 *
 * @author Eric Doppelt
 */
function Lobby(props) {
  const { classes } = props;

  const [startStatus, setStartStatus] = useState(DEFAULT_START_STATUS);

  return (
    <div className={FULL_DIV}>
      <StartTimer
        code={props.code}
        setStartStatus={setStartStatus}
        setAllLoginCodes={props.setAllLoginCodes}
        loggedIn={props.loggedIn}
        setLoggedIn={props.setLoggedIn}
      />
      <div className={classes.avatarButton}>
        <ContinueButton
          message={AVATAR_BUTTON_MESSAGE} 
          route={AVATAR_SELECTION_ROUTE} 
          disabled={NOT_DISABLED}
          height='60px' 
          width='300px'
        />
      </div>
      <div className={classes.gameButton}>
        <ContinueButton
          message={GAME_BUTTON_MESSAGE} 
          route={GAME_ONE_TUTORIAL_ROUTE} 
          disabled={!startStatus}
          height='60px' 
          width='300px'
        />
      </div>
    </div>
  );
}

export default withStyles(styles)(Lobby);