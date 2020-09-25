import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Welcome from './GameOne/Instructions/Welcome'
import Introduction from './GameOne/Instructions/Introduction';
import Lobby from './Lobby/Lobby'

function App() {

  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Lobby}/>
        <Route path="/one-welcome" component={Welcome}/>
        <Route path="/one-introduction" component={Introduction}/>
      </Router>
    </div>
  );
}

export default App;
