import React from 'react';

function Footer({ data: { content, style } }) {
  const defaultModalFooterStyles = {
    padding: '10px',
    borderTop: '1px solid #e5e5e5',
    textAlign: 'center',
  }
  return (
    <div style={{ ...defaultModalFooterStyles, ...style }}>
      {content}
    </div>
  );
}

export default Footer;
