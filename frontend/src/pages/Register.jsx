import React, {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import CustomHttp from '../services/CustomHttp';
import AuthService from '../services/AuthService';
import config from '../config/config';

// Regex patterns
const nameRegex = /^[A-Z][a-z]+\s[A-Z][a-z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    // errors
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    // tracking if a field has been interacted
    const [touched, setTouched] = useState({
        fullName: false,
        email: false,
        password: false,
        passwordRepeat: false
    });

    // redirecting if already logged in
    useEffect(() => {
        if (AuthService.isLoggedIn()) {
            navigate('/');
        }
    }, [navigate]);

    // validating input fields
    useEffect(() => {
        const errors = {};

        if (touched.fullName && !nameRegex.test(fullName.trim())) {
            errors.fullName = 'Full name must be in "John Smith" format.';
        }

        if (touched.email && !emailRegex.test(email.trim())) {
            errors.email = 'Invalid email format.';
        }

        if (touched.password && !passwordRegex.test(password.trim())) {
            errors.password = 'Password must be at least 8 characters, include 1 uppercase letter and 1 number.';
        }

        if (touched.passwordRepeat && passwordRepeat.trim() !== password.trim()) {
            errors.passwordRepeat = 'Passwords do not match.';
        }

        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    }, [fullName, email, password, passwordRepeat, touched]);

    // handling form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            const nameParts = fullName.split(' ');

            const result = await CustomHttp.request(`${config.host}/api/auth/register`, 'POST', {
                name: nameParts[0] || '',
                lastName: nameParts[1] || '',
                email: email.trim(),
                password: password.trim(),
                passwordRepeat: passwordRepeat.trim(),
            });

            if (result?.error || !result?.user) {
                throw new Error(result.message || 'Registration error');
            }

            // if the backend returns tokens
            if (result.token && result.user) {
                AuthService.setAuthInfo(result.token, {
                    name: result.user.name,
                    lastName: result.user.lastName,
                    userId: result.user.id,
                    email: result.user.email,
                });

                navigate('/');
            } else {
                throw new Error("Registration successful, but token or user data missing.");
            }
        } catch (error) {
            setErrors((prev) => ({...prev, form: error.message || 'Registration failed'}));
        }
    };

    return (
        <div className="container">
            <form className="form d-grid mx-auto d-flex flex-column align-items-center mt-5" onSubmit={handleSubmit} noValidate>
                <a href="/login" className="text-decoration-none mb-5">
                    <img className="form-img mb-6" src="/images/logo.png" alt="Logo"/>
                </a>
                <h1 className="form-title mb-4">Register</h1>
                {errors.form && <div className="alert alert-danger">{errors.form}</div>}

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="#6C757D">
                                 <g clip-path="url(#clip0_15_254)">
                                  <path
                                      d="M19 19C20.0609 19 21.0783 18.5786 21.8284 17.8284C22.5786 17.0783 23 16.0609 23 15C23 13.9391 22.5786 12.9217 21.8284 12.1716C21.0783 11.4214 20.0609 11 19 11C17.9391 11 16.9217 11.4214 16.1716 12.1716C15.4214 12.9217 15 13.9391 15 15C15 16.0609 15.4214 17.0783 16.1716 17.8284C16.9217 18.5786 17.9391 19 19 19ZM21.6667 15C21.6667 15.7072 21.3857 16.3855 20.8856 16.8856C20.3855 17.3857 19.7072 17.6667 19 17.6667C18.2928 17.6667 17.6145 17.3857 17.1144 16.8856C16.6143 16.3855 16.3333 15.7072 16.3333 15C16.3333 14.2928 16.6143 13.6145 17.1144 13.1144C17.6145 12.6143 18.2928 12.3333 19 12.3333C19.7072 12.3333 20.3855 12.6143 20.8856 13.1144C21.3857 13.6145 21.6667 14.2928 21.6667 15ZM27 25.6667C27 27 25.6667 27 25.6667 27H12.3333C12.3333 27 11 27 11 25.6667C11 24.3333 12.3333 20.3333 19 20.3333C25.6667 20.3333 27 24.3333 27 25.6667ZM25.6667 25.6613C25.6653 25.3333 25.4613 24.3467 24.5573 23.4427C23.688 22.5733 22.052 21.6667 19 21.6667C15.9467 21.6667 14.312 22.5733 13.4427 23.4427C12.5387 24.3467 12.336 25.3333 12.3333 25.6613H25.6667Z"
                                      fill="#6C757D"/>
                                 </g>
                            </svg>
                        </span>
                    </div>
                    <label htmlFor="register-fullname" className="form-label"></label>
                    <input
                        type="text"
                        placeholder={'Full Name'}
                        id="register-fullname"
                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => setTouched((prev) => ({...prev, fullName: true}))}
                        autoComplete="fullname"
                    />
                </div>
                <div className="align-self-start">
                    {errors.fullName && <div className="text-danger mb-3">{errors.fullName}</div>}
                </div>


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
                    <label htmlFor="register-email" className="form-label"></label>
                    <input
                        type="email"
                        placeholder={'Email'}
                        id="register-email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((prev) => ({...prev, email: true}))}
                        autoComplete="username"
                    />
                </div>
                <div className="align-self-start">
                    {errors.email && <div className="text-danger mb-3">{errors.email}</div>}
                </div>

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
                    <label htmlFor="register-password" className="form-label"></label>
                    <input
                        type="password"
                        placeholder={'Password'}
                        id="register-password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((prev) => ({...prev, password: true}))}
                        autoComplete="current-password"
                    />
                </div>
                <div className="align-self-start">
                    {errors.password && <div className="text-danger mb-3">{errors.password}</div>}
                </div>

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
                    <label htmlFor="register-password-repeat" className="form-label"></label>
                    <input
                        type="password"
                        placeholder={'Confirm Password'}
                        id="register-password-repeat"
                        className={`form-control ${errors.passwordRepeat ? 'is-invalid' : ''}`}
                        value={passwordRepeat}
                        onChange={(e) => setPasswordRepeat(e.target.value)}
                        onBlur={() => setTouched((prev) => ({...prev, passwordRepeat: true}))}
                    />
                </div>
                <div className="align-self-start">
                    {errors.passwordRepeat && <div className="text-danger">{errors.passwordRepeat}</div>}
                </div>

                <button type="submit" className="btn btn-primary" disabled={!isFormValid}>
                    Sign Up
                </button>

                <p className="mt-3">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
