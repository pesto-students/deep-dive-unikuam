import React, { useState } from 'react';
import ModalReact from './ModalReact';

function SignUpForm() {
  const [firstname, setFirstname] = useState('Anshul');
  const [lastname, setLastname] = useState('Mittal');
  const [email, setEmail] = useState('abc@test.com');
  const [password, setPassword] = useState('1233445');
  const SignUp = () => {
    window.location.href = '/dashboard';
  }
  const handleChange = () => {

  }
  return (
      <ModalReact
        toggleButtonId = "signupButton"
        header = {{                           // Customize header of modal
          title: "Welcome to Sign Up Form",
        }}
        >
        <div className="container">
          <label>First Name: </label>
          <input type="text" name="firstname" value={firstname} onChange={(e) => handleChange(e)} />
          <label>Last Name: </label>
          <input type="text" name="lastname" value={lastname} onChange={(e) => handleChange(e)} />
          <label>Email Id: </label>
          <input type="text" name="email" value={email} onChange={(e) => handleChange(e)} />
          <label>Password: </label>
          <input type="password" name="password" value={password} onChange={(e) => handleChange(e)} />
          <button onClick={() => SignUp()}>Sign Up</button>
        </div>
      </ModalReact>
  );
}

export default SignUpForm;
