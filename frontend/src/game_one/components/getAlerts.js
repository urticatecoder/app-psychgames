import React from "react";
import Alert from "@material-ui/lab/Alert";
import { Snackbar } from "@material-ui/core";

const SELF_SELECTION_MESSAGE = "You cannot choose yourself!";
const TOO_MANY_SELETIONS_MESSAGE = "You cannot choose more than 2 players!";
const ALERT_LEVEL = "error";
const OPEN_MESSAGE = true;
const CLOSED_MESSAGE = false;
const ERROR_MESSAGE_LENGTH = 2000;
const ERROR_VERTICALITY = "top";
const ERROR_HORIZONTAL = "left";

/**
 * Function used in Game One to get error message components based on the parameters given.
 * 
 * @param {*} selectedSelf indicates whether a player has selected himself
 * @param {*} setSelectedSelf allows the component to turn off the indiciator for the self-selection error message
 * @param {*} tooManySelections indicates whether a player has made more than two selections
 * @param {*} setTooManySelections allows the component to turn off the indiciator for the multiple-selection error message
 * 
 * @author Eric Doppelt
 */
function getAlerts(selectedSelf, setSelectedSelf, tooManySelections, setTooManySelections) {
    if (selectedSelf) {
      return getAlertComponent(SELF_SELECTION_MESSAGE, setSelectedSelf);
    } else if (tooManySelections) {
      return getAlertComponent(TOO_MANY_SELETIONS_MESSAGE, setTooManySelections);
    }
  }
  

function getAlertComponent(text, setClosed) {
    return (
      <Snackbar
        open={OPEN_MESSAGE}
        autoHideDuration={ERROR_MESSAGE_LENGTH}
        onClose={() => setClosed(CLOSED_MESSAGE)}
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