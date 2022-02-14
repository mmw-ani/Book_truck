const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookingModel = new schema({
	driverId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Driver'
	},
	from: String,
	to: String,
	date: String
});

const Booking = mongoose.model('Booking', bookingModel);

const dealerModel = new schema({
	name: {
		type: String,
		required: true
	},
	mobileNumber: {
		type: Number,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	state: {
		type: String,
		required: true
	},
	natureOfMaterial: {
		type: String,
		required: true
	},
	weight: Number,
	quantity: Number,
	email: {
		type: String,
		unique: true,
		required: true
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String
	},
	otp: String,
	otpTriesLeft: Number,
	otpExpiryTime: Date,
	refreshToken: String,
	bookings: [bookingModel]
});

module.exports = mongoose.model('Dealer', dealerModel);
