import React from "react";
import { withStyles } from "@material-ui/core";
import PlayerProfile from "../../icons/components/PlayerProfile";

const GROUP_ONE = 1;

const GROUP_ONE_COLOR = "#FF9133";
const GROUP_TWO_COLOR = "#9933FF";

var FIRST_PLAYER_INDEX = 0;
var SECOND_PLAYER_INDEX = 1;
var THIRD_PLAYER_INDEX = 2;

const styles = {
  groupBox: {
    borderRadius: "50px",
    opacity: ".8",
    margin: "auto",
    position: "absolute",
    height: "65vh",
    width: "10vw",
    top: "20vh",
  },
  outerDiv1: {
    position: "absolute",
    left: "30%",
  },
  outerDiv2: {
    position: "absolute",
    left: "83%",
  },
  innerDiv: {
    position: "relative",
    top: "3%",
  },
  firstImageDiv: {
    position: "relative",
    marginTop: '7vh',
  },
  imageDiv: {
    position: "relative",
    marginTop: "6vh",
  },
};

/**
 * Component used in Game Two to show three players in a vertical bar with a background equivalent to that of the group's they were into in Game One.
 * @param {*} props tells the three players to visualize in the player group and which group they are in.
 *
 * @author Eric Doppelt
 */
function VerticalPlayerGroup(props) {
  const { classes } = props;
  let isGroupOne = props.type === GROUP_ONE;
  let groupColor = isGroupOne ? GROUP_ONE_COLOR : GROUP_TWO_COLOR;
  let formattingName = isGroupOne ? classes.outerDiv1 : classes.outerDiv2;

  let margin = getMarginTop(props.windowHeight);
  let firstMargin = getFirstMarginTop(props.windowHeight);
  let boxWidth = getBoxWidth(props.windowWidth);

  // console.log("players: ", props.players);
  // console.log("playerdata: ", props.playerData);
  for (var i = 0; i < props.playerData.length; i++) {
    if (props.playerData[i].id == props.players[0]) {
      FIRST_PLAYER_INDEX = i;
    } else if (props.playerData[i].id == props.players[1]) {
      SECOND_PLAYER_INDEX = i;
    } else if (props.playerData[i].id == props.players[2]) {
      THIRD_PLAYER_INDEX = i;
    }
  }

  // console.log("first player index: ", FIRST_PLAYER_INDEX);
  // console.log("second player index: ", SECOND_PLAYER_INDEX);
  // console.log("third player index: ", THIRD_PLAYER_INDEX);

  return (
    <div className={formattingName}>
      <div className={classes.groupBox} style={{ backgroundColor: groupColor, width: boxWidth}}>
        <div className={classes.innerDiv}>
          <div className={classes.firstImageDiv} style={{marginTop: firstMargin}}>
            {getFormattedImage(
              props.playerData[FIRST_PLAYER_INDEX].avatar,
              props.allLoginCodes,
              props.selectedIndex,
              props.frontendIndex
          )}
          </div>
          <div className={classes.imageDiv} style={{marginTop: margin}}>
            {getFormattedImage(
              props.playerData[SECOND_PLAYER_INDEX].avatar,
              props.allLoginCodes,
              props.selectedIndex,
              props.frontendIndex
            )}
          </div>
          <div className={classes.imageDiv} style={{marginTop: margin}}>
            {getFormattedImage(
              props.playerData[THIRD_PLAYER_INDEX].avatar,
              props.allLoginCodes,
              props.selectedIndex,
              props.frontendIndex
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getBoxWidth(windowWidth) {
  if (windowWidth >= 1000) return '10vw';
  else return '100px'
}

function getFirstMarginTop(windowHeight) {
  if (windowHeight >= 950)  return '5vh';
  else if (windowHeight >= 910) return '4.5vh';
  else if (windowHeight >= 875) return '8vh';
  else if (windowHeight >= 825) return '7vh';
  else if (windowHeight >= 800) return '5.8vh';
  else if (windowHeight >= 765) return '7vh';
  else if (windowHeight >= 740) return '6vh';
  else if (windowHeight >= 720) return '6vh';
  else if (windowHeight >= 710) return '5.8vh';
  else if (windowHeight >= 680) return '5.3vh';
  else if (windowHeight >= 665) return '4.8vh';

  else return '4.3vh';
}

function getMarginTop(windowHeight) {
  
  if (windowHeight >= 950) return '12vh';
  else if (windowHeight >= 910) return '12vh';
  else if (windowHeight >= 875) return '8vh';
  else if (windowHeight >= 825) return '8vh';
  else if (windowHeight >= 800) return '8.5vh';
  else if (windowHeight >= 765) return '7.3vh';
  else if (windowHeight >= 740) return '7.3vh';
  else if (windowHeight >= 720) return '7.5vh';
  else if (windowHeight >= 710) return '7vh';
  else if (windowHeight >= 680) return '6.5vh';
  else if (windowHeight >= 665) return '6.5vh';

  else return '6.5vh';
}

function getFormattedImage(code, allLoginCodes, selectedIndex, frontendIndex) {
  // let codeIndex = allLoginCodes.indexOf(code);
  let codeIndex = code;
  // console.log("code: ", codeIndex);
  return (
    <PlayerProfile player={codeIndex} selectedIndex={selectedIndex} frontendIndex={frontendIndex}/>
  );
}

export default withStyles(styles)(VerticalPlayerGroup);
