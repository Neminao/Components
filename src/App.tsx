import React, { Component } from 'react';
import './App.css';
import './ColorBox'
import ColorBox from './ColorBox';

class App extends Component<{}, { prevColors: any[] }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      prevColors: []
    }
  }

  render() {
    return (
      <div className="App">
        <ColorBox data={{ r: 255, g: 1, b: 1, id: 1, a: 1, display: 'block' }} prevColors={this.state.prevColors} /><br />
        <ColorBox data={{ r: 1, g: 255, b: 1, id: 2, a: 1, display: 'inline-block' }} prevColors={this.state.prevColors} /><br />
        <ColorBox data={{ r: 1, g: 1, b: 255, id: 3, a: 1, display: 'block' }} prevColors={this.state.prevColors} />
      </div>
    );
  }
}

export default App;
