import React, { useState, useEffect } from "react";
import TutorialScreen from '../../tutorials/TutorialScreen';
import IntroTimer from "../../util/components/IntroTimer";
import Summary from '../../game_one/summary/Summary';
import Routes from '../../util/constants/routes';
import { withRouter } from "react-router-dom";

const SHOW_TUTORIAL = true;

const HIDE_TUTORIAL = false;
const HIDE_BUTTON = false;

const TIMER_MESSAGE = "Game Two";
const TIMER_LENGTH = 191000;

const GAME_TWO_TUTORIAL_FILEPATH = "Tutorials/game2_tutorial_221213.mp4";
const GAME_TWO_TUTORIAL_LENGTH = 181000;
const GAME_TWO_TUTORIAL_TEXT = "Game 2 Tutorial";
const DEFAULT_ANIMATION_PAUSE = 1000;

const SUMMARY_SCREEN_DURATION = 10 * 1000;
const FULL_DIV = "fullDiv";

const GAME_TWO_ROUTE = '/game-two';
/**
 * Component used to visualize the lobby where users wait to enter the game.
 * @param {*} props is used to tell the component the login code, which is provided to the StartTimer.
 *
 * @author Eric Doppelt
 */
function GameTwoIntro(props) {

  const [showTutorial, setShowTutorial] = useState(HIDE_TUTORIAL);

  if (!props.currentState) {
    props.history.push(Routes.LOGIN);
    return (<div></div>);
  }

  let tutorialScreen = getTutorial(props);
  let summaryScreen = getSummary(props);

  var display = showTutorial ? tutorialScreen : summaryScreen;

  useEffect(() => {
    setTimeout(() => {
      setShowTutorial(SHOW_TUTORIAL);
    }, SUMMARY_SCREEN_DURATION);
  });

  return (
      <div className={FULL_DIV}>
        <IntroTimer
          message={TIMER_MESSAGE}
          // length={TIMER_LENGTH}
          length={TIMER_LENGTH}
          nextRoute={GAME_TWO_ROUTE}
          currentState={props.currentState}
        />
        {display}
      </div>);
}

function getSummary(props) {
    return(
        <Summary
          // winners={props.winners}
          selectedIndex={props.selectedIndex}
          // losers={props.losers}
          allLoginCodes={props.allLoginCodes}
          frontendIndex={props.frontendIndex}
          currentState={props.currentState}
          id={props.id}
          playerData={props.playerData}
        />
    );
}

function getTutorial(props) {
    return(
        <TutorialScreen
            URL={GAME_TWO_TUTORIAL_FILEPATH}
            showButton={HIDE_BUTTON}
            initialPause={500}
            videoLength={GAME_TWO_TUTORIAL_LENGTH}
            text={GAME_TWO_TUTORIAL_TEXT}
            currentState={props.currentState}
        />
    );
}

export default withRouter(GameTwoIntro);
