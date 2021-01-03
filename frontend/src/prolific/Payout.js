import React, {useState, useEffect} from "react";
import { withStyles } from "@material-ui/core";
import PayoutCount from "./PayoutCount";
import Receipt from "./Receipt";
import socket from '../socketClient';

const DEFAULT_GAME_ONE_RESULT = true;
const DEFAULT_GAME_ONE_AMOUNT = 3.00;
const DEFAULT_GAME_TWO_TURN = 0;

const DEFAULT_KEEP_TOKENS = 2;
const DEFAULT_KEEP_AMOUNT = 1;

const DEFAULT_INVEST_TOKENS = 3;
const DEFAULT_INVEST_AMOUNT = 1.5;

const DEFAULT_COMPETE_TOKENS = 6;
const DEFAULT_COMPETE_AMOUNT = -3;

const GET_RESULTS_SOCKET = 'get results';
const RECIEVE_RESULTS_SOCKET = 'recieve results';

const styles = {
  countUp: {
      fontSize: 100,
  },
  wrapperDiv: {
    position: "absolute",
    top: "25vh",
    left: "30vw",
    backgroundColor: "#e0c760",
    height: "64vh",
    width: "40vw",
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
  const [investAmount, setInvestAmount]  = useState(DEFAULT_INVEST_AMOUNT);
  const [competeTokens, setCompeteTokens] = useState(DEFAULT_COMPETE_TOKENS);
  const [competeAmount, setCompeteAmount] = useState(DEFAULT_COMPETE_AMOUNT);

  useEffect(() => {
    socket.emit(GET_RESULTS_SOCKET, props.code);
    
    socket.on(RECIEVE_RESULTS_SOCKET, (gameOneResult, gameOneAmount, gameTwoTurn, keepTokens, keepAmount, investTokens, investAmount, competeTokens, competeAmount) => {
        setGameOneResult(gameOneResult);
        setGameOneAmount(gameOneAmount);
        setGameTwoTurn(gameTwoTurn);
        setKeepTokens(keepTokens);
        setKeepAmount(keepAmount);
        setInvestTokens(investTokens);
        setInvestAmount(investAmount);
        setCompeteTokens(competeTokens);
        setCompeteAmount(competeAmount);
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
        />
        <Receipt
          gameOneResult={gameOneResult}
          gameOneAmount={gameOneAmount}
          gameTwoTurn={gameTwoTurn}
          keepTokens={keepTokens}
          keepAmount={keepAmount}
          investTokens={investTokens}
          investAmount={investAmount}
          competeTokens={competeTokens}
          competeAmount={competeAmount}
        />
    </div>
  );
}

export default withStyles(styles)(Payout);
