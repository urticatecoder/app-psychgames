import React, {useEffect, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
const MIN_WIDTH = 1000;
const MIN_HEIGHT = 760;

const VALID = true;
const INVALID = false;

const DIALOG_TITLE = "Oh no! Your window is too small!";
const DIALOG_CONTENT = "Please expand your window to be at least " + MIN_WIDTH + " x " + MIN_HEIGHT + " pixels. Once you do so, this dialogue will close and you can continue playing!";

  /**
   * Function used to get formatting for buttons and bars associated with resources used in Game Two.
   * This is used to position resource buttons and bars such that they are vertically on top of one another.
   *
   * @author Eric Doppelt
   */
  function WindowChecker(props) {
    console.log('window');

    const [validWindow, setValidWindow] = useState(VALID);

    useEffect(() => {
        updateValidity(setValidWindow);
    });

    window.onresize = () => updateValidity(setValidWindow);
    
    return(
        <Dialog
        open={!validWindow}
        >
        <DialogTitle>{DIALOG_TITLE}</DialogTitle>
        <DialogContent>
            <DialogContentText>{DIALOG_CONTENT}</DialogContentText>
        </DialogContent>
        </Dialog>
    )
;  } 
  
 function updateValidity(setValidWindow) {
    if (!isValidSize()) setValidWindow(INVALID);
    else {
        setValidWindow(VALID);
    }
 }

 function isValidSize() {
     return (window.innerWidth >= MIN_WIDTH && window.innerHeight >= MIN_HEIGHT);
 }

  export default (WindowChecker);
  