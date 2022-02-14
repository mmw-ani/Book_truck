const Dealer = require('../models/dealer');
const bcrypt = require('bcrypt');
const { generateRefreshToken, generateAccessToken, generateOtp, mailSender } = require('../utils');
const Driver = require('../models/driver');

const register = async (req, res) => {
	const newUserData = req.body;
	try {
		const isUsernameAlreadyExist = await Dealer.findOne({ username: newUserData.username });
		const isEmailAlreadyExist = await Dealer.findOne({ email: newUserData.email });
		if (isEmailAlreadyExist || isUsernameAlreadyExist) {
			return res.status(400).json({ message: 'Username/Email already exists!' });
		}
		const hashedPassword = await bcrypt.hash(newUserData.password, 10);
		const newDealerData = {
			name: newUserData.name,
			mobileNumber: newUserData.mobileNumber,
			city: newUserData.city,
			state: newUserData.state,
			natureOfMaterial: newUserData.natureOfMaterial,
			weight: newUserData.weight,
			quantity: newUserData.quantity,
			username: newUserData.username,
			email: newUserData.email,
			password: hashedPassword
		};
		await Dealer.create(newDealerData);
		return res.json({ message: 'Registered Successfully' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const loginByUsername = async (req, res) => {
	const userData = req.body;
	try {
		const dealerData = await Dealer.findOne({ username: userData.username });
		if (!dealerData) {
			return res.status(401).json({ message: 'Username not found' });
		}
		const matchPassword = await bcrypt.compare(userData.password, dealerData.password);
		if (!matchPassword) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const payload = {
			user: {
				id: dealerData.id,
				username: dealerData.username,
				role: 'dealer'
			}
		};

		const token = generateAccessToken(payload);
		res.setHeader('auth_token', token);
		res.setHeader('Access-Control-Expose-Headers', '*');
		const refreshToken = generateRefreshToken(payload);
		dealerData.refreshToken = refreshToken;
		await dealerData.save();
		return res.send({ message: 'Logged in successfully', user: payload.user });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
const loginByEmail = async (req, res) => {
	const email = req.body.email;
	try {
		const dealerData = await Dealer.findOne({ email: email });
		if (!dealerData) {
			return res.status(401).json({ message: 'User not Found' });
		}
		const otp = generateOtp();
		await mailSender(email, otp);
		dealerData.otp = otp;
		dealerData.otpExpiryTime = new Date(Date.now() + 30 * 60 * 1000);
		dealerData.otpTriesLeft = 5;
		await dealerData.save();
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
		const dealerData = await Dealer.findOne({ email: email });
		if (!dealerData) {
			return res.status(401).json({ message: 'User not Found' });
		}
		if (dealerData.otp === otp && dealerData.otpExpiryTime > new Date()) {
			const payload = {
				user: {
					id: dealerData.id,
					username: dealerData.username,
					login: 'dealer'
				}
			};

			const token = generateAccessToken(payload);
			res.setHeader('auth_token', token);
			res.setHeader('Access-Control-Expose-Headers', '*');
			const refreshToken = generateRefreshToken(payload);
			dealerData.refreshToken = refreshToken;
			dealerData.otp = null;
			dealerData.otpExpiryTime = null;
			await dealerData.save();
			return res.send({ message: 'Logged in successfully' });
		}
		dealerData.otpTriesLeft--;
		await dealerData.save();
		return res.status(400).json({ message: 'Wrong OTP/ OTP Expired' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const dashboardPage = async (req, res) => {
	try {
		const userData = req.userData;
		const dealer = await Dealer.findById(userData.id);
		if (!dealer) {
			return res.status(401).json({ message: 'No user found' });
		}
		const drivers = await Driver.find();
		const filteredDriver = drivers
			.filter((eachDriver) => {
				const preferredRoutes = eachDriver.preferredRoutes;
				for (let routes of preferredRoutes) {
					if ((routes.fromCity === dealer.city && routes.fromState === dealer.state) || (routes.toCity === dealer.city && routes.toState === dealer.state)) {
						return true;
					}
				}
				return false;
			})
			.map((eachDriver) => {
				return {
					name: eachDriver.name,
					age: eachDriver.age,
					vehicleNumber: eachDriver.vehicleNumber,
					mobileNumber: eachDriver.mobileNumber,
					transporter: eachDriver.transporter,
					experience: eachDriver.experience,
					capacity: eachDriver.capacity,
					preferredRoutes: eachDriver.preferredRoutes,
					id: eachDriver._id
				};
			});
		res.json({ message: filteredDriver });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const bookDriver = async (req, res) => {
	const userData = req.userData;
	const bookingDetails = req.body;
	try {
		const dealer = await Dealer.findOne({ _id: userData.id });
		const driver = await Driver.findOne({ _id: bookingDetails.id });
		if (!dealer || !driver) {
			return res.status(400).json({ message: 'An error has occured' });
		}
		const details = driver.preferredRoutes.find((item) => {
			const temp = item.id;
			return temp === bookingDetails.bookingId;
		});
		const from = `${details.fromCity}, ${details.fromState}`;
		const to = `${details.toCity}, ${details.toState}`;
		const date = bookingDetails.date;

		dealer.bookings.push({ driverId: driver.id, from, to, date });
		driver.bookings.push({ dealerId: dealer.id, from, to, date });
		await dealer.save();
		await driver.save();
		return res.json({ message: 'Driver booked Successfully' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const getBookings = async (req, res) => {
	const userData = req.userData;

	if (userData.role !== 'dealer') {
		return res.json({ message: 'An error had occured' });
	}
	try {
		const userDetail = await Dealer.findOne({ _id: userData.id }).populate('bookings.driverId');
		const allBookings = userDetail.bookings;
		const allBookingsResponse = allBookings.map((booking) => {
			return {
				id: booking.driverId._id,
				name: booking.driverId.name,
				mobileNumber: booking.driverId.mobileNumber,
				age: booking.driverId.age,
				vehicleNumber: booking.driverId.vehicleNumber,
				capacity: booking.driverId.capacity,
				experience: booking.driverId.experience,
				transporter: booking.driverId.transporter,
				from: booking.from,
				to: booking.to,
				date: booking?.date
			};
		});
		return res.json({ message: allBookingsResponse });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

module.exports = {
	register,
	loginByUsername,
	loginByEmail,
	loginVerifyOTP,
	dashboardPage,
	bookDriver,
	getBookings
};
