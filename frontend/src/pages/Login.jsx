import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomHttp from '../services/CustomHttp';
import AuthService from '../services/AuthService';
import config from '../config/config';

// regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({ email: false, password: false });

    // redirecting if already logged in
    useEffect(() => {
        if (AuthService.isLoggedIn()) {
            navigate('/');
        }
    }, [navigate]);

    // field validation
    useEffect(() => {
        const newErrors = {};
        if (touched.email && !emailRegex.test(email.trim())) {
            newErrors.email = 'Invalid email format.';
        }
        if (touched.password && !passwordRegex.test(password.trim())) {
            newErrors.password = 'Password must be at least 8 characters, include 1 uppercase letter and 1 number.';
        }
        setErrors(newErrors);
    }, [email, password, touched]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (Object.keys(errors).length > 0) {
            setErrorMessage('Please fix the errors before submitting.');
            return;
        }

        try {
            const result = await CustomHttp.request(`${config.host}/api/auth/login`, 'POST', {
                email: email.trim(),
                password: password.trim(),
                rememberMe,
            });

            if (!result || result.message) {
                throw new Error(result.message || 'Login failed');
            }


            if (!result.token || !result.user) {
                throw new Error("Login successful, but no token or user returned.");
            }

            AuthService.setAuthInfo(result.token, result.user);
            navigate('/');
        } catch (error) {
            console.error("Login error:", error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="container">
            <form className="form d-grid mx-auto d-flex flex-column align-items-center mt-5" onSubmit={handleSubmit} noValidate>
                <a href="/login" className="text-decoration-none mb-5">
                    <img className="form-img mb-6" src="/images/logo.png" alt="Logo"/>
                </a>
                <h1 className="form-title mb-4">Login</h1>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {/* Email Input */}
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38"
                                                             fill="none">
                                 <g clip-path="url(#clip0_15_272)">
                                      <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M25.6885 16.3176L19.3885 12.1176C19.1533 11.9608 18.8474 11.9608 18.6122 12.1176L12.3122 16.3176C12.1169 16.4478 12 16.6662 12 16.9V24.6C12 25.3721 12.6279 26 13.4 26H24.6C25.3721 26 26 25.3721 26 24.6V16.9C26 16.6662 25.8831 16.4478 25.6885 16.3176ZM19 13.5414L24.0379 16.9L19 20.2586L13.9621 16.9L19 13.5414ZM13.4 24.6V18.2083L18.6115 21.6824C18.7291 21.7608 18.8649 21.8 19 21.8C19.1351 21.8 19.2709 21.7608 19.3885 21.6824L24.6 18.2083L24.5979 24.6H13.4Z"
                                            fill="#6C757D"/>
                                 </g>
                            </svg>
                        </span>
                    </div>
                    <input
                        type="email"
                        placeholder="Email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                        autoComplete="username"
                    />
                </div>
                <div className="align-self-start">{errors.email && <div className="text-danger mb-3">{errors.email}</div>}</div>

                {/* Password Input */}
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38"
                                                             fill="none">
                                <g clip-path="url(#clip0_15_225)">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M19.4 11C17.1944 11 15.4 12.7944 15.4 15V17.4H14.6C13.7176 17.4 13 18.1176 13 19V25.4C13 26.2824 13.7176 27 14.6 27H24.2C25.0824 27 25.8 26.2824 25.8 25.4V19C25.8 18.1176 25.0824 17.4 24.2 17.4H23.4V15C23.4 12.7944 21.6056 11 19.4 11ZM24.2 19L24.2016 25.4H14.6V19H24.2ZM17 17.4V15C17 13.6768 18.0768 12.6 19.4 12.6C20.7232 12.6 21.8 13.6768 21.8 15V17.4H17Z"
                                          fill="#6C757D"/>
                                </g>
                            </svg>
                        </span>
                    </div>
                    <input
                        type="password"
                        placeholder="Password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                        autoComplete="current-password"
                    />
                </div>
                <div className="align-self-start">{errors.password && <div className="text-danger mb-3">{errors.password}</div>}</div>

                <div className="form-check align-self-start mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                </div>

                <button type="submit" className="btn btn-primary" disabled={Object.keys(errors).length > 0}>
                    Login
                </button>
                <p className="mt-4">
                    Don’t have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
