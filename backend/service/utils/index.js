const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const generateAccessToken = (payload) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });
	return token;
};

const generateRefreshToken = (payload) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });
	return token;
};

const generateOtp = () => {
	return Math.floor(Math.random() * 1000000)
		.toString()
		.padStart(6, '0');
};

const authentication = async (req, res, next) => {
	const authorization = req.headers.authorization;
	if (authorization) {
		const jwtToken = authorization.split(' ')[1];
		if (!jwtToken) {
			return res.status(401).json({ message: 'No token found' });
		}
		jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
			if (err || !decodedToken) {
				return res.status(401).json({ message: 'Session Expired' });
			}
			req.userData = decodedToken.user;
			next();
		});
	} else {
		return res.status(401).json({ message: 'No Token found' });
	}
};
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	service: 'Gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
});
const mailSender = async (email, otp) => {
	const mailOption = {
		to: email,
		subject: 'Otp for registration is: ',
		html: '<h3>OTP for account verification is </h3>' + "<h1 style='font-weight:bold;'>" + otp + '</h1>' // html bod
	};
	await transporter.sendMail(mailOption);
	return;
};
module.exports = {
	generateAccessToken,
	generateRefreshToken,
	generateOtp,
	authentication,
	mailSender
};
