import React from "react";

import StartTimer from "./StartTimer";
import StartTimerRefactor from "./StartTimerRefactor";
import ContinueButton from "../util/components/ContinueButton";
import Routes from '../util/constants/routes'

const NOT_DISABLED = false;

const styles = {
  avatarButton: {
    marginTop: '10vh',
  },
};

/**
 * High-level component used to visualize the lobby where users wait to enter the game.
 *
 * @author Eric Doppelt
 */
function Lobby(props) {
  return (
    <div>
      {/* render time based on lobbyEndTime in currentState prop */}
      <StartTimerRefactor
        currentState={props.currentState}
        setCurrentState={props.setCurrentState}
      >
      </StartTimerRefactor>

      <div style={{...styles.avatarButton}}>
        <ContinueButton
          message={"Choose Avatar"} 
          route={Routes.AVATAR_SELECTION} 
          disabled={NOT_DISABLED}
          height='60px' 
          width='300px'
        />
      </div>
    </div>
  );
}

export default Lobby;
