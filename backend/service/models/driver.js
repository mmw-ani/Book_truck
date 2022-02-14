const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookedVehicle = new schema({
	dealerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dealer'
	},
	date: String,
	from: String,
	to: String
});

const travellingRoute = new schema({
	fromCity: String,
	fromState: String,
	toCity: String,
	toState: String
});

const driverModel = new schema({
	name: {
		type: String,
		required: true
	},
	mobileNumber: {
		type: Number,
		required: true
	},
	age: Number,
	vehicleNumber: String,
	capacity: Number,
	transporter: String,
	experience: Number,
	preferredRoutes: [travellingRoute],
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
	bookings: [bookedVehicle]
});

module.exports = mongoose.model('Driver', driverModel);
