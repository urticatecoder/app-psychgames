import React from "react";
import PlayerGroup from "../../icons/components/PlayerGroup";
import { Typography, withStyles } from "@material-ui/core";
import DelayedConfetti from "./DelayedConfetti";
import ContinueButton from "../../util/components/ContinueButton";

const FULL_DIV = "fullDiv";
const WINNING_HEADER = "Winning Players";
const LOSING_HEADER = "Losing Players";
const WINNER_ID = "winnerText";
const LOSER_ID = "loserText";
const BUTTON_MESSAGE = "Continue to Game Two";
const ALWAYS_ENABLED = false;

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

  // let winnerIndices = getAvatarIndices(props.winners, props.allLoginCodes);
  // let loserIndices = getAvatarIndices(props.losers, props.allLoginCodes);
  let winnerIndices = getAvatarIndices(props.currentState.winners, props.currentState.playerData);
  let loserIndices = getAvatarIndices(props.currentState.losers, props.currentState.playerData);
  // console.log("winners: ", props.currentState.winners);
  // console.log("losers: ", props.currentState.losers);
  // console.log("winnerIndices: ", winnerIndices);
  // console.log("loserIndices: ", loserIndices);
  // console.log("id: ", props.id);
  return (
    <div>
      <DelayedConfetti />
      {getGroup(
        props.currentState.playerData,
        props.currentState.winners,
        classes.winners,
        classes.playerGroup,
        WINNING_HEADER,
        winnerIndices,
        WINNER_ID,
        props.selectedIndex,
        props.frontendIndex,
        props
      )}
      {getGroup(
        props.currentState.playerData,
        props.currentState.losers,
        classes.losers,
        classes.playerGroup,
        LOSING_HEADER,
        loserIndices,
        LOSER_ID,
        props.selectedIndex,
        props.frontendIndex,
        props
      )}
    </div>
  );
}

function getGroup(playerData, groupIds, divClassName, groupClassName, headerText, playersShown, textID, selectedIndex, frontendIndex, props) {
  return (
    <div className={divClassName}>
      <Typography id={textID} variant={"h2"}>
        {headerText}
      </Typography>
      <div className={groupClassName}>
        <PlayerGroup players={playersShown} selectedIndex={selectedIndex} frontendIndex={frontendIndex} id={props.id} playerData={playerData} groupIds={groupIds}/>
      </div>
    </div>
  );
}

function getAvatarIndices(groupIds, playerData) {
  var indices = [];
  
  // console.log("group ids: ", groupIds);
  // console.log("player data: ", playerData);
  for (let i = 0; i < playerData.length; i++) {
    for (let j = 0; j < groupIds.length; j++) {
      if (groupIds[j] === playerData[i].id) {
        indices.push(playerData[i].avatar)
      }
    }
  }

  // for (let i = 0; i < loginCodes.length; i++) {
  //   for (let j = 0; j < allLoginCodes.length; j++) {
  //     if (allLoginCodes[j] === loginCodes[i]) {
  //       indices.push(j);
  //       break;
  //     }
  //   }
  // }
  return indices;
}

export default withStyles(styles)(Summary);
