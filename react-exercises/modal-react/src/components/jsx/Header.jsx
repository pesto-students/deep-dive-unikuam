import React from 'react';

function Header({ data: { title, style } }) {
  const defaultModalHeaderStyles = {
    padding: '4px',
    borderBottom: '1px solid #e5e5e5',
  }
  return (
    <div style={{ ...defaultModalHeaderStyles, ...style }}>
      <h4>{title ? title : ''}</h4>
    </div>
  );
}

export default Header;
