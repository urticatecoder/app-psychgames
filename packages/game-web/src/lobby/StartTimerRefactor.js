import React, { useEffect, useState } from "react";
import { Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Timer from "react-compound-timer";
import { withRouter } from 'react-router-dom';


const TIMER_ID = "timer";
const TEXT_ID = "timerText";
const DIV_ID = "timerDiv";
const ITALIC_FONT = "italic";
const WELCOME_MESSAGE = "The game will begin in:";
const INSTRUCTIONS_MESSAGE = "Please wait while other players join in.";
const MINUTES = "Minutes";
const SECONDS = "Seconds";

const styles = {
    welcomeInstruction: {
      marginTop: "15vh",
    },
    timerInstruction: {
      marginTop: "5vh",
    },
};

function StartTimerRefactor(props) {
    const { classes } = props;
    const lobbyEndTime = Date.parse(props.currentState.lobbyEndTime);
    console.log("lobby end time: ", lobbyEndTime);
    const time = new Date();
    const timeToEnd = lobbyEndTime - time.getTime();

    return (
        <div className={classes.startTimerRefactor} id={DIV_ID}>
            <Typography
                className={classes.welcomeInstruction}
                id={TEXT_ID}
                variant={"h4"}
            >
                <Box fontStyle={ITALIC_FONT}>
                    {INSTRUCTIONS_MESSAGE}
                </Box>
            </Typography>
            <Typography
                className={classes.timerInstruction}
                variant={"h3"}
            >
                {WELCOME_MESSAGE}
            </Typography>

            <Timer
                initialTime={timeToEnd}
                direction="backward"
            >
                {() => (
                    <React.Fragment>
                        <Typography variant={"h3"}>
                            <br />
                            <Timer.Minutes /> minutes
                            <br />
                            <Timer.Seconds /> seconds
                            <br />
                        </Typography>   
                    </React.Fragment>
                )}
            </Timer>
        </div>

    );
}

export default withRouter(withStyles(styles)(StartTimerRefactor));