import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import "../util/common_stylings/FullScreenDiv.css";
import axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button} from "@material-ui/core";

const DEFAULT_CODE = "INVALID";

const VERIFICATION_CODE_ROUTE = "/validate";

const INVALID_PLAYER = false;
const VALID_PLAYER = true;

const CLOSE_DIALOGUE = false;

const VALID_PREFIX = "Your prolific code is as follows: ";
const VALID_SUBMESSAGE = "Please return to Prolific and enter the following code to recieve the amount listed for your compensation. Note that this code is case sensitive. Thanks again for participating!";


const INVALID_TITLE = "You did not complete the experiment, so you will not be compensated.";
const INVALID_SUBMESSAGE = "If you believe that this is a mistake, please reach out to Dr. Khaw at melwin.khaw@duke.edu.";
const OKAY = "Okay";
const BUTTON_VARIANT = 'contained';
const OKAY_COLOR = 'Yes';

/**
 * Screen shown at the end of the game for users, telling them their total compensation and providing a code used to get paid on the Prolific site.
 * This is the last screen in the UI.
 * @param {*} props is used to provide to tell the component the player's login code.
 *
 * @author Eric Doppelt
 */
function ProlificDialogues(props) {
  const { classes } = props;

  const [prolificCode, setProlificCode] = useState(DEFAULT_CODE);
  const [validPlayer, setValidPlayer] = useState(INVALID_PLAYER);

  useEffect(() => {
    axios.get(VERIFICATION_CODE_ROUTE, {
        params: {
          loginCode: props.code,
        }
      }).then((res) => {
        console.log('RESPONSE FROM HTTP');
        console.log(res);
        if (res.data.success == 'true') {
          setProlificCode(res.data.code);
          setValidPlayer(VALID_PLAYER);
        }
      });

    }, [props.code, prolificCode]);

    var currentDialogue;
    if (validPlayer) currentDialogue = getValidDialogue(prolificCode, props.open, props.setOpen);
    else currentDialogue = getInvalidDialogue(props.open, props.setOpen);
    return(currentDialogue);
}

function getValidDialogue(prolificCode, open, setOpen) {
  return(
    <div>
    <Dialog
      open={open}
      onClose={() => setOpen(CLOSE_DIALOGUE)}
    >
      <DialogTitle>{VALID_PREFIX + prolificCode}</DialogTitle>
      <DialogContent>
          <DialogContentText>{VALID_SUBMESSAGE}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(CLOSE_DIALOGUE)} variant={BUTTON_VARIANT} color={OKAY_COLOR}>
          {OKAY}
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  )
}

function getInvalidDialogue(open, setOpen) {
  return(
    <div>
    <Dialog
      open={open}
      onClose={() => setOpen(CLOSE_DIALOGUE)}
    >
      <DialogTitle>{INVALID_TITLE}</DialogTitle>
      <DialogContent>
          <DialogContentText>{INVALID_SUBMESSAGE}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(CLOSE_DIALOGUE)} variant={BUTTON_VARIANT} color={OKAY_COLOR}>
          {OKAY}
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  )
}

export default (ProlificDialogues);
