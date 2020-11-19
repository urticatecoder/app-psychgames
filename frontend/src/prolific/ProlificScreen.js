import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "../common/common_stylings/FullScreenDiv.css";
import axios from "axios";
import { Variants } from "../common/common_constants/stylings/StylingsBundler";

const FULL_DIV = "fullDiv";

const DEFAULT_CODE = "";
const INSTRUCTIONS_MESSAGE = "Prolific Code: ";
const PAYOUT_MESSAGE = "Final payout: $";
const THANK_YOU_MESSAGE = "Thank you for participating!";
const DEFAULT_AMOUNT = "10.50";

const PROLIFIC_CODE_ID = "prolificCode";

const styles = {
  prolificText: {
    marginTop: "140px",
  },
  payoutText: {
    marginTop: "30px",
  },
  thankYouText: {
    marginTop: "100px",
  },
};

/**
 * Screen shown at the end of the game for users, telling them their total compensation and providing a code used to get paid on the Prolific site.
 * This is the last screen in the UI.
 *
 * @author Eric Doppelt
 */
function ProlificScreen(props) {
  const { classes } = props;

  const [prolificCode, setProlificCode] = useState(DEFAULT_CODE);

  useEffect(() => {
    axios
      .get("/verification-code", {
        params: {
          loginCode: props.code,
        },
      })
      .then((res) => {
        setProlificCode(res.data.code);
      });
  }, [props.code, prolificCode]);

  return (
    <div className={FULL_DIV}>
      <Typography
        className={classes.thankYouText}
        variant={Variants.SMALL_TEXT}
      >
        {THANK_YOU_MESSAGE}
      </Typography>
      <Typography
        id={PROLIFIC_CODE_ID}
        className={classes.prolificText}
        variant={Variants.NORMAL_TEXT}
      >
        {INSTRUCTIONS_MESSAGE + prolificCode}
      </Typography>
      <Typography className={classes.payoutText} variant={Variants.NORMAL_TEXT}>
        {PAYOUT_MESSAGE + DEFAULT_AMOUNT}
      </Typography>
    </div>
  );
}

export default withStyles(styles)(ProlificScreen);
