import React, { Component } from 'react';
import PlayIcon from '../img/play-icon.png';
import PauseIcon from '../img/pause-icon.png';
import ReplayIcon from '../img/replay-icon.png';

class ControlPanel extends Component {
  render() {
    return (
      <div className="panel-area">
        <div className="panel-row">
          <div className="play-button panel-button">
            <button
              onClick={this.props.onPlay}
              tabIndex="0"
              onKeyDown={this.props.onKeyPress}
              >
                <img src={PlayIcon} alt='Play'/>
            </button>
          </div>
          <div className="score panel-button">
            <span>SCORE: </span><span>{this.props.snakeControl.score}</span>
          </div>
          <div className="pause-button panel-button">
            <button onClick={this.props.onPause}><img src={PauseIcon} alt='Pause'/></button>
          </div>
          <div className="replay-button panel-button" style={{display:"none"}}>
            <button onClick={this.props.onRestart}><img src={ReplayIcon} alt='Replay'/></button>
          </div>
        </div>
      </div>
    );
  }
}

export default ControlPanel;
