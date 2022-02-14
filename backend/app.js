const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const dealerRoute = require('./service/routes/dealer');
const driverRoute = require('./service/routes/driver');
const cors = require('cors');
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const initialServerAndDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		app.listen(PORT, () => {
			console.log('Server started and DB connected');
		});
	} catch (err) {
		console.log('Error connecting to Db ' + err);
	}
};
initialServerAndDB();
app.use(express.json());
app.use('/dealer', dealerRoute);
app.use('/driver', driverRoute);

app.get('/', (req, res) => {
	res.send('Hello');
});
