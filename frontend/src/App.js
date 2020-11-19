import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Lobby from "./lobby/Lobby";
import Login from "./login/Login";
import Summary from "./game_one/summary/Summary";
import GameOne from "./game_one/GameOne";
import GameTwo from "./game_two/GameTwo";
import ProlificScreen from "./prolific/ProlificScreen";
import AdminAuth from "./admin_page/AdminAuth";
import PrivateRoute from "./admin_page/PrivateRoute";
import MainAvatar from "./lobby/MainAvatar";
import TutorialScreen from "./tutorials/TutorialScreen";

const TEST_CODE = 123;
const TEST_CODES = [123, 456, 789, 12, 34, 56];

const NO_WINNERS = [];
const NO_LOSERS = [];

const DEFAULT_ANIMATION_PAUSE = 1000;

const CLASS_NAME = "App";

const LOGIN_ROUTE = "/";
const LOBBY_ROUTE = "/lobby";
const PLAYER_ASSIGNMENT_ROUTE = "/player-assignment";

const GAME_ONE_TUTORIAL_ROUTE = "/game-one-tutorial";
const GAME_ONE_TUTORIAL_FILEPATH = "Tutorials/GameOne.mov";
const GAME_ONE_TUTORIAL_LENGTH = 53000;
const GAME_ONE_TUTORIAL_TEXT = "Game One Tutorial";

const GAME_TWO_TUTORIAL_ROUTE = "/game-two-tutorial";
const GAME_TWO_TUTORIAL_FILEPATH = "Tutorials/GameTwo.mov";
const GAME_TWO_TUTORIAL_LENGTH = 45000;
const GAME_TWO_TUTORIAL_TEXT = "Game Two Tutorial";

const GAME_ONE_ROUTE = "/game-one";
const GAME_TWO_ROUTE = "/game-two";

const ADMIN_LOGIN_ROUTE = "/adminLogin";
const ADMIN_PRIVATE_ROUTE = "/admin";

const SUMMARY_ROUTE = "/summary";
const PROLIFIC_ROUTE = "/prolific";

function App() {
  const [loginCode, setLoginCode] = useState(TEST_CODE);
  const [allLoginCodes, setAllLoginCodes] = useState(TEST_CODES);
  const [winners, setWinners] = useState(NO_WINNERS);
  const [losers, setLosers] = useState(NO_LOSERS);

  return (
    <div className={CLASS_NAME}>
      <Router>
        <Route
          path={LOGIN_ROUTE}
          exact
          render={() => <Login code={loginCode} setLoginCode={setLoginCode} />}
        />

        <Route
          path={LOBBY_ROUTE}
          render={() => (
            <Lobby
              code={loginCode}
              setLoginCode={setLoginCode}
              setAllLoginCodes={setAllLoginCodes}
            />
          )}
        />

        <Route path={PLAYER_ASSIGNMENT_ROUTE} render={() => <MainAvatar />} />
        <Route
          path={GAME_ONE_TUTORIAL_ROUTE}
          render={() => (
            <TutorialScreen
              URL={GAME_ONE_TUTORIAL_FILEPATH}
              nextRoute={PLAYER_ASSIGNMENT_ROUTE}
              initialPause={DEFAULT_ANIMATION_PAUSE}
              videoLength={GAME_ONE_TUTORIAL_LENGTH}
              text={GAME_ONE_TUTORIAL_TEXT}
            />
          )}
        />

        <Route
          path={GAME_TWO_TUTORIAL_ROUTE}
          render={() => (
            <TutorialScreen
              URL={GAME_TWO_TUTORIAL_FILEPATH}
              nextRoute={GAME_TWO_ROUTE}
              initialPause={DEFAULT_ANIMATION_PAUSE}
              videoLength={GAME_TWO_TUTORIAL_LENGTH}
              text={GAME_TWO_TUTORIAL_TEXT}
            />
          )}
        />

        <Switch>
          <Route
            exact
            path={ADMIN_LOGIN_ROUTE}
            render={() => <AdminAuth />}
            component={AdminAuth}
          />
          <PrivateRoute exact path={ADMIN_PRIVATE_ROUTE} />
        </Switch>

        <Route
          path={GAME_TWO_ROUTE}
          render={() => (
            <GameTwo
              loginCode={loginCode}
              winners={winners}
              losers={losers}
              allLoginCodes={allLoginCodes}
            />
          )}
        />

        <Route
          path={SUMMARY_ROUTE}
          render={() => (
            <Summary
              winners={winners}
              losers={losers}
              allLoginCodes={allLoginCodes}
            />
          )}
        />

        <Route
          path={PROLIFIC_ROUTE}
          render={() => <ProlificScreen code={loginCode} />}
        />

        <Route
          path={GAME_ONE_ROUTE}
          render={() => (
            <GameOne
              setWinners={setWinners}
              setLosers={setLosers}
              loginCode={loginCode}
              allLoginCodes={allLoginCodes}
            />
          )}
        />
      </Router>
    </div>
  );
}

export default App;
