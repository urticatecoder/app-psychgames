import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import GameOne from './GameOne/GameOne'
import Lobby from './Lobby/Lobby'
function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Lobby}/>
        <Route path="/game-one" component={GameOne}/>
      </Router>
    </div>
  );
}

export default App;
