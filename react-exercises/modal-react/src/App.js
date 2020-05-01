import React, { useState, useEffect } from 'react';
import ModalReact from './components/ModalReact.jsx';

function App() {
  const handleChange = () => {

  }
  const handleBeforeOpen = () => {
    console.log('open');
  }
  const handleBeforeClose = () => {
    console.log('close');
  }
  return (
    <div>
      <ModalReact
        toggleButtonId="modalReactButton"
        beforeModalOpen={handleBeforeOpen}
        afterModalClose={handleBeforeClose}
        focusOnFirstElement={true}
        focusOnParticularField={1}
        closeOnEscape={true}
        focusChangeOnTab={true}
        hideOnOverlayTouch={true}
        shouldReturnFocusInitialBtnAfterClose={true}
        showPopupAgainAfter={false}
        header={{
          title: "Welcome to login page",
          style: {
            padding: '4px'
          }
        }}
        footer={{
          content: <h1>Developed by Anshul & Deepak</h1>,
          style: {
          }
        }}
        classes={{
          overlay: "",
          dialogContent: "",
          modalClose: ""
        }}
        customStyle={
          {
            overlay: {
            },
            dialogContent: {
            },
            modalClose: {
            }
          }
        }
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
