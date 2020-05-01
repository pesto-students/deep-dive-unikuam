import React from 'react';
import './ModalReact.css';
import PropTypes from "prop-types";

//function defined to ease the debugging
const p = data => {
  console.log(data);
}

const KEYCODE_TAB = 9;

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
    this.addTabIndexAttribute();
  }

  addTabIndexAttribute = () => {
    const focusable = this.getFocusableElements();
    let i = 1;
    for (const ele of focusable) {
      ele.setAttribute('tabIndex', i);
      i++;
    }
  }

  focusFirstElementInModal = () => {
    this.getFocusableElements()[0].focus();
  }

  getFocusableElements = () => {
    const focusableElements = "button:not([disabled]), a:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([disabled]):not([tabindex='-1'])";
    const focusableElementsInModal = focusableElements.split(', ').map(el => `#${this.modalDialog} ${el}`).join(', ');
    return document.querySelectorAll(focusableElementsInModal);
  }

  closeModal = (e) => {
    document.getElementById(this.props.toggleButtonId).focus();
    this.setState(() => ({
      toggleStatus: !this.state.toggleStatus,
      close: !this.state.close
    }));
  }

  handleKeyPress = (e) => {
    const isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);
    if (isTabPressed && this.props.focusChangeOnTab) {
      const focusable = [...this.getFocusableElements()];
      const focusIndex = focusable.indexOf(document.activeElement);
      if (e.shiftKey) {
        if (document.activeElement === focusable[0]) {
          focusable[focusable.length - 1].focus();
        }
      } else {
        if (document.activeElement === focusable[focusable.length - 1]) {
          console.log(focusable[0]);
          focusable[0].focus();
        }
      }
    }
    if (e.key === "Escape" && this.props.closeOnEscape) {
       this.closeModal();
    }
  }

  handleDocumentClick = (event) => {
    if (event.target.className === 'modalOverlay') {
      this.closeModal();
      document.removeEventListener("click", this.handleDocumentClick);
    }
  }

  render() {
    if (!this.state.toggleStatus && !this.state.close) {
      return null;
    }
    if (this.props.hideOnOverlayTouch) {
      document.addEventListener("click", this.handleDocumentClick, false);
    }
    return (
      <div className={this.modalOverlay}>
        <div className={this.modalClassName} id={this.modalDialog} tabIndex="0" onKeyDown={this.handleKeyPress}>
          {this.props.children}
          <button className={this.modalCloseClass} onClick={(e) => this.closeModal(e)}></button>
        </div>
      </div>
    );
  }
}

ModalReact.propTypes = {
  toggleButtonId: PropTypes.string.isRequired,
};

export default ModalReact;
