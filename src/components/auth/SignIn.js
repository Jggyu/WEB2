import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    registerEmail: '',
    registerPassword: '',
    confirmPassword: '',
    rememberMe: false,
    acceptTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.registerPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await register(formData.registerEmail, formData.registerPassword);
      setIsLoginVisible(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleCard = () => {
    setIsLoginVisible(!isLoginVisible);
  };

  return (
    <div className="bg-image">
      <div className="container">
        <div id="phone">
          <div id="content-wrapper">
            <div id={`login`} className={`card ${!isLoginVisible ? 'hidden' : ''}`}>
              <form onSubmit={handleLogin}>
                <h1>Sign in</h1>
                <div className="input">
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Username or Email"
                  />
                </div>
                <div className="input">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                  />
                </div>
                <div className="checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    Remember me
                  </label>
                  <a href="#" className="forgot">Forgot Password?</a>
                </div>
                <button type="submit">Login</button>
              </form>
              <a href="#" className="account-check" onClick={toggleCard}>
                Don't have an account? Sign up
              </a>
            </div>

            <div id="register" className={`card ${isLoginVisible ? 'hidden' : ''}`}>
              <form onSubmit={handleRegister}>
                <h1>Sign up</h1>
                <div className="input">
                  <input
                    type="email"
                    name="registerEmail"
                    value={formData.registerEmail}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
                <div className="input">
                  <input
                    type="password"
                    name="registerPassword"
                    value={formData.registerPassword}
                    onChange={handleInputChange}
                    placeholder="Password"
                  />
                </div>
                <div className="input">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                    />
                    I have read Terms and Conditions
                  </label>
                </div>
                <button type="submit">Register</button>
              </form>
              <a href="#" className="account-check" onClick={toggleCard}>
                Already have an account? Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;