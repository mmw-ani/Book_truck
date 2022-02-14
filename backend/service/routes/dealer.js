const express = require('express');
const router = express.Router();
const dealerController = require('../controllers/dealer');
const { authentication } = require('../utils');

router
	.post('/register', dealerController.register)
	.post('/login/username', dealerController.loginByUsername)
	.post('/login/email', dealerController.loginByEmail)
	.post('/login/email/verify', dealerController.loginVerifyOTP)
	.get('/dashboard', authentication, dealerController.dashboardPage)
	.post('/book-driver', authentication, dealerController.bookDriver)
	.get('/bookings', authentication, dealerController.getBookings);

module.exports = router;
