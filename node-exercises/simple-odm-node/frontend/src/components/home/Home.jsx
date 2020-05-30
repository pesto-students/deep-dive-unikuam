import React from 'react';
import loginHelper from './login/LoginHelper';
import './css/Home.css';

const Home = () => {
  const {
    values,
    errors,
    isButtonDisabled,
    handleChange,
    handleLogin,
    handleKeyPress
  } = loginHelper();

  return (
    <div className="container">
      {/*Header*/}
      <div className="header">
        <h4 className="text-center">Let's Work</h4>
      </div>
      {/*Login Form*/}
      <div className="main-container">
        <form id="chatUserLogin" autoComplete="off">
          {errors.authenticatonError && <span className="alert alert-danger errorAuth">{errors.authenticatonError}</span>}
          <div className="form-group">
            <input
              placeholder="User Name"
              type="text"
              name="username"
              className="form-control"
              id="uname"
              onChange={handleChange}
            />
            {errors.username && <span className="alert alert-danger error">{errors.username}</span>}
          </div>
          <div className="form-group">
            <input
              placeholder="Password"
              type="password"
              name="password"
              className="form-control"
              id="pwd"
              onChange={handleChange}
            />
            {errors.password && <span className="alert alert-danger error">{errors.password}</span>}
          </div>
          <button
            type="submit"
            className="btn btn-primary chatLogin"
            onKeyPress={handleKeyPress}
            disabled={isButtonDisabled}
            onClick={handleLogin}
            >
            Login
          </button>
        </form>
      </div>
      {/*Footer*/}
      <div className="footer">
      </div>
    </div>
  );
}

export default Home;
