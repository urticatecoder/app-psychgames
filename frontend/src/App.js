import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Lobby from './Lobby/Lobby';
import Login from './Login/Login';
import InstructionsScreen from './GameOne/Instructions/InstructionsScreen';
import Summary from './GameOne/Summary/Summary';
import GameOne from './GameOne/Gameplay/GameOne';
import GameTwo from './GameTwo/Gameplay/GameTwo';
import Admin from './AdminPage/Admin';
import ProlificScreen from './Prolific/ProlificScreen'
import AdminAuth from "./AdminPage/AdminAuth";
import PrivateRoute from "./AdminPage/PrivateRoute";
import MainAvatar from './Lobby/MainAvatar';
import TutorialScreen from './Tutorials/TutorialScreen';

const CLASS_NAME = 'App';
const HOME_PATH = '/';
const LOBBY_PATH = '/lobby';
const WELCOME_PATH = '/one-welcome';
const INTRODUCTION_PATH = '/one-introduction';
const LOGIC_PATH = '/one-logic';
const END_RULES_PATH = '/one-end-rules';
const MOVING_PATH = '/one-moving';
const BONUSES_PATH = '/one-bonuses';
const PLAY_RULES_PATH = '/one-play-rules';

const NO_CODE = '';
const NO_CODES = ['', '', '', '', '', '']

const TEST_CODE = 123
const TEST_CODES = [123, 456, 789, 12, 34, 56]

const NO_WINNERS = []
const NO_LOSERS = []

function App() {

  const [loginCode, setLoginCode] = useState(TEST_CODE)
  const [allLoginCodes, setAllLoginCodes] = useState(TEST_CODES)
  const [winners, setWinners] = useState(NO_WINNERS)
  const [losers, setLosers] = useState(NO_LOSERS)

  return (
    <div className="App">
      <Router>
        <Route path="/" exact render={() => <Login code={loginCode} setLoginCode={setLoginCode}/>}/>

        <Route path='/lobby' render={() => <Lobby code={loginCode} setLoginCode={setLoginCode} setAllLoginCodes={setAllLoginCodes}/>}/>
        <Route path='/player-assignment' render={() => <MainAvatar/>}/>
        <Route path='/game-one-tutorial' render={() => <TutorialScreen URL='Tutorials/GameOne.mov' nextRoute='/player-assignment' initialPause={1000} videoLength={53000} text='Game One Tutorial'/>}/>

        <Switch>
          <Route exact path='/adminLogin' render={() => <AdminAuth/>} component={AdminAuth}/>
          <PrivateRoute exact path='/admin'/>
        </Switch>

        <Route path='/game-two' render={() => (<GameTwo loginCode = {loginCode} winners={winners} losers={losers} allLoginCodes={allLoginCodes}/>)}/>

        <Route path='/summary' render={() => (<Summary winners={winners} losers={losers} allLoginCodes={allLoginCodes}/>)}/>
        <Route path='/prolific' render={() => (<ProlificScreen/>)}/>
        <Route 
          path="/game-one" 
          render={() => (<GameOne setWinners={setWinners} setLosers={setLosers} loginCode = {loginCode} allLoginCodes={allLoginCodes}/>)}
        />

        <Route
            path="/one-welcome"
            render={() => (<InstructionsScreen file='Instructions/Welcome.txt' title='Game One' /* route='one-introduction'/> */ route='game-one'/>)}
        />

        <Route
          path="/one-introduction"
          render={() => (<InstructionsScreen file='Instructions/Introduction.txt' title='General Introduction' route='one-logic'/>)}
        />
        <Route
          path="/one-logic"
          render={() => (<InstructionsScreen file='Instructions/Logic.txt' title='What Happens in the Game?' route='one-end-rules'/>)}
        />

        <Route
          path="/one-end-rules"
          render={() => (<InstructionsScreen file='Instructions/EndRules.txt' title='When does the Game End?' route='one-moving'/>)}
        />

        <Route
          path="/one-moving"
          render={() => (<InstructionsScreen file='Instructions/Moving.txt' title='Moving' route='one-bonuses'/>)}
        />

        <Route
          path="/one-bonuses"
          render={() => (<InstructionsScreen file='Instructions/Bonuses.txt' title='Cooperation Bonuses' route='one-play-rules'/>)}
        />

        <Route
          path="/one-play-rules"
          render={() => (<InstructionsScreen file='Instructions/PlayRules.txt' title='How do I play?' route='game-one'/>)}
        />

      </Router>

    </div>
  );
}

export default App;
