const localStorageService = {
    getToken: () => localStorage.getItem('token'),
    getUserInfo: () => {
        const userInfoString = localStorage.getItem('userInfo');
        return userInfoString ? JSON.parse(userInfoString) : null; // Parse JSON if it exists
    },
    setToken: (token) => localStorage.setItem('token', token),
    setUserInfo: (userInfo) => localStorage.setItem('userInfo', JSON.stringify(userInfo)), // Store as JSON
    clear: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
    },
};

export default localStorageService;
