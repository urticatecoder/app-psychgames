import React, { useState } from "react";
import StartTimer from "./StartTimer";
import StartButton from "./StartButton";
import "../util/common_stylings/FullScreenDiv.css";

/**
 * Component used to visualize the lobby where users wait to enter the game.
 * @param {*} props is used to tell the component the login code, which is provided to the StartTimer.
 *
 * @author Eric Doppelt
 */
function Lobby(props) {
  const DEFAULT_START_STATUS = false;
  const [startStatus, setStartStatus] = useState(DEFAULT_START_STATUS);
  const FULL_DIV = "fullDiv";

  return (
    <div className={FULL_DIV}>
      <StartTimer
        code={props.code}
        setStartStatus={setStartStatus}
        setAllLoginCodes={props.setAllLoginCodes}
      />
      <StartButton startStatus={startStatus} />
    </div>
  );
}

export default Lobby;
