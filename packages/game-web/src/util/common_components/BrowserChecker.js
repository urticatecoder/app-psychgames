import React, {useEffect, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const IS_CHROME = true;
const IS_NOT_CHROME = false;

const DIALOG_TITLE = "Oh no! You are using an unsupported web browser!";
const DIALOG_CONTENT = "Please use Google's Chrome web broswer to acess the site. Thanks!";

  /**
   * Function used to get formatting for buttons and bars associated with resources used in Game Two.
   * This is used to position resource buttons and bars such that they are vertically on top of one another.
   *
   * @author Eric Doppelt
   */
  function BrowserChecker(props) {

    const [isChrome, setIsChrome] = useState(IS_CHROME);

    useEffect(() => {
        setIsChrome(browswerIsChrome());
    });
    
    return(
        <Dialog
        open={!isChrome}
        >
        <DialogTitle>{DIALOG_TITLE}</DialogTitle>
        <DialogContent>
            <DialogContentText>{DIALOG_CONTENT}</DialogContentText>
        </DialogContent>
        </Dialog>
    )
;  } 
  
 function browswerIsChrome() {
    
    let isChromium = window.chrome;
    let winNav = window.navigator;
    let vendorName = winNav.vendor;
    let isOpera = typeof window.opr !== "undefined";
    let isIEedge = winNav.userAgent.indexOf("Edge") > -1;
    let isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
        return IS_CHROME;
    // is Google Chrome on IOS
    } else if(
        isChromium !== null &&
        typeof isChromium !== "undefined" &&
        vendorName === "Google Inc." &&
        isOpera === false &&
        isIEedge === false
    ) {
        return IS_CHROME;
    } else { 
        return IS_NOT_CHROME;
    }
 }

  export default (BrowserChecker);
  