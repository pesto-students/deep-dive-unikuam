import React from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import '../css/home.css';

function Home() {
  return (
    <div>
      <LoginForm />
      <SignUpForm />
      <div className="home-header">
        <div className="login-section">
          <button id="loginButton">Login</button>
        </div>
        <div className="signup-section">
          <button id="signupButton">Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
