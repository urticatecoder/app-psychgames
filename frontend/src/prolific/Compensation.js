import React, { useState, useEffect } from "react";
import { Typography, Box, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "../util/common_stylings/FullScreenDiv.css";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";
import Payout from "./Payout";
import ProlificDialogues from "./ProlificDialogues";

const FULL_DIV = "fullDiv";

const DEFAULT_CODE = "";
const ITALIC_FONT = "italic";
const THANK_YOU_MESSAGE = "Thank you for participating!";

const PAYOUT_MESSAGE = "Your receipt is shown below."
const BUTTON_MESSAGE = 'Get Prolific Code';

const BUTTON_COLOR = "secondary";
const BUTTON_OPACITY = .85

const DISABLE_BUTTON = true;
const ENABLE_BUTTON = false;

const OPEN_DIALOGUE = true;
const CLOSE_DIALOGUE = false;

const BUTTON_TIMEOUT = 31000;

const styles = {
  prolificText: {
    marginTop: "80px",
  },
  payoutText: {
    marginTop: "10px",
  },
  thankYouText: {
    marginTop: "60px",
  },
};

/**
 * Screen shown at the end of the game for users, telling them their total compensation and providing a code used to get paid on the Prolific site.
 * This is the last screen in the UI.
 * @param {*} props is used to provide to tell the component the player's login code.
 *
 * @author Eric Doppelt
 */
function ProlificScreen(props) {
  const { classes } = props;

  const [disableButton, setDisableButton] = useState(DISABLE_BUTTON);
  const [openDialogue, setOpenDialogue] = useState(CLOSE_DIALOGUE);

  useEffect(() => {
    setTimeout(() => {
      setDisableButton(ENABLE_BUTTON);
    }, BUTTON_TIMEOUT);
  });

  return (
    <div className={FULL_DIV}>
      <Typography
        className={classes.thankYouText}
        variant={Variants.LARGE_TEXT}
      >
        {THANK_YOU_MESSAGE}
      </Typography>

      <Typography
        className={classes.payoutText}
        variant={Variants.NORMAL_TEXT}
      >
        <Box fontStyle={ITALIC_FONT}>
        {PAYOUT_MESSAGE}
        </Box>
      </Typography>
      <Payout code={props.code}/>
      <Button
        disabled={disableButton}
        variant={Variants.CONTAINED}
        color={BUTTON_COLOR}
        onClick={() => setOpenDialogue(OPEN_DIALOGUE)}
        style={{height: '40px', positive: 'relative', marginTop: '68vh', opacity: BUTTON_OPACITY}}
      >
        {BUTTON_MESSAGE}
      </Button>
      <ProlificDialogues open={openDialogue} setOpen={setOpenDialogue} code={props.code}/>
    </div>
  );
}

export default withStyles(styles)(ProlificScreen);
