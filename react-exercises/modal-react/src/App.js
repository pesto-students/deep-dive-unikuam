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
        changeFocusOnTab
      >
      <label>First Name: </label>
      <input type="text" name="firstname" value="" tabIndex="1" onChange={(e) => this.handleChange(e)}/>
      <label>Last Name: </label>
      <input type="text" name="lastname" value="" tabIndex="2" onChange={(e) => this.handleChange(e)}/>
      <a href="google.com" tabIndex="3"> click here </a>
      <button tabIndex="4" >submit</button>
      </ModalReact>
      <button id="modalReactButton">Click Here</button>
    </div>
  );
}

export default App;
