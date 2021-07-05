import React, {useState} from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, withStyles } from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ResourceImages from "../../icons/components/ResourceImages";
import { ResourceNames } from "../../util/common_constants/game_two/GameTwoBundler";

const SHOW = true;
const HIDE = false;
const BUTTON_VARIANT = 'contained';
const OKAY_COLOR = 'primary';
const MAIN_BUTTON_MESSAGE = "Payoff Help";
const DIALOG_TITLE = "The payoffs of Compete, Keep, and Invest:";
const COMPETE_PRIMARY = "Compete";
const COMPETE_SECONDARY = "This returns X tokens to you and your grouup members, while also removing that amount from non-members final payout."
const INVEST_PRIMARY = "Invest";
const INVEST_SECONDARY = "This returns X tokens to you and your group members for every token allocated."
const KEEP_PRIMARY = "Keep";
const KEEP_SECONDARY = "This will let you keep that amount of tokens to yourself."
const FOOTER_MESSAGE_ONE = "Refer to the top of the screen for current payout values."
const FOOTER_MESSAGE_TWO = "They change on every turn!"
const BUTTON_MESSAGE = "Got it!";
const IMAGE = 'Image';
const LABEL ='Label';
const ID = 'ID';
const COLOR = "color"

const styles = {
    dialogue: {
        width: '100%',
        maxWidth: 400,
      },
      button: {
        position: 'absolute',
        top: '10px',
        right: '110px',
        zIndex: 1,
        backgroundColo: "#21b6ae",
      },
      avatar: {
        width: 55, 
        height: 55,
        marginLeft: -15
      }
  };

  /**
   * Function used to get formatting for buttons and bars associated with resources used in Game Two.
   * This is used to position resource buttons and bars such that they are vertically on top of one another.
   *
   * @author Eric Doppelt
   */
  function Rules(props) {

    const {classes} = props;
    const [show, setShow] = useState(HIDE)

    if (show) {
        return(
            <Dialog
            open={show}
            onClose={() => setShow(HIDE)}
            >
            <DialogTitle>{DIALOG_TITLE}</DialogTitle>
            <DialogContent>
                <List className={classes.dialogue}>
                        {getListItem(classes.avatar, ResourceNames.COLOR_KEEP, KEEP_PRIMARY, KEEP_SECONDARY)}
                        {getListItem(classes.avatar, ResourceNames.COLOR_INVEST, INVEST_PRIMARY, INVEST_SECONDARY)}
                        {getListItem(classes.avatar, ResourceNames.COLOR_COMPETE, COMPETE_PRIMARY, COMPETE_SECONDARY)}
                </List>
                <br/>
                <br/>
                <DialogContentText>
                        {FOOTER_MESSAGE_ONE}
                        <br/>
                        {FOOTER_MESSAGE_TWO}
                </DialogContentText>
            </DialogContent>
            
            <DialogActions>
                <Button
                    variant={BUTTON_VARIANT} 
                    color={OKAY_COLOR}
                    onClick={() => setShow(HIDE)} 
                >
                    {BUTTON_MESSAGE}
                </Button>
            </DialogActions>
            </Dialog>
        )
    } else {
        return(
            <div className={classes.button}>
                <Button
                    variant={BUTTON_VARIANT} 
                    color={OKAY_COLOR}
                    onClick={() => setShow(SHOW)}
                >
                    {MAIN_BUTTON_MESSAGE}
                </Button>
            </div>
        )
    }

} 

function getListItem(avatarClass, resource, primaryText, secondaryText) {
    return(
        <ListItem>
            <ListItemAvatar>
                <Avatar className={avatarClass}>
                <img
                    src={ResourceImages[resource + IMAGE]}
                    id={ResourceImages[resource + ID]}
                    alt={ResourceImages[resource + LABEL]}
                    width={35}
                    height={35}
                />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={primaryText} secondary={secondaryText} />
        </ListItem>
    )
}
  

  export default withStyles(styles)(Rules);