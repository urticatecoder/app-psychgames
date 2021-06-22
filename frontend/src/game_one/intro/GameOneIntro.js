import React, { useState, useEffect } from "react";
import MainAvatar from '../../lobby/MainAvatar';
import TutorialScreen from '../../tutorials/TutorialScreen';
import IntroTimer from "../../util/common_components/IntroTimer";

const SHOW_TUTORIAL = true;

const HIDE_TUTORIAL = false;
const SHOW_BUTTON = true;

const TIMER_MESSAGE = "Game One";
const NO_PAUSE = 0;
const GAME_ONE_TUTORIAL_FILEPATH = "Tutorials/GameOnePlaceholder.mp4";
const GAME_ONE_TUTORIAL_LENGTH = 5000;
const GAME_ONE_TUTORIAL_TEXT = "Game 1 Tutorial";
const DEFAULT_ANIMATION_PAUSE = 1000;
const BUTTON_MESSAGE = "See My Avatar";
const FULL_DIV = "fullDiv";
// const INTRO_LENGTH = 65999;
const INTRO_LENGTH = 11000;
const GAME_ONE_ROUTE = '/game-one';
/**
 * Component used to visualize the lobby where users wait to enter the game.
 * @param {*} props is used to tell the component the login code, which is provided to the StartTimer.
 *
 * @author Eric Doppelt
 */
function GameOneIntro(props) {

  const [showTutorial, setShowTutorial] = useState(SHOW_TUTORIAL);

  let tutorialScreen = getTutorial(setShowTutorial);
  let avatarScreen = getMainAvatar(props);
  var display = showTutorial ? tutorialScreen : avatarScreen;

// reset this to DEFAULT_ANIMATION + GAME_ONE_TUTORIAL_LENGTH + DEFAULT_ANIMATION
// GAME_ONE_TUTORIAL IS 45000
  useEffect(() => {
    setTimeout(() => {
      setShowTutorial(HIDE_TUTORIAL);
    }, 500 + GAME_ONE_TUTORIAL_LENGTH); // reset this to DEFAULT_ANIMATION + GAME_ONE_TUTORIAL_LENGTH + DEFAULT_ANIMATION
  });

  return (
      <div className={FULL_DIV}>
        <IntroTimer
          message={TIMER_MESSAGE}
          length={INTRO_LENGTH}
          nextRoute={GAME_ONE_ROUTE}
        />
        {display}
      </div>);
}

function getMainAvatar(props) {
    return(
        <MainAvatar 
            selectedIndex={props.selectedIndex} 
            setSelectedIndex={props.setSelectedIndex}
        />
    );
}

function getTutorial(setShowTutorial) {
    return(
        <TutorialScreen
            URL={GAME_ONE_TUTORIAL_FILEPATH}
            showButton={SHOW_BUTTON}
            hideTutorial={() => setShowTutorial(HIDE_TUTORIAL)}
            initialPause={NO_PAUSE}
            videoLength={GAME_ONE_TUTORIAL_LENGTH}
            text={GAME_ONE_TUTORIAL_TEXT}
            buttonMessage={BUTTON_MESSAGE}
        />
    );
}

export default (GameOneIntro);
