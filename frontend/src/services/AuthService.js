const TOKEN_KEY = 'accessToken';
const USER_INFO_KEY = 'userInfo';

// checking if the user is logged in by verifying the presence of the access token.
const isLoggedIn = () => {
    return !!localStorage.getItem(TOKEN_KEY);
};

// storing authentication token and user info in localStorage.
const setAuthInfo = (token, userInfo = null) => {
    localStorage.setItem(TOKEN_KEY, token);
    if (userInfo) {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    }
};

// removing authentication token and user info from localStorage.

const removeAuthInfo = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem("dateFilter");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
};

// retrieving stored user info from localStorage.
const getUserInfo = () => {
    const userData = localStorage.getItem(USER_INFO_KEY);
    return userData ? JSON.parse(userData) : null;
};

// exporting all functions as a plain object
const AuthService = {
    isLoggedIn,
    setAuthInfo,
    removeAuthInfo,
    getUserInfo
};

export default AuthService;
