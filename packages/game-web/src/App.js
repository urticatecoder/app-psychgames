import React, { useState, useEffect } from 'react';
import "./App.css";
import { Router, Route, withRouter, useHistory } from "react-router-dom";
import socket from "./socketClient";
import { withCookies, useCookies } from "react-cookie";

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
const DEFAULT_EXPERIMENT_ID = -1;
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
  const [experimentID, setExperimentID] = useState(DEFAULT_EXPERIMENT_ID);
  const [windowWidth, setWindowWidth] = useState(INITIAL_WINDOW_WIDTH);
  const [windowHeight, setWindowHeight] = useState(INITIAL_WINDOW_HEIGHT);

  const [id, setId] = useState(INITIAL_ID);
  const [currentState, setCurrentState] = useState(INITIAL_GAME_STATE);
  const [avatar, setAvatar] = useState(INITIAL_AVATAR);

  useEffect(() => {
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 3001);
    });

    socket.on("connect", () => {
      console.log("connected: ", socket.id);
      if (props.cookies.get("id")) {
        console.log("already has id: ", props.cookies.get("id"));
        setId(props.cookies.get("id"));
        const enterGameRequest = {id: props.cookies.get("id")};
        socket.emit("enter-game", enterGameRequest);
      }
    });

    socket.on("state-update", (gameState) => {
      console.log("received state update: ", gameState.state);
      // store state in frontend
      setCurrentState(gameState.state);
    });

    socket.on("enter-game_response", (enterGameResponse) => {
      console.log("received enter game response: ", enterGameResponse.inGame);
    });

    socket.on("start-game_response", (startGameResponse) => {
      console.log("received start game response: ", startGameResponse.id);
      // store id in frontend state
      setId(startGameResponse.id);
      if (!props.cookies.get("id")) {
        console.log("set new id");
        props.cookies.set("id", startGameResponse.id, { path: "/" });
      } else {
        console.log("old id: ", props.cookies.get("id"));
      }
    });

    socket.on("disconnect",() => {
      console.log("server disconnected");
      
    });
  }, []);

  // listener for when the current game state is updated
  useEffect(() => {
    if (!currentState) {
      return;
    }
    console.log("current state updated ", currentState);
    if (currentState.type == "lobby") {
      console.log("go to lobby");
      props.history.push(Routes.LOBBY);
    } else if (currentState.type == "game-one_state") {
      props.history.push(Routes.GAME_ONE);
    } else if (currentState.type == "game-two_state") {
      props.history.push(Routes.GAME_TWO);
    }
  }, [currentState]);

  useEffect(() => {
    console.log("avatar: ", avatar);
    // send avatar selection request to server
    const lobbyAvatarRequest = {
      type: "lobby_avatar",
      avatar: avatar
    };
    socket.emit("game-action", lobbyAvatarRequest);
  }, [avatar]);

  return (
    <div className="app">
      <Router history={props.history}>
        <WindowChecker setWindowWidth={setWindowWidth} setWindowHeight={setWindowHeight}/>
        <BrowserChecker/>

        {/* Add components which show the rules when selected or to prompt the user to ensure they are still playing.*/}
        <RulesDialog/>
        <PassiveDialog loginCode={loginCode} experimentID={experimentID}/>

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
            />
          )}
        />

        {/* LOBBY PAGE */}
          <Route
            path={Routes.LOBBY}
            render={() => (
              <Lobby
                code={loginCode}
                setLoginCode={setLoginCode}
                experimentID={experimentID}
                setExperimentID={setExperimentID}
                currentState={currentState}
                setCurrentState={setCurrentState}
                avatar={avatar}
                setAvatar={setAvatar}
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
                loginCode={loginCode}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                experimentID={experimentID}
                currentState={currentState}
                setCurrentState={setCurrentState}
                id={id}
                avatar={avatar}
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
                // loginCode={loginCode}
                // winners={winners}
                // losers={losers}
                // allLoginCodes={allLoginCodes}
                // selectedIndex={selectedIndex}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                // experimentID={experimentID}
                // frontendIndex={frontendIndex}
                currentState={currentState}
                id={id}
                avatar={avatar}
              />
            )}
          />
      </Router>
    </div>
  )
}
export default withCookies(withRouter(App));

// import React, { useState } from "react";
// import { BrowserRouter as Router, Route} from "react-router-dom";
// import "./App.css";

// import RefreshChecker from "./util/components/RefreshChecker";
// import WindowChecker from './util/components/WindowChecker';
// import BrowserChecker from './util/components/BrowserChecker';
// import RulesDialog from "./util/components/RulesDialog";
// import PassiveDialog from './passivity/PassiveDialogue';

// import Lobby from "./lobby/Lobby";
// import Login from "./login/Login";
// import GameOne from "./game_one/GameOne";
// import GameTwo from "./game_two/GameTwo";
// import AdminAuth from "./admin_page/AdminAuth";
// import PrivateAdminRoute from "./admin_page/PrivateAdminRoute";
// import AvatarSelector from "../src/avatar_selection/AvatarSelector";
// import Compensation from "./prolific/Compensation";
// import GameOneIntro from "./game_one/intro/GameOneIntro";
// import GameTwoIntro from "./game_two/intro/GameTwoIntro";

// import Routes from './util/constants/routes';

// const INITIAL_CODE = null;
// const INITIAL_CODES = [null, null, null, null, null, null];
// const NO_WINNERS = [];
// const NO_LOSERS = [];

// const DEFAULT_SELECTION_INDEX = -1;
// const LOGGED_OUT = false;
// const INITIAL_WINDOW_WIDTH = window.innerWidth;
// const INITIAL_WINDOW_HEIGHT = window.innerHeight;
// const INITIAL_FRONTEND_INDEX = -1;
// const INITIAL_BACKEND_INDEX = -1;
// const DEFAULT_EXPERIMENT_ID = -1;

// /**
//  * Root element that communicates with the backend for game state info and routes to each page with info passed via props.
//  *
//  * @author Eric Doppelt
//  */
// function App() {
//   const [loginCode, setLoginCode] = useState(INITIAL_CODE);
//   const [allLoginCodes, setAllLoginCodes] = useState(INITIAL_CODES);
//   const [frontendIndex, setFrontendIndex] = useState(INITIAL_FRONTEND_INDEX);
//   const [backendIndex, setBackendIndex] = useState(INITIAL_BACKEND_INDEX);
//   const [winners, setWinners] = useState(NO_WINNERS);
//   const [losers, setLosers] = useState(NO_LOSERS);
//   const [selectedIndex, setSelectedIndex] = useState(DEFAULT_SELECTION_INDEX);
//   const [loggedIn, setLoggedIn] = useState(LOGGED_OUT);
//   const [windowWidth, setWindowWidth] = useState(INITIAL_WINDOW_WIDTH);
//   const [windowHeight, setWindowHeight] = useState(INITIAL_WINDOW_HEIGHT);
//   const [experimentID, setExperimentID] = useState(DEFAULT_EXPERIMENT_ID)

//   return (
//     <div className='app'>

//         <Router>
  
//           {/* Add components which check that the user does not refresh the page; shrink the window too small; or use an incorrect browswer. */}
//           {/* <RefreshChecker loginCode={loginCode}/> */}
//           <WindowChecker setWindowWidth={setWindowWidth} setWindowHeight={setWindowHeight}/>
//           <BrowserChecker/>

//           {/* Add components which show the rules when selected or to prompt the user to ensure they are still playing.*/}
//           <RulesDialog/>
//           <PassiveDialog loginCode={loginCode} experimentID={experimentID}/>

//           {/* Add routes for the pages in the web app below.*/}

//           {/* LOGIN PAGE */}
//           <Route
//             exact
//             path={Routes.LOGIN}
//             render={() => <Login code={loginCode} setLoginCode={setLoginCode}/>}
//           />

//           {/* LOBBY PAGE */}
//           <Route
//             path={Routes.LOBBY}
//             render={() => (
//               <Lobby
//                 code={loginCode}
//                 setLoginCode={setLoginCode}
//                 setAllLoginCodes={setAllLoginCodes}
//                 loggedIn = {loggedIn}
//                 setLoggedIn = {setLoggedIn}
//                 setBackendIndex = {setBackendIndex}
//                 setFrontendIndex = {setFrontendIndex}
//                 setExperimentID = {setExperimentID}
//                 experimentID = {experimentID}
//               />
//             )}
//           />

//           {/* AVATAR SELECTION PAGE */}
//           <Route
//             path={Routes.AVATAR_SELECTION}
//             exact
//             render={() => <AvatarSelector selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} windowWidth={windowWidth} windowHeight={windowHeight}/>}
//           />

//           {/* GAME ONE INTRO PAGE */}
//           <Route
//             path={Routes.GAME_ONE_INTRO}
//             render={() => 
//               <GameOneIntro
//                 selectedIndex={selectedIndex} 
//                 setSelectedIndex={setSelectedIndex}
//               />
//             }
//           />

//           {/* GAME ONE PAGE */}
//           <Route
//             path={Routes.GAME_ONE}
//             render={() => (
//               <GameOne
//                 setWinners={setWinners}
//                 setLosers={setLosers}
//                 loginCode={loginCode}
//                 allLoginCodes={allLoginCodes}
//                 selectedIndex={selectedIndex}
//                 windowWidth={windowWidth}
//                 windowHeight={windowHeight}
//                 backendIndex={backendIndex}
//                 experimentID={experimentID}
//                 frontendIndex={frontendIndex}
//               />
//             )}
//           />
          
//           {/* GAME TWO INTRO PAGE */}
//           <Route
//             path={Routes.GAME_TWO_INTRO}
//             render={() => 
//               <GameTwoIntro
//                 winners={winners}
//                 selectedIndex={selectedIndex}
//                 losers={losers}
//                 allLoginCodes={allLoginCodes}
//                 frontendIndex={frontendIndex}
//               />
//             }
//           />   

//           {/* GAME TWO PAGE */}
//           <Route
//             path={Routes.GAME_TWO}
//             render={() => (
//               <GameTwo
//                 loginCode={loginCode}
//                 winners={winners}
//                 losers={losers}
//                 allLoginCodes={allLoginCodes}
//                 selectedIndex={selectedIndex}
//                 windowWidth={windowWidth}
//                 windowHeight={windowHeight}
//                 experimentID={experimentID}
//                 frontendIndex={frontendIndex}
//               />
//             )}
//           />

//           {/* COMPENSATION PAGE */}
//           <Route
//             path={Routes.COMPENSATION}
//             render={() => <Compensation experimentID={experimentID} code={loginCode} windowHeight={windowHeight} windowWidth={windowWidth} />}
//           />

//           {/* ADMIN LOGIN PAGE */}
//           <Route
//               exact
//               path={Routes.ADMIN_LOGIN}
//               render={() => <AdminAuth />}
//               component={AdminAuth}
//           />

//           {/* ADMIN PAGE -- USES PRIVATE ROUTE TO REDIRECT IF NOT ADMIN LOGIN.*/}
//           {/* <PrivateAdminRoute exact path={Routes.ADMIN_PRIVATE} /> */}
//         </Router>
//     </div>
//   );
// }

// export default App;
