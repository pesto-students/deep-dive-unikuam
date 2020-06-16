import React, { Component } from 'react';

class Playground extends Component {
  render() {
    return (
      <div className="playground">
        <canvas
          id="snk-canvas"
          width={this.props.snakeCanvas.width}
          height={this.props.snakeCanvas.height}>
        </canvas>
      </div>
    );
  }
}

export default Playground;
