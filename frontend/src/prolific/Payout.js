import React, {useState, useEffect} from "react";
import { withStyles } from "@material-ui/core";
import PayoutCount from "./PayoutCount";
import Receipt from "./Receipt";
import socket from '../socketClient';

const DEFAULT_GAME_ONE_RESULT = true;
const DEFAULT_GAME_ONE_AMOUNT = 3.00;
const DEFAULT_GAME_TWO_TURN = 0;

const DEFAULT_KEEP_TOKENS = 8;
const DEFAULT_KEEP_AMOUNT = 8;

const DEFAULT_INVEST_TOKENS = 10;
const DEFAULT_INVEST_RATE = 1.5;
const DEFAULT_INVEST_AMOUNT = 15;

const DEFAULT_COMPETE_TOKENS = 12;
const DEFAULT_COMPETE_RATE = .5;
const DEFAULT_COMPETE_AMOUNT = -6;

const GET_RESULTS_SOCKET = 'get results';
const RECIEVE_RESULTS_SOCKET = 'send results';

const DID_NOT_RECIEVE_RESULTS = false;
const RECIEVED_RESULTS = true;

const DID_NOT_ASK_FOR_RESULTS = false;
const ASKED_FOR_RESULTS = true;

const styles = {
  countUp: {
      fontSize: 100,
  },
  wrapperDiv: {
    position: "absolute",
    top: "25vh",
    left: "29vw",
    backgroundColor: "#e0c760",
    height: "60vh",
    width: "42vw",
    opacity: ".8",
    borderRadius: "20px",
  }
};

/**
 * Animated numbers showing the payout.
 *
 * @author Eric Doppelt
 */
function Payout(props) {
  const { classes } = props;

  const [gameOneResult, setGameOneResult] = useState(DEFAULT_GAME_ONE_RESULT);
  const [gameOneAmount, setGameOneAmount] = useState(DEFAULT_GAME_ONE_AMOUNT);
  const [gameTwoTurn, setGameTwoTurn] = useState(DEFAULT_GAME_TWO_TURN);
  const [keepTokens, setKeepTokens] = useState(DEFAULT_KEEP_TOKENS);
  const [keepAmount, setKeepAmount] = useState(DEFAULT_KEEP_AMOUNT);
  const [investTokens, setInvestTokens] = useState(DEFAULT_INVEST_TOKENS);
  const [investRate, setInvestRate] = useState(DEFAULT_INVEST_RATE)
  const [investAmount, setInvestAmount]  = useState(DEFAULT_INVEST_AMOUNT);
  const [competeTokens, setCompeteTokens] = useState(DEFAULT_COMPETE_TOKENS);
  const [competeRate, setCompeteRate] = useState(DEFAULT_COMPETE_RATE);
  const [competeAmount, setCompeteAmount] = useState(DEFAULT_COMPETE_AMOUNT);
  const [recievedResults, setRecievedResults] = useState(DID_NOT_RECIEVE_RESULTS);

  const [askedForResults, setAskedForResults] = useState(DID_NOT_ASK_FOR_RESULTS);

  useEffect(() => {
    if (props.code != null && !askedForResults) {
      console.log('ASKED FOR RESULTS');
      setAskedForResults(ASKED_FOR_RESULTS);
      socket.emit(GET_RESULTS_SOCKET, props.code);
    }

    socket.on(RECIEVE_RESULTS_SOCKET, (gameOneResult, gameOneAmount, gameTwoTurn, keepTokens, keepAmount, investTokens, investRate, investAmount, competeTokens, competeRate, competeAmount) => {
        console.log('RESULTS');
        console.log(gameOneResult);
        console.log(gameOneAmount);
        console.log(gameTwoTurn);
        console.log(keepTokens);
        console.log(keepAmount);
        console.log(investTokens);
        console.log(investRate);
        console.log(investAmount);
        console.log(competeTokens);
        console.log(competeRate);
        console.log(competeAmount);
        setGameOneResult(gameOneResult);
        setGameOneAmount(gameOneAmount);
        setGameTwoTurn(gameTwoTurn);
        setKeepTokens(keepTokens);
        setKeepAmount(keepAmount);
        setInvestTokens(investTokens);
        setInvestRate(investRate);
        setInvestAmount(investAmount);
        setCompeteTokens(competeTokens);
        setCompeteRate(competeRate);
        setCompeteAmount(competeAmount);
        setRecievedResults(RECIEVED_RESULTS);
      });
  
      return () => {
        socket.off(RECIEVE_RESULTS_SOCKET);
      };

  }, [props]);

  return (
    <div className={classes.wrapperDiv}>
        <PayoutCount
          gameOneAmount={gameOneAmount}
          keepAmount={keepAmount}
          investAmount={investAmount}
          competeAmount={competeAmount}
          recievedResults={recievedResults}
        />
        <Receipt
          gameOneResult={gameOneResult}
          gameOneAmount={gameOneAmount}
          gameTwoTurn={gameTwoTurn}
          keepTokens={keepTokens}
          keepAmount={keepAmount}
          investTokens={investTokens}
          investRate={investRate}
          investAmount={investAmount}
          competeTokens={competeTokens}
          competeRate={competeRate}
          competeAmount={competeAmount}
        />
    </div>
  );
}

export default withStyles(styles)(Payout);
