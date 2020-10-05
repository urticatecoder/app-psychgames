import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Lobby from './Lobby/Lobby';
import Login from './Lobby/Login';
import InstructionsScreen from './GameOne/Instructions/InstructionsScreen';

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

function App() {

  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Login}/>
        <Route path='/lobby' component = {Lobby}/>

        <Route 
          path="/one-welcome" 
          render={() => (<InstructionsScreen file='Instructions/Welcome.txt' title='Game One' route='one-introduction'/>)}
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
          render={() => (<InstructionsScreen file='Instructions/PlayRules.txt' title='How do I play?' route=''/>)}
        />
      
      </Router>
    </div>
  );
}

export default App;
