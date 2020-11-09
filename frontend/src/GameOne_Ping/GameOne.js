import React, { Component } from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';

class Thing extends Component {
	render() {
	  return <div style={{marginLeft: this.props.left + 'px', marginTop: this.props.top + 'px'}}>Thing</div>;
  }
}

class Controls extends Component {
	render() {
	  return <div>
      <button onClick={e => this.props.move(-10, 0)}>Left</button>
      <button onClick={e => this.props.move(10, 0)}>Right</button>
      <button onClick={e => this.props.move(0, -10)}>Up</button>
      <button onClick={e => this.props.move(0, 10)}>Down</button>
    </div>;
  }
}

class App extends Component {
	constructor() {
	  super();
  	this.state = {
    	left: 0,
      top: 0,
    }
  }
  
  move(x, y) {
  	this.setState({
    	left: this.state.left + x,
    	top: this.state.top + y
    });
  }
  
	render() {
  	return <div>
    	<Thing left={this.state.left} top={this.state.top}/>
      <Controls move={(x, y) => this.move(x, y)}/>
    </div>;
  }
}

export default App;

/*import React, { useEffect, useState} from 'react';
import {Typography} from '@material-ui/core';
import '../../CommonStylings/FullScreenDiv.css'

function GameOne(props) {
    return(
        <div>
            <Typography align='center' variant="h1">Game One</Typography>
        </div>
    )
}

export default GameOne;*/
