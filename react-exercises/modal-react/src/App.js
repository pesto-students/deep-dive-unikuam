import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import ModalReact from './components/ModalReact.jsx';

function App() {
  const handleChange = () => {

  }
  return (
    <div>
      <ModalReact
        toggleButtonId="modalReactButton"
        focusOnFirstElement
        closeOnEscape
        focusChangeOnTab
        hideOnOverlayTouch
      >
      <label>First Name: </label>
      <input type="text" name="firstname" value="" onChange={(e) => this.handleChange(e)}/>
      <label>Last Name: </label>
      <input type="text" name="lastname" value="" onChange={(e) => this.handleChange(e)}/>
      <a href="google.com"> click here </a>
      <button >submit</button>
      </ModalReact>
      <button id="modalReactButton">Click Here</button>
    </div>
  );
}

export default App;
