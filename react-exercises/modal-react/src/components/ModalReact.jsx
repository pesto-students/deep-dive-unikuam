import React from 'react';
import './ModalReact.css';
import PropTypes from "prop-types";

//function defined to ease the debugging
const p = data => {
  console.log(data);
}

class ModalReact extends React.Component {
  modalDialog = 'modalDialog';
  modalClassName = 'modalReact';
  modalCloseClass = 'modalReactClose';
  modalOverlay = 'modalOverlay';

  state = {
    close: false,
    toggleStatus: false,
  }

  componentDidMount() {
    document.getElementById(this.props.toggleButtonId).addEventListener('click', (e) => this.closeModal(e));
  }

  componentWillUnmount() {
    document.getElementById(this.props.toggleButtonId).removeEventListener('click', (e) => this.closeModal(e));
  }

  componentDidUpdate() {
    if (this.props.focusOnFirstElement && this.state.close) {
      this.focusFirstElementInModal();
    }
    if (this.props.changeFocusOnTab && this.state.close) {
      this.changeFieldsOnTab();
    }
  }

  changeFieldsOnTab = () => {

  }

  focusFirstElementInModal = () => {
    this.getFocusableElements()[0].focus();
  }

  getFocusableElements = () => {
    const focusableElements = "button:not([disabled]), a:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([disabled]):not([tabindex='-1'])";
    const focusableElementsInModal = focusableElements.split(', ').map(el => `#${this.modalDialog} ${el}`).join(', ');
    return document.querySelectorAll(focusableElementsInModal);
  }

  // toggleModal = (e) => {
  //   this.setState(() => ({
  //     toggleStatus: !this.state.toggleStatus,
  //     close: !this.state.close
  //   }));
  // }

  closeModal = (e) => {
    this.setState(() => ({
      close: !this.state.close,
      toggleStatus: !this.state.toggleStatus,
    }));
  }

  handleKeyPress = (e) => {
    if (e.key === 'Tab') {
      const focusable = [...this.getFocusableElements()];
      const focusIndex = focusable.indexOf(document.activeElement);
      const tabIndex = focusable[focusIndex].getAttribute('tabIndex');
      p(focusable);
      if (tabIndex === focusable.length) {
        focusable[0].focus();
      } else {
        if (focusable[focusIndex]) {
          focusable[focusIndex].focus();
        }
      }
    }
  }

  handleDocumentClick = (event) => {
    if(event.target.className === 'modalOverlay') {
      this.closeModal();
      document.removeEventListener("click", this.handleDocumentClick);
    }
  }

  render() {
    if (!this.state.toggleStatus && !this.state.close) return null;
    document.addEventListener("click", this.handleDocumentClick, false);
    
    return (
      <div className={this.modalOverlay}>
        <div className={this.modalClassName} id={this.modalDialog} tabIndex="0" onKeyDown={this.handleKeyPress}>
          {this.props.children}
          <button tabIndex="5" className={this.modalCloseClass} onClick={(e) => this.closeModal(e)}>close</button>
        </div>
      </div>
    );
  }
}

ModalReact.propTypes = {
  toggleButtonId: PropTypes.string.isRequired,
};

export default ModalReact;
