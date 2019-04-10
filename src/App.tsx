import React, { Component } from 'react';
import './App.css';
import './ColorBox'
import ColorBox from './ColorBox';

class App extends Component {
  render() {
    return (
      <div className="App">
          <ColorBox /><br />
          <ColorBox /><br />
          <ColorBox />
      </div>
    );
  }
}

export default App;
