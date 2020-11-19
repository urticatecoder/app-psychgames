import React from "react";
import { withStyles } from "@material-ui/core";
import PlayerProfile from "../../icons/components/PlayerProfile";

const GROUP_ONE = 1;

const GROUP_ONE_COLOR = "#FF9133";
const GROUP_TWO_COLOR = "#9933FF";

const FIRST_PLAYER_INDEX = 0;
const SECOND_PLAYER_INDEX = 1;
const THIRD_PLAYER_INDEX = 2;

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
  imageDiv: {
    position: "relative",
    marginTop: "40%",
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

  return (
    <div className={formattingName}>
      <div className={classes.groupBox} style={{ backgroundColor: groupColor }}>
        <div className={classes.innerDiv}>
          {getFormattedImage(
            classes,
            props.players[FIRST_PLAYER_INDEX],
            props.allLoginCodes
          )}
          {getFormattedImage(
            classes,
            props.players[SECOND_PLAYER_INDEX],
            props.allLoginCodes
          )}
          {getFormattedImage(
            classes,
            props.players[THIRD_PLAYER_INDEX],
            props.allLoginCodes
          )}
        </div>
      </div>
    </div>
  );
}

function getFormattedImage(classes, code, allLoginCodes) {
  let codeIndex = allLoginCodes.indexOf(code);

  return (
    <div className={classes.imageDiv}>
      <PlayerProfile player={codeIndex} />
    </div>
  );
}

export default withStyles(styles)(VerticalPlayerGroup);
