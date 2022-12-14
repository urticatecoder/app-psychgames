import React, {useEffect, useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@mui/material/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';

const OPEN = true;
const HIDE = false;

const OKAY_COLOR = 'secondary';
const RULES = "Rules";

const BUTTON_MESSAGE = "Got it!";

const WIFI_PRIMARY = "Losing Connection or Exiting Site";
const WIFI_SECONDARY = "If your internet connection goes out, or you refresh or leave your page, you can rejoin the game."

const EXIT_PRIMARY = "Inactivity";
const EXIT_SECONDARY = "If you are inactive for five rounds or more, you will be removed from the game."

const SCREEN_PRIMARY = "Shrinking Screen ";
const SCREEN_SECONDARY = "If you change the screen dimensions, you may be prompted to expand the window. Doing so will remove this alert."

const DIALOG_TITLE = "The following actions may get you removed:";

const buttonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1,
    color: OKAY_COLOR
}

  /**
   * Presents the "Rules" button on the top right of the page which shows the dialog when clicked.
   * @author Eric Doppelt
   */
  function RulesDialog() {

    const [open, setOpen] = useState(HIDE)
    
    return(
        <div>
            <Dialog
            open={open}
            onClose={() => setOpen(HIDE)}
            >
            <DialogTitle>{DIALOG_TITLE}</DialogTitle>
            <DialogContent>
                <List sx={{width: '100%', maxWidth: 400}}>
                    {getListItem(<WifiOffIcon/>, WIFI_PRIMARY, WIFI_SECONDARY)}
                    {getListItem(<ExitToAppIcon/>, EXIT_PRIMARY, EXIT_SECONDARY)}
                    {getListItem(<AspectRatioIcon/>, SCREEN_PRIMARY, SCREEN_SECONDARY)}
                </List>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setOpen(HIDE)} 
                    variant={"contained"} 
                    color={OKAY_COLOR}
                >
                    {BUTTON_MESSAGE}
                </Button>
            </DialogActions>
            </Dialog>
            <Button
                variant={'contained'} 
                color={OKAY_COLOR}
                onClick={() => setOpen(OPEN)}
                sx={{...buttonStyle}}
            >
                {RULES}
            </Button>
        </div>
    )
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
  
export default RulesDialog;
  