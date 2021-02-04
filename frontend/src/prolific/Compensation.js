import React, { useState, useEffect } from "react";
import { Typography, Box, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "../util/common_stylings/FullScreenDiv.css";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";
import Payout from "./Payout";
import ProlificDialogues from "./ProlificDialogues";

const FULL_DIV = "fullDiv";

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

const BUTTON_TIMEOUT = 27000;

const styles = {
  payoutText: {
    marginTop: "10px",
  },
  thankYouText: {
    marginTop: "10vh",
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

  let margin = getMarginTop(props.windowHeight);
  let marginSmaller = getMarginSmaller(props.windowHeight);
  let marginButton = getMarginButton(props.windowHeight);

  useEffect(() => {
    setTimeout(() => {
      setDisableButton(ENABLE_BUTTON);
    }, BUTTON_TIMEOUT);
  });

  return (
    <div className={FULL_DIV}>
      <Typography
        className={classes.thankYouText}
        style={{marginTop: margin}}
        variant={Variants.LARGE_TEXT}
      >
        {THANK_YOU_MESSAGE}
      </Typography>

      <Typography
        className={classes.payoutText}
        style={{marginTop: marginSmaller}}
        variant={Variants.NORMAL_TEXT}
      >
        <Box fontStyle={ITALIC_FONT}>
        {PAYOUT_MESSAGE}
        </Box>
      </Typography>
      <Payout style={{}} windowWidth={props.windowWidth} windowHeight={props.windowHeight} code={props.code}/>
      <Button
        disabled={disableButton}
        variant={Variants.CONTAINED}
        color={BUTTON_COLOR}
        onClick={() => setOpenDialogue(OPEN_DIALOGUE)}
        style={{height: '50px', width: '250px', marginTop: marginButton, positive: 'relative', opacity: BUTTON_OPACITY}}
      >
        {BUTTON_MESSAGE}
      </Button>
      <ProlificDialogues open={openDialogue} setOpen={setOpenDialogue} code={props.code}/>
    </div>
  );
}

function getMarginTop(windowHeight) {
  if (windowHeight >= 915) return "10vh";
  else return "5vh";
}

function getMarginSmaller(windowHeight) {
  if (windowHeight >= 915) return "10px";
  else return "5px";
}

function getMarginButton(windowHeight) {
  if (windowHeight >= 850) return "100px";
  else if (windowHeight >= 825) return "70px";
  else return "60px";
}

export default withStyles(styles)(ProlificScreen);
