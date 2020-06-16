import React, { Component } from 'react';
import GameIcon from '../img/game-icon.png';

class Header extends Component {
  render() {
    return (
      <div className="header-name">
        <img src={GameIcon} alt='Game Icon' className="header-img"/>
        <span className="header-title">FEED THE SNAKE</span>
      </div>
    );
  }
}

export default Header;
