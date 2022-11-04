import React, { useState, useEffect } from 'react';
import "./App.css";
import { Router, Route, withRouter } from "react-router-dom";
import socket from "./socketClient";
import { withCookies } from "react-cookie";

import RefreshChecker from "./util/components/RefreshChecker";
import WindowChecker from './util/components/WindowChecker';
import BrowserChecker from './util/components/BrowserChecker';
import RulesDialog from "./util/components/RulesDialog";
import PassiveDialog from './passivity/PassiveDialogue';

import Login from "./login/Login";
import Lobby from "./lobby/Lobby";
import AvatarSelector from "../src/avatar_selection/AvatarSelector";
import GameOne from "./game_one/GameOne";
import GameOneIntro from "./game_one/intro/GameOneIntro";
import GameOneRefactor from './game_one/GameOneRefactor';
import GameTwoIntro from "./game_two/intro/GameTwoIntro";
import GameTwo from "./game_two/GameTwo";
import GameTwoRefactor from "./game_two/GameTwoRefactor";

import Routes from './util/constants/routes';
import { getThemeProps } from '@material-ui/styles';

const INITIAL_CODE = null;
const INITIAL_ID = null;
const INITIAL_GAME_STATE = null;
const INITIAL_AVATAR = 1;

const INITIAL_WINDOW_WIDTH = window.innerWidth;
const INITIAL_WINDOW_HEIGHT = window.innerHeight;

/**
 * Root element that communicates with the backend for game state info and routes to each page with info passed via props.
 *
 * @author Eric Doppelt
 */
function App(props) {
  const [loginCode, setLoginCode] = useState(INITIAL_CODE);
  const [windowWidth, setWindowWidth] = useState(INITIAL_WINDOW_WIDTH);
  const [windowHeight, setWindowHeight] = useState(INITIAL_WINDOW_HEIGHT);

  // new state vars from refactored server
  const [id, setId] = useState(INITIAL_ID);
  const [currentState, setCurrentState] = useState(INITIAL_GAME_STATE);
  const [avatar, setAvatar] = useState(INITIAL_AVATAR);
  const [page, setPage] = useState(null);
  const [playerData, setPlayerData] = useState([]);

  useEffect(() => {
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 3001);
    });

    socket.on("connect", () => {
      if (props.cookies.get("id")) {
        console.log("already had id: ", props.cookies.get("id"));
        setId(props.cookies.get("id"));
        const enterGameRequest = {id: props.cookies.get("id")};
        socket.emit("enter-game", enterGameRequest, (response) => {
          console.log("enter game response: ", response);
        });
      } else {
        socket.emit("enter-game", null, (response) => {
          console.log("enter game response: ", response);
        });
      }
    });

    socket.on("state-update", (state) => {
      console.log("received state update: ", state);
      if (state.type == "lobby") {
        setCurrentState(state);
        setPlayerData(state.playerData);
        setPage(state.type);
      } else if (state.type == "game-one_state") {
        setCurrentState(state);
        setPage(state.type);
        setPlayerData(state.playerData);
      } else if (state.type == "game-two_state") {
        setCurrentState(state);
        setPage(state.type);
        setPlayerData(state.playerData);
      }
    });

    socket.on("disconnect",() => {
      console.log("disconnected"); 
    });
  }, []);

  useEffect(() => {
    if (!currentState) {
      return;
    }
    if (page == "lobby") {
      props.history.push(Routes.LOBBY);
    } else if (page == "game-one_state") {
      props.history.push(Routes.GAME_ONE);
    } else if (page == "game-two_state") {
      props.history.push(Routes.GAME_TWO);
    }
  }, [page]);

  useEffect(() => {
    const lobbyAvatarRequest = {
      type: "lobby_avatar",
      avatar: avatar
    };
    socket.emit("game-action", lobbyAvatarRequest);
  }, [avatar]);

  useEffect(() => {
    console.log("id updated: ", id);
    if (id) {
      // props.cookies.set("id", id, { path: "/" });
    }
  }, [id]);

  return (
    <div className="app">
      <Router history={props.history}>
        <WindowChecker setWindowWidth={setWindowWidth} setWindowHeight={setWindowHeight}/>
        <BrowserChecker/>

        {/* Add components which show the rules when selected or to prompt the user to ensure they are still playing.*/}
        <RulesDialog/>
        <PassiveDialog loginCode={loginCode}/>

        {/* Add routes for the pages in the web app below.*/}

        {/* LOGIN PAGE */}
        <Route
          exact
          path={Routes.LOGIN}
          render={() => (
            <Login
              code={loginCode}
              setLoginCode={setLoginCode}
              currentState={currentState}
              setCurrentState={setCurrentState}
              id={id}
              setId={setId}
            />
          )}
        />

        {/* LOBBY PAGE */}
          <Route
            path={Routes.LOBBY}
            render={() => (
              <Lobby
                avatar={avatar}
                setAvatar={setAvatar}
                code={loginCode}
                setLoginCode={setLoginCode}
                currentState={currentState}
                setCurrentState={setCurrentState}
                playerData={playerData}
              />
            )}
          />

        {/* AVATAR SELECTION PAGE */}
          <Route
            path={Routes.AVATAR_SELECTION}
            exact
            render={() => (
              <AvatarSelector
                avatar={avatar}
                setAvatar={setAvatar}
                playerData={playerData}
                setPlayerData={setPlayerData}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
              />
            )}
          />

        {/* GAME ONE INTRO PAGE */}
          <Route
            path={Routes.GAME_ONE_INTRO}
            render={() => (
              <GameOneIntro
                avatar={avatar}
                setAvatar={setAvatar}
              />
            )}
          />

        {/* GAME ONE PAGE */}
          <Route
            path={Routes.GAME_ONE}
            render={() => (
              <GameOneRefactor
                currentState={currentState}
                setCurrentState={setCurrentState}
                id={id}
                playerData={playerData}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
              />
            )}
          />

        {/* GAME TWO INTRO PAGE */}
          <Route
            path={Routes.GAME_TWO_INTRO}
            render={() => 
              <GameTwoIntro
                winners={winners}
                selectedIndex={selectedIndex}
                losers={losers}
                allLoginCodes={allLoginCodes}
                frontendIndex={frontendIndex}
              />
            }
          />   

          {/* GAME TWO PAGE */}
          <Route
            path={Routes.GAME_TWO}
            render={() => (
              <GameTwoRefactor
                currentState={currentState}
                id={id}
                avatar={avatar}
                playerData={playerData}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
              />
            )}
          />
      </Router>
    </div>
  )
}
export default withCookies(withRouter(App));