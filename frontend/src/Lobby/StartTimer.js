import React, { useEffect, useState } from "react";
import Timer from "react-compound-timer";
import { Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import socket from "../socketClient";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";

const INITIAL_START_TIME = 1 * 6000;

const LAST_TIME_UNIT = "h";
const DIRECTION = "backward";

const WELCOME_MESSAGE = "The game will begin in:";
const MINUTES = "Minutes";
const SECONDS = "Seconds";
const START_GAME = true;

const STOP_TIMER = 0;
const TIMER_UPDATE = 10;
const TIMER_ID = "timer";
const TEXT_ID = "timerText";
const DIV_ID = "timerDiv";

const MAX_ROOM_CAPACITY = 6;

const ENTER_LOBBY_WEBSOCKET = "enter lobby";
const JOIN_LOBBY_WEBSOCKET = "join";
const ROOM_FULL_WEBSOCKET = "room fill";
const PEOPLE_IN_ROOM_WEBSOCKET = "num of people in the room";

const ITALIC_FONT = "italic";
const styles = {
  welcomeInstruction: {
    marginTop: "150px",
  },
  timerInstruction: {
    marginTop: "50px",
  },
};

/**
 * Component used for the timer in the lobby, which ticks as players enter the game.
 * The timer enabled the start button once it hits zero.
 * The timer is also accompanied by some text which indicates how many players are needed to start the game.
 * @param {*} props provides a method which when called enables the StartButton component to begin the game.
 * 
 * @author Eric Doppelt 
 */
function StartTimer(props) {
  const { classes } = props;
  const [waitingOnPlayerCounter, setWaitingOnPlayerCounter] = useState(MAX_ROOM_CAPACITY);

  const INSTRUCTIONS_MESSAGE = (counter) => `Please wait while ${counter} other players join in.`;

  let code = props.code;
  let setAllLoginCodes = props.setAllLoginCodes;

  useEffect(() => {
    socket.emit(ENTER_LOBBY_WEBSOCKET, code);
    socket.on(JOIN_LOBBY_WEBSOCKET, () => {
      setWaitingOnPlayerCounter((prevCount) => prevCount - 1);
    });
    socket.on(ROOM_FULL_WEBSOCKET, (msg) => {
      setAllLoginCodes(msg);
    });
    socket.on(PEOPLE_IN_ROOM_WEBSOCKET, (numOfPlayers) => {
      setWaitingOnPlayerCounter(MAX_ROOM_CAPACITY - numOfPlayers);
    });

    return () => {
      socket.off(JOIN_LOBBY_WEBSOCKET);
      socket.off(ROOM_FULL_WEBSOCKET);
      socket.off(PEOPLE_IN_ROOM_WEBSOCKET);
    };
  }, [code, setAllLoginCodes]);

  return (
    <div className={classes.startTimer} id={DIV_ID}>
      <Typography
        className={classes.welcomeInstruction}
        id={TEXT_ID}
        variant={Variants.SMALL_TEXT}
      >
        <Box fontStyle={ITALIC_FONT}>
          {INSTRUCTIONS_MESSAGE(waitingOnPlayerCounter)}
        </Box>
      </Typography>
      <Typography
        className={classes.timerInstruction}
        variant={Variants.NORMAL_TEXT}
      >
        {WELCOME_MESSAGE}
      </Typography>

      <Timer
        id={TIMER_ID}
        initialTime={INITIAL_START_TIME}
        lastUnit={LAST_TIME_UNIT}
        direction={DIRECTION}
        timeToUpdate={TIMER_UPDATE}
        checkpoints={[
          {
            time: STOP_TIMER,
            callback: () => props.setStartStatus(START_GAME),
          },
        ]}
      >
        {() => (
          <React.Fragment>
            <Typography variant={Variants.NORMAL_TEXT}>
              <br />
              <Timer.Minutes /> {MINUTES}
              <br />
              <Timer.Seconds /> {SECONDS}
              <br />
            </Typography>
          </React.Fragment>
        )}
      </Timer>
    </div>
  );
}

export default withStyles(styles)(StartTimer);
