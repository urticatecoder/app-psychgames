import React, { useEffect, useState } from "react";
import Timer from "react-compound-timer";
import { Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import socket from "../socketClient";
import {withRouter} from 'react-router-dom';

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
const GAME_ONE_ROUTE = '/game-one';

const ENTER_LOBBY_WEBSOCKET = "enter lobby";
const JOIN_LOBBY_WEBSOCKET = "join";
const ROOM_FULL_WEBSOCKET = "room fill";
const PEOPLE_IN_ROOM_WEBSOCKET = "num of people in the room";
const PLAYER_TIME_WEBSOCKET = "player time";
const TIME_IN_LOBBY_WEBSOCKET = "time in lobby";

const GAME_ONE_INTRO_ROUTE = '/game-one-intro';

const ITALIC_FONT = "italic";
const LOGGED_IN = true;

const INITIAL_TIME_LEFT = 60 * 1000;
const MILLISECOND_CONSTANT = 1000;

const RESET = true;
const DONT_RESET = false;

const RECIEVED_TIME = true;
const HAVE_NOT_RECIEVED_TIME = false;

// Move random index out of function declaration to ensure this does not change on rerenders.
let frontendIndex = Math.floor(Math.random() * 6)
let reindexed = false

const styles = {
  welcomeInstruction: {
    marginTop: "15vh",
  },
  timerInstruction: {
    marginTop: "5vh",
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
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);
  const [resetter, setResetter] = useState(DONT_RESET);
  const [counter, setCounter] = useState(MAX_ROOM_CAPACITY);

  const [receivedTime, setReceivedTime] = useState(HAVE_NOT_RECIEVED_TIME);

  const INSTRUCTIONS_MESSAGE = (counter) => `Please wait while other players join in.`;

  let code = props.code;
  let setAllLoginCodes = props.setAllLoginCodes;

  useEffect(() => {
    if (!props.loggedIn && props.code != null) {
      socket.emit(ENTER_LOBBY_WEBSOCKET, code);
      props.setLoggedIn(LOGGED_IN);
    }

    if (props.experimentID != -1) {
      socket.emit(TIME_IN_LOBBY_WEBSOCKET, props.experimentID);
    }

    socket.on(JOIN_LOBBY_WEBSOCKET, () => {
      setWaitingOnPlayerCounter((prevCount) => prevCount - 1);
    });

    socket.on(ROOM_FULL_WEBSOCKET, (allPlayers) => {
      if (!reindexed) {
        reIndexPlayers(code, allPlayers, props.setBackendIndex, props.setFrontendIndex);
        setAllLoginCodes(allPlayers);
        reindexed = true
      }
    });

    socket.on(PEOPLE_IN_ROOM_WEBSOCKET, (experimentID, numOfPlayers) => {
      props.setExperimentID(experimentID);
      setWaitingOnPlayerCounter(MAX_ROOM_CAPACITY - numOfPlayers);
    });

    socket.on(PLAYER_TIME_WEBSOCKET, (time) => {
      if (!receivedTime) {
        setReceivedTime(RECIEVED_TIME);
        setTimeout(() => {
          props.history.push(GAME_ONE_INTRO_ROUTE);
        }, time * MILLISECOND_CONSTANT);
      }
      setTimeLeft(time * MILLISECOND_CONSTANT);
      setResetter(RESET);
    });

    return () => {
      socket.off(JOIN_LOBBY_WEBSOCKET);
      // socket.off(ROOM_FULL_WEBSOCKET);
      socket.off(PEOPLE_IN_ROOM_WEBSOCKET);
      socket.off(PLAYER_TIME_WEBSOCKET);
    };
  }, []);

  return (
    <div className={classes.startTimer} id={DIV_ID}>
      <Typography
        className={classes.welcomeInstruction}
        id={TEXT_ID}
        variant={"h4"}
      >
        <Box fontStyle={ITALIC_FONT}>
          {INSTRUCTIONS_MESSAGE(waitingOnPlayerCounter)}
        </Box>
      </Typography>
      <Typography
        className={classes.timerInstruction}
        variant={"h3"}
      >
        {WELCOME_MESSAGE}
      </Typography>

      <Timer
        id={TIMER_ID}
        initialTime={timeLeft}
        lastUnit={LAST_TIME_UNIT}
        direction={DIRECTION}
        timeToUpdate={TIMER_UPDATE}
      >
        {({reset, setTime}) => (
          <React.Fragment>
            {checkForReset(resetter, setResetter, setTime, timeLeft)}
            <Typography variant={"h3"}>
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

// The backend index is the index that the backend sends to 
function reIndexPlayers(myLoginCode, allLoginCodes, setBackendIndex, setFrontendIndex) {
  console.log('\n REINDEXING PLAYERS \n')
  let backendIndex = allLoginCodes.indexOf(myLoginCode);
  setBackendIndex(backendIndex);
  setFrontendIndex(frontendIndex)
  console.log('Backend Index: ' + backendIndex)
  console.log('Frontend Index: ' + frontendIndex)
  console.log('Beginning: ' + allLoginCodes)
  allLoginCodes.splice(backendIndex, 1);
  allLoginCodes.splice(frontendIndex, 0, myLoginCode)
  console.log('End: ' + allLoginCodes)
}

function checkForReset(resetter, setResetter, setTime, timeLeft) {
  if (resetter) {
  setTime(timeLeft);
  }
  setResetter(DONT_RESET);
}

export default withRouter(withStyles(styles)(StartTimer));
