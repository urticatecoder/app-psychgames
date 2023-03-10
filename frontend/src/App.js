import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from "react-router-dom";
import Lobby from "./lobby/Lobby";
import Login from "./login/Login";
import RefreshChecker from "./util/common_components/RefreshChecker";
import GameOne from "./game_one/GameOne";
import GameTwo from "./game_two/GameTwo";
import AdminAuth from "./admin_page/AdminAuth";
import PrivateRoute from "./admin_page/PrivateRoute";
import AvatarSelector from "../src/avatar_selection/AvatarSelector";
import PassiveAlert from './passivity/PassiveDialogue';
import Compensation from "./prolific/Compensation";
import GameOneIntro from "./game_one/intro/GameOneIntro";
import GameTwoIntro from "./game_two/intro/GameTwoIntro";
import WindowChecker from './util/common_components/WindowChecker';
import BrowserChecker from './util/common_components/BrowserChecker';
import Rules from "./util/common_components/Rules";

const INITIAL_CODE = null;
const INITIAL_CODES = [null, null, null, null, null, null];

const NO_WINNERS = [];
const NO_LOSERS = [];

const CLASS_NAME = "App";

const HIDE = false;

const LOGIN_ROUTE = "/";
const LOBBY_ROUTE = "/lobby";
const AVATAR_SELECTION_ROUTE = "/avatar-selection";

const GAME_ONE_ROUTE = "/game-one";
const GAME_ONE_INTRO_ROUTE = "/game-one-intro";
const GAME_TWO_ROUTE = "/game-two";
const GAME_TWO_INTRO_ROUTE = "/game-two-intro";

const ADMIN_LOGIN_ROUTE = "/adminLogin";
const ADMIN_PRIVATE_ROUTE = "/admin";
const COMPENSATION_ROUTE = '/compensation';

const DEFAULT_SELECTION_INDEX = -1;
const LOGGED_OUT = false;

const INITIAL_WINDOW_WIDTH = window.innerWidth;
const INITIAL_WINDOW_HEIGHT = window.innerHeight;

const INITIAL_INDEX = -1;
const DEFAULT_EXPERIMENT_ID = -1;

function App() {
  const [loginCode, setLoginCode] = useState(INITIAL_CODE);
  const [allLoginCodes, setAllLoginCodes] = useState(INITIAL_CODES);
  const [frontendIndex, setFrontendIndex] = useState(INITIAL_INDEX);
  const [backendIndex, setBackendIndex] = useState(INITIAL_INDEX);
  const [winners, setWinners] = useState(NO_WINNERS);
  const [losers, setLosers] = useState(NO_LOSERS);
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_SELECTION_INDEX);
  const [loggedIn, setLoggedIn] = useState(LOGGED_OUT);
  const [showRules, setShowRules] = useState(HIDE);
  const [windowWidth, setWindowWidth] = useState(INITIAL_WINDOW_WIDTH);
  const [windowHeight, setWindowHeight] = useState(INITIAL_WINDOW_HEIGHT);
  const [experimentID, setExperimentID] = useState(DEFAULT_EXPERIMENT_ID)

  return (
    <div className={CLASS_NAME}>
        
        <Router>
          <PassiveAlert loginCode={loginCode} experimentID={experimentID}/>
          {/* <RefreshChecker loginCode={loginCode}/> */}
          <WindowChecker setWindowWidth={setWindowWidth} setWindowHeight={setWindowHeight}/>
          <BrowserChecker/>
          <Rules showRules={showRules} setShowRules={setShowRules}/>

          <Route
            path={LOGIN_ROUTE}
            exact
            render={() => <Login code={loginCode} setLoginCode={setLoginCode} setShowWarnings={setShowRules}/>}
          />

          <Route
            path={LOBBY_ROUTE}
            render={() => (
              <Lobby
                code={loginCode}
                setLoginCode={setLoginCode}
                setAllLoginCodes={setAllLoginCodes}
                loggedIn = {loggedIn}
                setLoggedIn = {setLoggedIn}
                setBackendIndex = {setBackendIndex}
                setFrontendIndex = {setFrontendIndex}
                setExperimentID = {setExperimentID}
                experimentID = {experimentID}
              />
            )}
          />

          <Route
            path={AVATAR_SELECTION_ROUTE}
            exact
            render={() => <AvatarSelector selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} windowWidth={windowWidth} windowHeight={windowHeight}/>}
          />

          <Route
            path={GAME_ONE_INTRO_ROUTE}
            render={() => 
              <GameOneIntro
                selectedIndex={selectedIndex} 
                setSelectedIndex={setSelectedIndex}
              />
            }
          />
          
          <Route
            path={GAME_TWO_INTRO_ROUTE}
            render={() => 
              <GameTwoIntro
                winners={winners}
                selectedIndex={selectedIndex}
                losers={losers}
                allLoginCodes={allLoginCodes}
                selectedIndex={selectedIndex}
                frontendIndex={frontendIndex}
              />
            }
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
                selectedIndex={selectedIndex}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                experimentID={experimentID}
                frontendIndex={frontendIndex}
              />
            )}
          />

          <Route
            path={COMPENSATION_ROUTE}
            render={() => <Compensation experimentID={experimentID} code={loginCode} windowHeight={windowHeight} windowWidth={windowWidth} />}
          />

          <Route
            path={GAME_ONE_ROUTE}
            render={() => (
              <GameOne
                setWinners={setWinners}
                setLosers={setLosers}
                loginCode={loginCode}
                allLoginCodes={allLoginCodes}
                selectedIndex={selectedIndex}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                backendIndex={backendIndex}
                experimentID={experimentID}
                frontendIndex={frontendIndex}
              />
            )}
          />
        </Router>
    </div>
  );
}

export default (App);
