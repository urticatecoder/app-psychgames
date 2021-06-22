import React, { useState, useEffect } from "react";
import TutorialScreen from '../../tutorials/TutorialScreen';
import IntroTimer from "../../util/common_components/IntroTimer";
import Summary from '../../game_one/summary/Summary';

const SHOW_TUTORIAL = true;

const HIDE_TUTORIAL = false;
const HIDE_BUTTON = false;

const TIMER_MESSAGE = "Game Two";
const TIMER_LENGTH = 55999;

const GAME_TWO_TUTORIAL_FILEPATH = "Tutorials/GameTwoPlaceholder.mp4";
const GAME_TWO_TUTORIAL_LENGTH = 5000;
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

  let tutorialScreen = getTutorial();
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
          length={16500}
          nextRoute={GAME_TWO_ROUTE}
        />
        {display}
      </div>);
}

function getSummary(props) {
    return(
        <Summary
          winners={props.winners}
          selectedIndex={props.selectedIndex}
          losers={props.losers}
          allLoginCodes={props.allLoginCodes}
          selectedIndex={props.selectedIndex}
        />
    );
}

function getTutorial() {
    return(
        <TutorialScreen
            URL={GAME_TWO_TUTORIAL_FILEPATH}
            showButton={HIDE_BUTTON}
            initialPause={500}
            videoLength={GAME_TWO_TUTORIAL_LENGTH}
            text={GAME_TWO_TUTORIAL_TEXT}
        />
    );
}

export default (GameTwoIntro);
