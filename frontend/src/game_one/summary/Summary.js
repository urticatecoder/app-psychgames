import React from "react";
import PlayerGroup from "../../icons/components/PlayerGroup";
import { Typography, withStyles } from "@material-ui/core";
import "../../util/common_stylings/FullScreenDiv.css";
import DelayedConfetti from "./DelayedConfetti";
import ContinueButton from "../../util/common_components/ContinueButton";
import { Variants } from "../../util/common_constants/stylings/StylingsBundler";

const FULL_DIV = "fullDiv";
const WINNING_HEADER = "Winning Players";
const LOSING_HEADER = "Losing Players";
const WINNER_ID = "winnerText";
const LOSER_ID = "loserText";

const ALWAYS_ENABLED = false;
const GAME_TWO_TUTORIAL_ROUTE = "game-two-tutorial"

const styles = {
  winners: {
    marginTop: "15vh",
    marginLeft: "10%",
    marginRight: "10%",
  },
  losers: {
    marginTop: "15vh",
    marginLeft: "10%",
    marginRight: "10%",
  },
  playerGroup: {
    marginTop: "30px",
  },
};

/**
 * Component used to visualize the summary screen shown after Game One.
 * @param {*} props tells which avatars won and lost.
 * 
 * @author Eric Doppelt
 */
function Summary(props) {
  const { classes } = props;

  let winnerIndices = getAvatarIndices(props.winners, props.allLoginCodes);
  let loserIndices = getAvatarIndices(props.losers, props.allLoginCodes);

  return (
    <div className={FULL_DIV}>
      <DelayedConfetti />
      {getGroup(
        classes.winners,
        classes.playerGroup,
        WINNING_HEADER,
        winnerIndices,
        WINNER_ID
      )}
      {getGroup(
        classes.losers,
        classes.playerGroup,
        LOSING_HEADER,
        loserIndices,
        LOSER_ID
      )}
      <br />
      <br />
      <br />
      <ContinueButton
        className={classes.continueButton}
        route={GAME_TWO_TUTORIAL_ROUTE}
        disabled={ALWAYS_ENABLED}
      />
    </div>
  );
}

function getGroup(divClassName, groupClassName, headerText, playersShown, textID) {
  return (
    <div className={divClassName}>
      <Typography id={textID} variant={Variants.SMALL_TEXT}>
        {headerText}
      </Typography>
      <div className={groupClassName}>
        <PlayerGroup players={playersShown} />
      </div>
    </div>
  );
}

function getAvatarIndices(loginCodes, allLoginCodes) {
  let indices = [];

  for (let i = 0; i < loginCodes.length; i++) {
    for (let j = 0; j < allLoginCodes.length; j++) {
      if (allLoginCodes[j] === loginCodes[i]) {
        indices.push(j);
        break;
      }
    }
  }
  return indices;
}

export default withStyles(styles)(Summary);
