import React from 'react';
import './ModalReactStyles.css';
import PropTypes from "prop-types";
import Header from './Header';
import Footer from './Footer';
const KEYCODE_TAB = 9;
const KEYCODE_ESC = 27;

class ModalReact extends React.Component {
  modalDialog = 'modalDialog';
  modalClassName = `modalReact ${this.props.classes && this.props.classes.dialogContent ? this.props.classes.dialogContent: ''}`;
  modalCloseClass = `modalReactClose ${this.props.classes && this.props.classes.modalClose ? this.props.classes.modalClose: ''}`;
  modalOverlay = `modalOverlay ${this.props.classes && this.props.classes.overlay ? this.props.classes.overlay: ''}`;

  state = {
    close: false,
    toggleStatus: false,
    afterCloseShow: true
  }

  componentDidMount() {
    document.getElementById(this.props.toggleButtonId).addEventListener('click', this.toggleModal);
  }

  componentWillUnmount() {
    document.getElementById(this.props.toggleButtonId).removeEventListener('click', this.toggleModal);
  }

  componentDidUpdate() {
    if (this.props.showPopupAgainAfter && !this.state.close && this.state.afterCloseShow) {
      const showTime = this.props.showPopupAgainAfter;
      if (!Number.isFinite(showTime)) {
        throw new Error(`Expected the finite number for showPopupAgainAfter attribute, got invalid`);
      }
      setTimeout(() => {
        this.closeModal();
      }, showTime);
      this.setState({ afterCloseShow: false });
    }
    if (this.props.focusOnFirstElement && this.state.close) {
      this.getFocusableElements()[0].focus();
    }
    if (this.props.focusOnParticularField && this.state.close) {
      this.focusOnParticularField();
    }
    this.addTabIndexAttribute();
  }

  addTabIndexAttribute = () => {
    const focusable = this.getFocusableElements();
    let i = 1;
    for (const element of focusable) {
      element.setAttribute('tabIndex', i);
      i++;
    }
  }

  focusOnParticularField = () => {
    const tabIndex = this.props.focusOnParticularField - 1;
    const focusable = this.getFocusableElements();
    if (tabIndex > focusable.length) {
      throw new Error(`Provided index for default focus is greater than the number of available focusable elements. It should be equal or less than ${focusable.length}`);
    }
    focusable[tabIndex].focus();
  }

  getFocusableElements = () => {
    const focusableElements = "button:not([disabled]), a:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([disabled]):not([tabindex='-1'])";
    const focusableElementsInModal = focusableElements.split(', ').map(el => `#${this.modalDialog} ${el}`).join(', ');
    return document.querySelectorAll(focusableElementsInModal);
  }

  toggleModal = () => {
    this.setState(() => ({
      toggleStatus: !this.state.toggleStatus,
      close: !this.state.close,
      afterCloseShow: true
    }));
  }

  closeModal = () => {
    if (this.props.shouldReturnFocusInitialBtnAfterClose) {
        document.getElementById(this.props.toggleButtonId).focus();
    }
    this.setState(() => ({
      toggleStatus: !this.state.toggleStatus,
      close: !this.state.close
    }));
  }

  handleKeyPress = (event) => {
    const isTabPressed = (event.key === 'Tab' || event.keyCode === KEYCODE_TAB);
    if (isTabPressed && this.props.focusChangeOnTab) {
      const focusable = this.getFocusableElements();
      if (event.shiftKey) {
        if (document.activeElement === focusable[0]) {
          focusable[focusable.length - 1].focus();
        }
      } else {
        if (document.activeElement === focusable[focusable.length - 1]) {
          setTimeout(() => focusable[0].focus(), 100);
        }
      }
    }
    if ((event.key === "Escape" || event.keyCode === KEYCODE_ESC) && this.props.closeOnEscape) {
       this.closeModal();
    }
  }

  handleDocumentClick = (event) => {
    if (event.target.className === 'modalOverlay') {
      this.closeModal();
      document.removeEventListener("click", this.handleDocumentClick);
    }
  }

  defaultStyles = {
    overlay: {
      display: 'flex',
      textAlign: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      padding: '1rem',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 9999,
      opacity: 1,
      animation: 'show .5s ease',
      overflowX: 'hidden',
      overflowY: 'auto',
    },
    dialogContent: {
      // width: '100%',
      background: '#fff',
      boxShadow: '0, 0, 0.625rem, rgba(0, 0, 0, 0.2)',
      position: 'relative',
      padding: '1rem',
      overflow: 'auto',
      borderRadius: '7px',
    },
    modalClose: {
      position: 'absolute',
       zIndex: 1,
       top: 0,
       right: 0,
       backgroundColor: '#34363a',
       width: '2.5rem',
       height: '2.5rem',
       padding: 0,
       border: 0,
       cursor: 'pointer',
       outline: 0,
       boxShadow: '0, 0, 0.625rem, rgba(0, 0, 0, 0.1)',
    }
  }

  render() {
    let customOverlayStyle = null;
    let customContentStyle = null;
    let customCloseStyle = null;
    if (this.props.customStyle) {
      customOverlayStyle = this.props.customStyle.overlay ? this.props.customStyle.overlay : null;
      customContentStyle = this.props.customStyle.dialogContent ? this.props.customStyle.dialogContent : null;
      customCloseStyle = this.props.customStyle.modalClose ? this.props.customStyle.modalClose : null;
    }
    if (!this.state.toggleStatus && !this.state.close) {
      if (this.props.afterModalClose) {
        this.props.afterModalClose();
      }
      return null;
    }
    if (this.props.hideOnOverlayTouch) {
      document.addEventListener("click", this.handleDocumentClick, false);
    }
    if (this.props.beforeModalOpen) {
      this.props.beforeModalOpen();
    }
    return (
      <div className={this.modalOverlay} style={{ ...this.defaultStyles.overlay, ...customOverlayStyle}}>
          <div
            className={this.modalClassName}
            id={this.modalDialog}
            tabIndex="-1"
            onKeyDown={this.handleKeyPress}
            style={{ ...this.defaultStyles.dialogContent, ...customContentStyle}}>
              {this.props.header ? <Header data={this.props.header} /> : null}
              <div className="modalBody">
                {this.props.children}
              </div>
              {this.props.footer ? <Footer data={this.props.footer} /> : null}
              <button
                className={this.modalCloseClass}
                onClick={(event) => this.closeModal(event)}
                style={{ ...this.defaultStyles.modalClose, ...customCloseStyle}}>
              </button>
          </div>
      </div>
    );
  }
}

ModalReact.propTypes = {
  toggleButtonId: PropTypes.string.isRequired,
  beforeModalOpen: PropTypes.func,
  afterModalClose: PropTypes.func,
  focusOnFirstElement: PropTypes.bool,
  focusOnParticularField: PropTypes.number,
  showPopupAgainAfter: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  closeOnEscape: PropTypes.bool,
  focusChangeOnTab: PropTypes.bool,
  hideOnOverlayTouch: PropTypes.bool,
  shouldReturnFocusInitialBtnAfterClose: PropTypes.bool,
  header: PropTypes.exact({
    title: PropTypes.string,
    style: PropTypes.object
  }),
  footer: PropTypes.exact({
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    style: PropTypes.object
  }),
  classes: PropTypes.shape({
    overlay: PropTypes.string,
    dialogContent: PropTypes.string,
    modalClose: PropTypes.string,
  }),
  customStyle: PropTypes.shape({
    overlay: PropTypes.object,
    dialogContent: PropTypes.object,
    modalClose: PropTypes.object
  }),
};

export default ModalReact;
