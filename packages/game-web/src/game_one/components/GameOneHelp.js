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
import { ResourceNames } from "../../util/constants/game_two/GameTwoBundler";

const SHOW = true;
const HIDE = false;
const BUTTON_VARIANT = 'contained';
const OKAY_COLOR = 'primary';
const MAIN_BUTTON_MESSAGE = "Help";
const DIALOG_TITLE = "Select 2 other players and click CONFIRM to submit your turn.";
const SINGLE_PRIMARY = "Single Bonus";
const SINGLE_SECONDARY = "You receive a single bonus if another player selects you."
const DOUBLE_PRIMARY = "Double Bonus";
const DOUBLE_SECONDARY = "You receive a double bonus if both you and another player select each other."
const TRIPLE_PRIMARY = "Triple Bonus";
const TRIPLE_SECONDARY = "You receive a triple bonus if you and two other players all select each other."
const FOOTER_MESSAGE_ONE = "You will be a winner if your score is in the top 3 among the 6 players, and a loser if your score is in the bottom 3."
const FOOTER_MESSAGE_TWO = ""
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
                        {getListItem(classes.avatar, ResourceNames.COLOR_COMPETE, SINGLE_PRIMARY, SINGLE_SECONDARY)}
                        {getListItem(classes.avatar, ResourceNames.COLOR_KEEP, DOUBLE_PRIMARY, DOUBLE_SECONDARY)}
                        {getListItem(classes.avatar, ResourceNames.COLOR_INVEST, TRIPLE_PRIMARY, TRIPLE_SECONDARY)}
                </List>
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
            {/* <ListItemAvatar>
                <Avatar className={avatarClass}>
                <img
                    src={ResourceImages[resource + IMAGE]}
                    id={ResourceImages[resource + ID]}
                    alt={ResourceImages[resource + LABEL]}
                    width={35}
                    height={35}
                />
                </Avatar>
            </ListItemAvatar> */}
            <ListItemText primary={primaryText} secondary={secondaryText} />
        </ListItem>
    )
}
  

  export default withStyles(styles)(Rules);