import React from 'react';
import ModalReact from './components/jsx/ModalReact.jsx';

function App() {

  const handleChange = () => {}
  const handleBeforeOpen = () => {
    console.log('open');
  }
  const handleBeforeClose = () => {
    console.log('close');
  }

  return (
    <div>
      <ModalReact
        toggleButtonId = "modalReactButton"   // Attach the modal window to this element Id - Required
        beforeModalOpen = {handleBeforeOpen}  // Method to execute before modal opens
        afterModalClose = {handleBeforeClose} // Method to execute after modal close
        focusOnFirstElement = {true}          // Default focus on first element of modal, default is true
        focusOnParticularField = {1}          // Focus on provided focusable element, default is first element
        closeOnEscape = {false}                // Close the modal on Esc keyboard button, default is true
        focusChangeOnTab = {true}             // Accessibility: Keyboard tab will set focus to next element, default is true
        hideOnOverlayTouch = {true}           // Close the modal on click outside modal window, default is true
        shouldReturnFocusInitialBtnAfterClose = {true}  // Focus will retain to triggered element, default is true
        showPopupAgainAfter = {false}         // Reopen modal after provided time in milliseconds, default is false
        header = {{                           // Customize header of modal
          title: "Welcome to test modal",
          style: {}
        }}
        footer = {{                           // Customize footer of modal
          content: "Developed by Anshul & Deepak",
          style: {}
        }}
        classes = {{                          // User defined CSS classes to be added in modal
          overlay: "",
          dialogContent: "",
          modalClose: ""
        }}
        customStyle = {{                       // Customize the default style of modal
          overlay: {},
          dialogContent: {},
          modalClose: {}
        }}
      >
        <label>First Name: </label>
        <input type="text" name="firstname" value = "" onChange = {handleChange} />
        <label>Last Name: </label>
        <input type="text" name="lastname" value = "" onChange = {handleChange} />
        <a href="google.com"> click here </a>
        <button >submit</button>

      </ModalReact>

      <button id="modalReactButton">Click Here</button>

    </div>
  );
}

export default App;
