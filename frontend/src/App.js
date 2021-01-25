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
import TutorialScreen from "./tutorials/TutorialScreen";
import AvatarSelector from "../src/avatar_selection/AvatarSelector";
import PassiveAlert from './passivity/PassiveDialogue';
import Compensation from "./prolific/Compensation";
import GameOneIntro from "./game_one/intro/GameOneIntro";
import GameTwoIntro from "./game_two/intro/GameTwoIntro";
import WindowChecker from './util/common_components/WindowChecker';
import Warnings from "./util/common_components/Warnings";
import { Button, withStyles } from "@material-ui/core";

const INITIAL_CODE = null;

const TEST_CODE = INITIAL_CODE;
const TEST_CODES = [TEST_CODE, 456, 789, 12, 34, 56];

const NO_WINNERS = [];
const NO_LOSERS = [];

const DEFAULT_ANIMATION_PAUSE = 1000;

const CLASS_NAME = "App";

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

function App() {
  const [loginCode, setLoginCode] = useState(TEST_CODE);
  const [allLoginCodes, setAllLoginCodes] = useState(TEST_CODES);
  const [winners, setWinners] = useState(NO_WINNERS);
  const [losers, setLosers] = useState(NO_LOSERS);
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_SELECTION_INDEX);
  const [loggedIn, setLoggedIn] = useState(LOGGED_OUT);

 
  
  return (
    <div className={CLASS_NAME}>
        
        <Router>
          <PassiveAlert loginCode={loginCode}/>
          <RefreshChecker loginCode={loginCode}/>
          <WindowChecker/>
          <Warnings/>
          <Route
            path={LOGIN_ROUTE}
            exact
            render={() => <Login code={loginCode} setLoginCode={setLoginCode}/>}
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
              />
            )}
          />

          <Route
            path={AVATAR_SELECTION_ROUTE}
            exact
            render={() => <AvatarSelector selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}/>}
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
              />
            )}
          />

          <Route
            path={COMPENSATION_ROUTE}
            render={() => <Compensation code={loginCode} />}
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
              />
            )}
          />
        </Router>
    </div>
  );
}

export default (App);
