import React, {useState, useEffect} from "react";
import { withStyles } from "@material-ui/core";
import PayoutCount from "./PayoutCount";
import Receipt from "./Receipt";
import socket from '../socketClient';
import ReceiptRefactor from "./ReceiptRefactor";

const DEFAULT_GAME_ONE_RESULT = true;
const DEFAULT_GAME_ONE_AMOUNT = 0;
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
    position: "relative",
    backgroundColor: "#e0c760",
    width: "720px",
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

  let margin = getMarginLeft(props.windowWidth);
  let marginTop = getMarginTop(props.windowHeight);
  let height = getReceiptHeight(props.windowHeight);

  let isGameOneWinner = false;
  let gameOnePay = 0;

  for (var i = 0; i < props.currentState.winners.length; i++) {
    console.log("id: ", props.id, " winner id: ", props.currentState.winners[i]);
    if (props.currentState.winners[i] == props.id) {
        isGameOneWinner = true;
        gameOnePay = 3.00;
        // setGameOneAmount(3.00);
    }
  }

  return (
    <div className={classes.wrapperDiv} style={{marginLeft: margin, top: marginTop, height: height}}>
        <PayoutCount
          gameOneAmount={gameOneAmount}
          keepAmount={keepAmount}
          investAmount={investAmount}
          competeAmount={competeAmount}
          recievedResults={true}
          windowHeight={props.windowHeight}
          currentState={props.currentState}
          isGameOneWinner={isGameOneWinner}
        />
        <ReceiptRefactor
          gameOneResult={gameOneResult}
          gameOneAmount={gameOnePay}
          gameTwoTurn={gameTwoTurn}
          keepTokens={keepTokens}
          keepAmount={keepAmount}
          investTokens={investTokens}
          investRate={investRate}
          investAmount={investAmount}
          competeTokens={competeTokens}
          competeRate={competeRate}
          competeAmount={competeAmount}
          windowHeight={props.windowHeight}
          currentState={props.currentState}
          isGameOneWinner={isGameOneWinner}
        />
    </div>
  );
}

function getMarginLeft(windowWidth) {
  return (windowWidth - 720) / 2;
}

function getMarginTop(windowHeight) {
  if (windowHeight >= 825) return "5vh";
  else if (windowHeight >= 690) return "30px";
  else return "15px";
}

function getReceiptHeight(windowHeight) {
  if (windowHeight >= 775) return "500px";
  else return "420px";

}


export default withStyles(styles)(Payout);