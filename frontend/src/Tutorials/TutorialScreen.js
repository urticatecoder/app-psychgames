
import React, {useState} from 'react';
import ReactPlayer from 'react-player';
import { withStyles } from '@material-ui/core/styles';
import '../CommonStylings/FullScreenDiv.css';
import ContinueButton from '../CommonComponents/ContinueButton';
import { Typography, Box} from '@material-ui/core';

const FULL_DIV = 'fullDiv';
const PLAY_VIDEO = true;
const PAUSE_VIDEO = false;

const ENABLE_BUTTON = true;
const DISABLE_BUTTON = false;

const HEADER_VARIANT = 'h3';

const styles = {
    headerDiv: {
        marginTop: '25px',
    },
    videoOuterDiv: {
        position: 'absolute',
        left: '12vw',
        top: '10vh',
        backgroundColor: '#ed6a66',
        padding: '50px 50px 50px 50px',
        borderRadius: '20px',
        width: '70vw',
    },
    videoInnerDiv: {
        position: 'absolute',
        left: '15vw',
        top: '12vh',
    },
    buttonDiv: {
        position: 'absolute',
        top: '92vh',
        left: '45vw'
    }
}

function TutorialScreen(props) {

    const [playVideo, setPlayVideo] = useState(PAUSE_VIDEO);
    const [enableButton, setEnableButton] = useState(DISABLE_BUTTON);

    setTimeout(() => {
        setPlayVideo(PLAY_VIDEO);
    }, props.initialPause);

    setTimeout(() => {
        setEnableButton(ENABLE_BUTTON)
        setPlayVideo(PAUSE_VIDEO)
    }, props.initialPause + props.videoLength);

    const {classes} = props;

    return(
        <div className={FULL_DIV}>
            <div className={classes.headerDiv}>
                <Typography variant={HEADER_VARIANT}>
                    <Box fontStyle="italic">
                        {props.text}
                    </Box>
                </Typography>
            </div>
            <div className={classes.videoOuterDiv}>
                    <ReactPlayer
                        className='react-player fixed-bottom'
                        url= {props.URL}
                        width='100%'
                        height='100%'
                        playing = {playVideo}
                    />
            </div>
            <div className={classes.buttonDiv}>
                <ContinueButton route={props.nextRoute} disabled={!enableButton}/>
            </div>
        </div>
    )
}

export default withStyles(styles)(TutorialScreen);