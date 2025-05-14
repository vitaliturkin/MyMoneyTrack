import AuthService from './AuthService';

const request = async (url, method = 'GET', body = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        headers['x-auth-token'] = accessToken;
    }

    const params = { method, headers };
    if (body) {
        params.body = JSON.stringify(body);
    }

    let response = await fetch(url, params);

    if (response.status === 401) {
        console.warn('Unauthorized. Redirecting to login...');
        AuthService.removeAuthInfo(); // clearing user data
        window.location.href = "/login";
        return null;
    }

    // generic error handling
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { error: "Unexpected error occurred" };
        }

        console.error(`API Error (${response.status}):`, errorData);
        throw new Error(errorData.error || "Something went wrong");
    }

    return response.json();
};

const CustomHttp = { request };
export default CustomHttp;
