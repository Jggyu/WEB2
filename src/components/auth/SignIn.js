// src/components/auth/SignIn.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const SignIn = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    registerEmail: '',
    registerPassword: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const isRegisterValid = () => {
    return (
      formData.registerEmail &&
      formData.registerPassword &&
      formData.confirmPassword === formData.registerPassword &&
      formData.acceptTerms
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.acceptTerms) {
        throw new Error('서비스 이용약관에 동의해주세요.');
      }
      if (formData.registerPassword !== formData.confirmPassword) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      await register(formData.registerEmail, formData.registerPassword);
      setIsLoginVisible(true);
      setFormData(prev => ({
        ...prev,
        email: formData.registerEmail,
        password: formData.registerPassword
      }));
      setError('회원가입이 완료되었습니다. 로그인해주세요.');
    } catch (error) {
      setError(error.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/', { replace: true });
    } catch (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-full h-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://assets.nflxext.com/ffe/siteui/vlv3/9134db96-10d6-4a64-a619-a21da22f8999/a449fabb-05e4-4c8a-b062-b0bec7d03085/KR-ko-20240115-trifectadaily-perspective_alpha_website_large.jpg"
            alt="background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Form Container */}
        <div className="relative z-10 max-w-md mx-auto px-4 py-16">
          <div className="bg-black/75 p-8 rounded-lg shadow-lg">
            {isLoginVisible ? (
              // Login Form
              <form onSubmit={handleLogin}>
                <h2 className="text-3xl font-bold text-white mb-8">로그인</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="이메일"
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white
                      placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="비밀번호 (TMDb API Key)"
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white
                      placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-red-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-md bg-red-600 text-white font-semibold
                    hover:bg-red-700 transition-colors ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? '로그인 중...' : '로그인'}
                  </button>
                </div>
                <p className="mt-6 text-gray-400 text-center">
                  Netflix 회원이 아닌가요?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginVisible(false);
                      setError('');
                    }}
                    className="text-white hover:underline"
                  >
                    지금 가입하세요.
                  </button>
                </p>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegister}>
                <h2 className="text-3xl font-bold text-white mb-8">회원가입</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      name="registerEmail"
                      value={formData.registerEmail}
                      onChange={handleInputChange}
                      placeholder="이메일"
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white
                      placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="registerPassword"
                      value={formData.registerPassword}
                      onChange={handleInputChange}
                      placeholder="비밀번호 (TMDb API Key)"
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white
                      placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="비밀번호 확인"
                      className="w-full px-4 py-3 rounded-md bg-gray-700 text-white
                      placeholder-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-red-500"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 
                      border-gray-500 rounded"
                    />
                    <label className="text-gray-400">
                      서비스 이용약관에 동의합니다
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={!isRegisterValid() || isLoading}
                    className={`w-full py-3 rounded-md font-semibold
                    transition-colors ${
                      isRegisterValid() && !isLoading
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? '가입 중...' : '회원가입'}
                  </button>
                </div>
                <p className="mt-6 text-gray-400 text-center">
                  이미 Netflix 회원이신가요?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginVisible(true);
                      setError('');
                    }}
                    className="text-white hover:underline"
                  >
                    로그인하러 가기
                  </button>
                </p>
              </form>
            )}

            {/* Error Message */}
            {error && (
              <div className={`mt-4 p-3 rounded-md text-center ${
                error.includes('완료') 
                  ? 'bg-green-600/50 text-green-100'
                  : 'bg-red-600/50 text-red-100'
              }`}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;