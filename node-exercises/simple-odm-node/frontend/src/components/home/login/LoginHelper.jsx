import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
const ENTER_KEY = 13;

const LoginHelper = () => {
  const history = useHistory();
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (event) => {
    event.persist();
    setIsButtonDisabled(false);
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isButtonDisabled) {
      if (!authenticateUser(values)) {
        setErrors({ ...errors, authenticatonError: 'Invalid Username or Password.' });
      } else {
        history.push(`/dashboard?uname=${values.username}`);
      }
    }
    setIsButtonDisabled(false);
  }, [errors])

  const handleLogin = (event) => {
    if (event) event.preventDefault();
    setIsButtonDisabled(true);
    setErrors(validateFields());
  }

  const authenticateUser = ({ username, password }) => {
    return username === 'unikuam' && password === '1234';
  }

  const validateFields = () => {
    const { username, password } = values;
    let errorMessages = {};
    if (username.length === 0) {
      errorMessages.username = 'Username is required.';
    } else if (username.length > 40) {
      errorMessages.username = 'Username can not be greater than 40 characters.';
    } else if (!username.match(/^[a-zA-Z ]*$/)) {
      errorMessages.username = 'Username should only contain alphabets';
    }

    if (password.length === 0) {
      errorMessages.password = 'Password is required.';
    } else if (password.length < 6 && password.length > 10) {
      errorMessages.password = 'Password can not be less than 6 and greater than 10 characters.';
    }
    return errorMessages;
  }

  const handleKeyPress = (event) => {
    if (event.keyCode === ENTER_KEY || event.which === ENTER_KEY) {
      handleLogin();
    }
  }

  return {
    values,
    errors,
    isButtonDisabled,
    handleChange,
    handleLogin,
    handleKeyPress
  }
}

export default LoginHelper;
