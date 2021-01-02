import React, { useState, useEffect } from "react";
import { Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import "../util/common_stylings/FullScreenDiv.css";
import axios from "axios";
import { Variants } from "../util/common_constants/stylings/StylingsBundler";
import Payout from "./Payout";

const FULL_DIV = "fullDiv";

const DEFAULT_CODE = "";
const ITALIC_FONT = "italic";
const THANK_YOU_MESSAGE = "Thank you for participating!";

const PAYOUT_MESSAGE = "Your receipt is shown below."
const VERIFICATION_CODE_ROUTE = "/verification-code";

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

  const [prolificCode, setProlificCode] = useState(DEFAULT_CODE);

  useEffect(() => {
    axios
      .get(VERIFICATION_CODE_ROUTE, {
        params: {
          loginCode: props.code,
        },
      }).then((res) => {
        setProlificCode(res.data.code);
      });
  }, [props.code, prolificCode]);

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
      <Payout/>
    </div>
  );
}

export default withStyles(styles)(ProlificScreen);
