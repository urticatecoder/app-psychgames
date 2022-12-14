import React from "react";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

const NOT_ENOUGH_TOKENS_MESSAGE = "You do not have any tokens left!";
const NEGATIVE_TOKENS_MESSAGE = "You cannot remove tokens before adding them!";

const OPEN_MESSAGE = true;
const ERROR_MESSAGE_LENGTH = 2000;
const CLOSED_MESSAGE = false;
const ERROR_VERTICALITY = "top";
const ERROR_HORIZONTAL = "left";
const ALERT_LEVEL = "error";

/**
 * Function used in Game Two to get error message components based on the parameters given.
 * 
 * @param {*} notEnoughTokens indicates whether a player has spent more tokens than he has
 * @param {*} setNotEnoughTokens allows the component to turn off the indiciator for the overspending error message
 * @param {*} negativeTokens indicates whether a player is trying to invest a negative amount of tokens
 * @param {*} setNegativeTokens allows the component to turn off the indiciator for the negative tokens error message
 * 
 * @author Eric Doppelt
 */
function getAlerts(
    tokensRemaining,
    notAllInvested,
    setNotAllInvested,
    notEnoughTokens,
    setNotEnoughTokens,
    negativeTokens,
    setNegativeTokens
  ) {
    if (notEnoughTokens) {
      console.log("not enough tokens, show alert");
      return getAlertComponent(NOT_ENOUGH_TOKENS_MESSAGE, setNotEnoughTokens);
    } else if (negativeTokens) {
      return getAlertComponent(NEGATIVE_TOKENS_MESSAGE, setNegativeTokens);
    } else if (notAllInvested) {
      return getAlertComponent(`You still have ${tokensRemaining} tokens left to distribute. Distribute them and press CONFIRM! before time's up!`, setNotAllInvested, true);
    }
  }
  
  function getAlertComponent(text, setClosed) {
    return (
      <Snackbar
        open={OPEN_MESSAGE}
        autoHideDuration={ERROR_MESSAGE_LENGTH}
        // onClose={() => setClosed(CLOSED_MESSAGE)}
        anchorOrigin={{
          vertical: ERROR_VERTICALITY,
          horizontal: ERROR_HORIZONTAL,
        }}
      >
        <Alert severity={ALERT_LEVEL}>{text}</Alert>
      </Snackbar>
    );
  }

export default getAlerts;