import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_URL
});

axiosInstance.interceptors.request.use((req) => {
	req.headers.Authorization = `Bearer ${getUserToken()}`;
	return req;
});

export const getUserToken = () => localStorage.getItem('token');

export const isUserLoggedIn = () => {
	if (getUserToken()) {
		return true;
	}
	return false;
};

export const loginUser = (formData, loginType) => axiosInstance.post(`/${loginType}/login/username`, formData);

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	window.location.reload();
};

export const getUserType = () => {
	return JSON.parse(localStorage.getItem('user'))?.role;
};

export const getUserDetails = () => JSON.parse(localStorage.getItem('user'));

export const registerUser = (formData, registerType) => axiosInstance.post(`/${registerType}/register`, formData);

export const dashboardPage = () => axiosInstance.get(`/${getUserType()}/dashboard`);

export const getDriverProfile = (id) => axiosInstance.get(`/driver/profile/${id}`);

export const bookingDriver = (formData) => axiosInstance.post('/dealer/book-driver', formData);

export const getBookingForDealer = () => axiosInstance.get('/dealer/bookings');

export const sendOtpForLogin = (formData, type) => axiosInstance.post(`/${type}/login/email`, formData);

export const verifyOTP = (formData, type) => axiosInstance.post(`/${type}/login/email/verify`, formData);
