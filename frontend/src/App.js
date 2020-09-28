import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Welcome from './GameOne/Instructions/Welcome'
import Introduction from './GameOne/Instructions/Introduction';
import Logic from './GameOne/Instructions/Logic.js';
import Lobby from './Lobby/Lobby';
import EndRules from './GameOne/Instructions/EndRules';
import Moving from './GameOne/Instructions/Moving'
import Bonuses from './GameOne/Instructions/Bonuses'
import PlayRules from './GameOne/Instructions/PlayRules'
import Login from './Lobby/Login';

function App() {

    return (
        <div className="App">
            <Router>
                <Route path="/" exact component={Login}/>
                <Route path='/lobby' component = {Lobby}/>
                <Route path="/one-welcome" component={Welcome}/>
                <Route path="/one-introduction" component={Introduction}/>
                <Route path="/one-logic" component={Logic}/>
                <Route path="/one-end-rules" component={EndRules}/>
                <Route path="/one-moving" component={Moving}/>
                <Route path='/one-bonuses' component={Bonuses}/>
                <Route path='/one-play-rules' component={PlayRules}/>
            </Router>
        </div>
    );
}

export default App;
