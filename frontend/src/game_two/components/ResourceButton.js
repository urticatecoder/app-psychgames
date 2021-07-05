import React from "react";
import ResourceImages from "../../icons/components/ResourceImages";
import {Box, withStyles } from "@material-ui/core";
import getMarginLeft from "../../util/common_functions/getResourceMarginLeft";
import getBackgroundColor from "../../util/common_functions/getResourceBackgroundColor";

const REMOVE_TOKEN_LABEL = "-1 Token";

const LARGE_WINDOW = 1300;
const LARGE_SIZE = 80;
const SMALL_SIZE = 60;
const LARGE_DIV = '100px';
const SMALL_DIV = '90px';
const LARGE_MARGIN = '-8px'
const SMALL_MARGIN = '0px'
const IMAGE = 'Image';
const LABEL ='Label';
const ID = 'ID';

const ITALIC_FONT = "italic"
const BOLD_FONT = "fontWeightBold"

const styles = {
  buttonFormatting: {
    position: "absolute",
    top: "68vh",
    borderRadius: 40,
  },
  innerDiv: {
    position: "relative",
    top: "15px",
  },
  textDiv: {
    position: "relative",
    top: "20px",
  },
  reduceDiv: {
    position: "relative",
    marginTop: "30px",
    borderRadius: 20,
    height: "30px",
    backgroundColor: "#ff645c",
  },
  reduceTextDiv: {
    position: "relative",
    top: "5px",
  },
};

/**
 * Component used to visualize a button for a given resource in the UI during Game Two.
 * Functionality includes visualizing the resource's icon and incrementing/decrementing tokens when the icon or the remove tokens button is clicked.
 * @param {*} props tells which resource the button is for, in addition to providing methods to add and remove a token to the given resource.
 * 
 * @author Eric Doppelt
 */
function ResourceButton(props) {
  const { classes } = props;
  let background = getBackgroundColor(props.resource);
  let marginL = getMarginLeft(props.resource);
  let divSize = getDivSize(props.windowWidth);
  let textMarginTop = getTextMarginTop(props.windowWidth)  
  
  return (
    <div>
      <div
        className={classes.buttonFormatting}
        style={{ backgroundColor: background, left: marginL, height: divSize, width: divSize}}
      >
        <div className={classes.innerDiv}>
          <div onClick={() => props.addToken()}>
            {getImage(props.resource, props.windowWidth)}
          </div>
          <div className={classes.textDiv} style={{marginTop: textMarginTop}}>
            <Box fontStyle={ITALIC_FONT} fontWeight={BOLD_FONT}>
              {ResourceImages[props.resource + LABEL]}
            </Box>
          </div>
          <div className={classes.reduceDiv} style={{width: divSize}} onClick={() => props.removeToken()}>
            <div className={classes.reduceTextDiv}>{REMOVE_TOKEN_LABEL}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getImage(resource, windowWidth) {
  let size = getSize(windowWidth);
  return(
    <img
      src={ResourceImages[resource + IMAGE]}
      id={ResourceImages[resource + ID]}
      alt={ResourceImages[resource + LABEL]}
      width={size}
      height={size}
    />
  );
}

function getTextMarginTop(windowWidth) {
  if (windowWidth >= LARGE_WINDOW) return LARGE_MARGIN;
  else return SMALL_MARGIN;
}

function getDivSize(windowWidth) {
  if (windowWidth >= LARGE_WINDOW) return LARGE_DIV;
  else return SMALL_DIV;
}
function getSize(windowWidth) {
  if (windowWidth >= LARGE_WINDOW) return LARGE_SIZE;
  else return SMALL_SIZE;
}

export default withStyles(styles)(ResourceButton);
