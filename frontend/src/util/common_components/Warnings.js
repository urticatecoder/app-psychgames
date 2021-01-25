import React, {useEffect, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, withStyles } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';

const SHOW = true;
const HIDE = false;
const BUTTON_VARIANT = 'contained';
const OKAY_COLOR = 'secondary';
const RULES = "Rules";

const BUTTON_MESSAGE = "Got it!";

const WIFI_PRIMARY = "Losing Wifi";
const WIFI_SECONDARY = "If your internet connection goes out, you may not be able to rejoin the experiment."

const EXIT_PRIMARY = "Exiting Site";
const EXIT_SECONDARY = "If you refresh your page or travel to another site, you will be kicked out of the game."

const SCREEN_PRIMARY = "Shrinking Screen ";
const SCREEN_SECONDARY = "If you change the screen dimensions, you may be prompted to expand the window. Doing so will remove this alert."

const DIALOG_TITLE = "The following actions may get you removed:";

const styles = {
    dialogue: {
        width: '100%',
        maxWidth: 400,
      },
      button: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1,
      },
  };

  /**
   * Function used to get formatting for buttons and bars associated with resources used in Game Two.
   * This is used to position resource buttons and bars such that they are vertically on top of one another.
   *
   * @author Eric Doppelt
   */
  function Warnings(props) {

    const [showWarnings, setShowWarnings] = useState(!SHOW);
    const {classes} = props;
    
    
    if (showWarnings) {
        return(
            <Dialog
            open={showWarnings}
            >
            <DialogTitle>{DIALOG_TITLE}</DialogTitle>
            <DialogContent>
                <List className={classes.dialogue}>
                        {getListItem(<WifiOffIcon/>, WIFI_PRIMARY, WIFI_SECONDARY)}
                        {getListItem(<ExitToAppIcon/>, EXIT_PRIMARY, EXIT_SECONDARY)}
                        {getListItem(<AspectRatioIcon/>, SCREEN_PRIMARY, SCREEN_SECONDARY)}
                </List>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setShowWarnings(HIDE)} 
                    variant={BUTTON_VARIANT} 
                    color={OKAY_COLOR}
                >
                    {BUTTON_MESSAGE}
                </Button>
            </DialogActions>
            </Dialog>
        )
    } else {
        console.log('HI');
        return(
            <div className={classes.button}>
                <Button
                    variant={BUTTON_VARIANT} 
                    color={OKAY_COLOR}
                    onClick={() => setShowWarnings(SHOW)}
                >
                    {RULES}
                </Button>
            </div>
        )
    }

} 

function getListItem(icon, primaryText, secondaryText) {
    return(
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    {icon}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={primaryText} secondary={secondaryText} />
        </ListItem>
    )
}
  

  export default withStyles(styles)(Warnings);
  