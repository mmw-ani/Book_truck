// const { validationResult } = require('express-validator');
const Driver = require('../models/driver');
const bcrypt = require('bcrypt');
const { generateRefreshToken, generateAccessToken, mailSender } = require('../utils');

const register = async (req, res) => {
	// const errors = validationResult(res);
	// if (!errors.isEmpty()) {
	// 	return res.status(422).json({ message: errors.array() });
	// }
	const newUserData = req.body;
	try {
		const isUsernameAlreadyExist = await Driver.findOne({ username: newUserData.username });
		const isEmailAlreadyExist = await Driver.findOne({ email: newUserData.email });
		if (isEmailAlreadyExist || isUsernameAlreadyExist) {
			return res.status(400).json({ message: 'Username/Email already exists!' });
		}
		const hashedPassword = await bcrypt.hash(newUserData.password, 10);
		const newDriverData = {
			name: newUserData.name,
			age: newUserData.age,
			vehicleNumber: newUserData.vehicleNumber,
			mobileNumber: newUserData.mobileNumber,
			capacity: newUserData.capacity,
			transporter: newUserData.transporter,
			experience: newUserData.experience,
			username: newUserData.username,
			email: newUserData.email,
			password: hashedPassword,
			preferredRoutes: newUserData.preferredRoutes
		};
		await Driver.create(newDriverData);
		return res.json({ message: 'Registered Successfully' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const login = async (req, res) => {
	const userData = req.body;
	try {
		const driverData = await Driver.findOne({ username: userData.username });
		if (!driverData) {
			return res.status(401).json({ message: 'Username not found' });
		}
		const matchPassword = await bcrypt.compare(userData.password, driverData.password);
		if (!matchPassword) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const payload = {
			user: {
				id: driverData.id,
				username: driverData.username,
				role: 'driver'
			}
		};

		const token = generateAccessToken(payload);
		res.setHeader('auth_token', token);
		res.setHeader('Access-Control-Expose-Headers', '*');
		const refreshToken = generateRefreshToken(payload);
		driverData.refreshToken = refreshToken;
		await driverData.save();
		return res.send({ message: 'Logged in successfully', user: payload.user });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const getDriverProfile = async (req, res) => {
	const driverId = req.params.id;
	try {
		const driverDetails = await Driver.findOne({ _id: driverId });
		if (!driverDetails) {
			return res.status(404).json({ message: 'No user found' });
		}
		const response = {
			name: driverDetails.name,
			age: driverDetails.age,
			vehicleNumber: driverDetails.vehicleNumber,
			mobileNumber: driverDetails.mobileNumber,
			transporter: driverDetails.transporter,
			experience: driverDetails.experience,
			capacity: driverDetails.capacity,
			preferredRoutes: driverDetails.preferredRoutes,
			id: driverDetails._id
		};
		return res.json({ message: response });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'An error had occured' });
	}
};

const getDriverDashboard = async (req, res) => {
	const userData = req.userData;
	if (userData.role !== 'driver') {
		return res.status(404).json({ message: 'An error had occured' });
	}
	try {
		const driverDetail = await Driver.findOne({ _id: userData.id }).populate('bookings.dealerId');
		const allBookings = driverDetail.bookings;
		const allBookingsResponse = allBookings.map((booking) => {
			return {
				name: booking.dealerId.name,
				mobileNumber: booking.dealerId.mobileNumber,
				natureOfMaterial: booking.dealerId.natureOfMaterial,
				weight: booking.dealerId.weight,
				quantity: booking.dealerId.quantity,
				from: booking.from,
				to: booking.to,
				date: booking?.date
			};
		});
		return res.json({ message: allBookingsResponse });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'An error had occured' });
	}
};
const loginByEmail = async (req, res) => {
	const email = req.body.email;
	try {
		const driverData = await Driver.findOne({ email: email });
		if (!driverData) {
			return res.status(401).json({ message: 'User not Found' });
		}
		const otp = generateOtp();
		await mailSender(email, otp);
		driverData.otp = otp;
		driverData.otpExpiryTime = new Date(Date.now() + 30 * 60 * 1000);
		driverData.otpTriesLeft = 5;
		await driverData.save();
		return res.json({ message: 'OTP sent!' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
const loginVerifyOTP = async (req, res) => {
	const email = req.body.email;
	const otp = req.body.otp;
	try {
		const driverData = await Driver.findOne({ email: email });
		if (!driverData) {
			return res.status(401).json({ message: 'User not Found' });
		}
		if (driverData.otp === otp && driverData.otpExpiryTime > new Date()) {
			const payload = {
				user: {
					id: driverData.id,
					username: driverData.username,
					login: 'dealer'
				}
			};

			const token = generateAccessToken(payload);
			res.setHeader('auth_token', token);
			res.setHeader('Access-Control-Expose-Headers', '*');
			const refreshToken = generateRefreshToken(payload);
			driverData.refreshToken = refreshToken;
			driverData.otp = null;
			driverData.otpExpiryTime = null;
			await driverData.save();
			return res.send({ message: 'Logged in successfully' });
		}
		driverData.otpTriesLeft--;
		await driverData.save();
		return res.status(400).json({ message: 'Wrong OTP/ OTP Expired' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

module.exports = {
	register,
	login,
	getDriverProfile,
	getDriverDashboard,
	loginByEmail,
	loginVerifyOTP
};
