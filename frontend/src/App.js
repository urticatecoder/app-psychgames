import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Lobby from './lobby/Lobby';
import Login from './login/Login';
import Summary from './game_one/summary/Summary';
import GameOne from './game_one/gameplay/GameOne';
import GameTwo from './game_two/gameplay/GameTwo';
import ProlificScreen from './prolific/ProlificScreen'
import AdminAuth from "./admin_page/AdminAuth";
import PrivateRoute from "./admin_page/PrivateRoute";
import MainAvatar from './lobby/MainAvatar';
import TutorialScreen from './tutorials/TutorialScreen';

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
        <Route path='/game-two-tutorial' render={() => <TutorialScreen URL='Tutorials/GameTwo.mov' nextRoute='/game-two' initialPause={1000} videoLength={45000} text='Game Two Tutorial'/>}/>

        <Switch>
          <Route exact path='/adminLogin' render={() => <AdminAuth/>} component={AdminAuth}/>
          <PrivateRoute exact path='/admin'/>
        </Switch>

        <Route path='/game-two' render={() => (<GameTwo loginCode = {loginCode} winners={winners} losers={losers} allLoginCodes={allLoginCodes}/>)}/>

        <Route path='/summary' render={() => (<Summary winners={winners} losers={losers} allLoginCodes={allLoginCodes}/>)}/>
        <Route path='/prolific' render={() => (<ProlificScreen code={loginCode}/>)}/>
        <Route 
          path="/game-one" 
          render={() => (<GameOne setWinners={setWinners} setLosers={setLosers} loginCode = {loginCode} allLoginCodes={allLoginCodes}/>)}
        />
      </Router>

    </div>
  );
}

export default App;
