import React, { useState } from 'react';
import ModalReact from './ModalReact';

function LoginForm() {
  const [uname, setUname] = useState('Anshul');
  const [psw, setPsw] = useState('abcd');
  const loginIn = () => {
    window.location.href = '/dashboard';
  }
  const handleUnameChange = (e) => {
  }
  const handlePswChange = (e) => {
  }
  return (
    <React.Fragment>
      <ModalReact
        toggleButtonId = "loginButton"
        header = {{                           // Customize header of modal
          title: "Welcome to Login Form",
        }}
        >
        <div className="container">
          <label htmlFor="uname"><b>Username</b></label>
          <input type="text" placeholder="Enter Username" name="uname" value={uname} onChange={(e) => handleUnameChange(e)} />
          <label htmlFor="psw"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="psw" value={psw} onChange={(e) => handlePswChange(e)}/>
          <button type="submit" onClick={() =>loginIn()} >Login</button>
        </div>
      </ModalReact>
    </React.Fragment>
  );
}

export default LoginForm;
