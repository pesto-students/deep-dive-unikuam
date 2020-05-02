import React from 'react';
import '../css/ModalReactStyles.css';
import PropTypes from "prop-types";
import Header from './Header';
import Footer from './Footer';

const KEYCODE_TAB = 9;
const KEYCODE_ESC = 27;

class ModalReact extends React.Component {

  modalDialog = 'modalDialog';
  modalClassName = `${this.props.classes && this.props.classes.dialogContent ? 'modalReact ' + this.props.classes.dialogContent : 'modalReact'}`;
  modalCloseClass = `${this.props.classes && this.props.classes.modalClose ? 'modalReactClose ' + this.props.classes.modalClose : 'modalReactClose'}`;
  modalOverlay = `${this.props.classes && this.props.classes.overlay ? 'modalOverlay ' + this.props.classes.overlay : 'modalOverlay'}`;

  state = {
    isModalOpen: false,
    shouldModalShowAfterClose: true,
    ariaHidden: false
  }

  defaultPropValues = {
    focusOnFirstElement: true,
    focusOnParticularField: 1,
    closeOnEscape: true,
    focusChangeOnTab: true,
    hideOnOverlayTouch: true,
    shouldReturnFocusInitialBtnAfterClose: true,
    showPopupAgainAfter: false,
  }

  componentDidMount() {
    if (!this.props.toggleButtonId) {
      throw new Error(`Button Id is required to show the modal, please provide a valid id in string format.`);
    } else {
      document.getElementById(this.props.toggleButtonId).addEventListener('click', this.toggleModal);
    }
  }

  componentWillUnmount() {
    document.getElementById(this.props.toggleButtonId).removeEventListener('click', this.toggleModal);
  }

  componentDidUpdate() {
    const showPopupAgainAfter = typeof this.props.showPopupAgainAfter !== undefined ? this.props.showPopupAgainAfter : this.defaultPropValues.showPopupAgainAfter;
    const focusOnFirstElement = typeof this.props.focusOnFirstElement !== undefined ? this.props.focusOnFirstElement : this.defaultPropValues.focusOnFirstElement;
    const focusOnParticularField = typeof this.props.focusOnParticularField !== undefined ? this.props.focusOnParticularField : this.defaultPropValues.focusOnParticularField;

    if (showPopupAgainAfter && !this.state.isModalOpen && this.state.shouldModalShowAfterClose) {
      this.showAfterParticularTime(showPopupAgainAfter);
    }
    if (focusOnFirstElement && this.state.isModalOpen) {
      this.getFocusableElements()[0].focus();
    }
    if (focusOnParticularField && this.state.isModalOpen) {
      this.focusOnParticularField(focusOnParticularField);
    }
    this.addTabIndexAttribute();
  }

  showAfterParticularTime = (showTime) => {
    if (!Number.isFinite(showTime)) {
      throw new Error(`Expected the finite number for showPopupAgainAfter attribute, got invalid`);
    }
    setTimeout(() => {
      this.closeModal();
    }, showTime);

    this.setState({ shouldModalShowAfterClose: false });
  }

  addTabIndexAttribute = () => {
    const focusable = this.getFocusableElements();
    let tabIndex = 1;
    for (const element of focusable) {
      element.setAttribute('tabIndex', tabIndex);
      tabIndex++;
    }
  }

  focusOnParticularField = (tabIndex) => {
    const focusable = this.getFocusableElements();

    if (tabIndex > focusable.length) {
      throw new Error(`Provided index for default focus is greater than the number of available focusable elements. It should be equal or less than ${focusable.length}`);
    }
    focusable[tabIndex - 1].focus();
  }

  getFocusableElements = () => {
    const focusableElements = "button:not([disabled]), a:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([disabled]):not([tabindex='-1'])";
    const focusableElementsInModal = focusableElements.split(', ').map(el => `#${this.modalDialog} ${el}`).join(', ');
    return document.querySelectorAll(focusableElementsInModal);
  }

  toggleModal = () => {
    this.setState(() => ({
      isModalOpen: !this.state.isModalOpen,
      shouldModalShowAfterClose: true
    }));
  }

  closeModal = () => {
    const retainFocusToElement = typeof this.props.shouldReturnFocusInitialBtnAfterClose !== undefined ? this.props.shouldReturnFocusInitialBtnAfterClose : this.defaultPropValues.shouldReturnFocusInitialBtnAfterClose;
    if (retainFocusToElement) {
      document.getElementById(this.props.toggleButtonId).focus();
    }
    this.setState(() => ({
      isModalOpen: !this.state.isModalOpen
    }));
    document.getElementById(this.props.toggleButtonId).setAttribute('aria-hidden', false);
  }

  handleKeyPress = (event) => {
    const focusChangeOnTab = typeof this.props.focusChangeOnTab !== undefined ? this.props.focusChangeOnTab : this.defaultPropValues.focusChangeOnTab;
    const closeOnEscape = typeof this.props.closeOnEscape !== undefined ? this.props.closeOnEscape : this.defaultPropValues.closeOnEscape;
    const isTabPressed = (event.key === 'Tab' || event.keyCode === KEYCODE_TAB);

    if (isTabPressed && focusChangeOnTab) {
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
    if ((event.key === "Escape" || event.keyCode === KEYCODE_ESC) && closeOnEscape) {
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
    if (!this.state.isModalOpen) {
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

    document.getElementById(this.props.toggleButtonId).setAttribute('aria-hidden', true);

    return (
      <div className={this.modalOverlay} style={{ ...this.defaultStyles.overlay, ...customOverlayStyle }}>
        <div
          className={this.modalClassName}
          id={this.modalDialog}
          tabIndex="-1"
          aria-labelledby="modal_overlay_label"
          aria-hidden={this.state.ariaHidden}
          onKeyDown={this.handleKeyPress}
          style={{ ...this.defaultStyles.dialogContent, ...customContentStyle }}>
          
          {/* Modal Header */}
          {this.props.header ? <Header data={this.props.header} aria-labelledby="modal_overlay_header_label" /> : null}
          
          {/* Modal Body Content */}
          <div className="modalBody" aria-labelledby="modal_overlay_body_label">
            {this.props.children}
          </div>
          
          {/* Modal Footer */}
          {this.props.footer ? <Footer data={this.props.footer} aria-labelledby="modal_overlay_footer_label" /> : null}
          
          {/* Modal Close Icon */}
          <button
            className={this.modalCloseClass}
            onClick={(event) => this.closeModal(event)}
            aria-labelledby="modal_overlay_close_label"
            style={{ ...this.defaultStyles.modalClose, ...customCloseStyle }}>
          </button>
        </div>

        <div id="modal_overlay_label" className="hide-labelledBy">Modal window to show the content</div>
        <div id="modal_overlay_header_label" className="hide-labelledBy">Header of Modal window</div>
        <div id="modal_overlay_footer_label" className="hide-labelledBy">Footer of Modal window</div>
        <div id="modal_overlay_body_label" className="hide-labelledBy">Body content of Modal window</div>
        <div id="modal_overlay_close_label" className="hide-labelledBy">Close the Modal Window</div>
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
