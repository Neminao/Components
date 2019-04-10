import React, { Component } from 'react';
import './App.css';
import './ColorBox'
import ColorBox from './ColorBox';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ColorBox data={{ r: 255, g: 1, b: 1, id: 1 }} /><br />
        <ColorBox data={{ r: 1, g: 255, b: 1, id: 2 }} /><br />
        <ColorBox data={{ r: 1, g: 1, b: 255, id: 3 }} />
      </div>
    );
  }
}

export default App;
