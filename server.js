const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const experiment = require('./src/experiment');
const data = require('./src/data');
const { changePassword, authMiddleware } = require('./src/authentication');
var mongoose = require('mongoose');
const mongoOptions = {
	useNewUrlParser: true, 
	autoIndex: false, // Don't build indexes
	autoReconnect: true, //try to reconnect, when connection lost
	useFindAndModify: false 

}
const dbname = "experiment_data"
const uri = `mongodb://localhost:27017/${dbname}`

require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors()); // Allow cross-origin requests since frontend is on different domain than backend.
app.use('/experiment', experiment());
app.use('/data', data());

app.post('/password', changePassword);
app.post('/login', authMiddleware, (req, res) => { res.status(200).send('success'); });

/* eslint no-console: "off" */
mongoose.connect(uri, mongoOptions, (err) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
});

const server = app.listen(PORT, () => {
	console.log(`API running at http://localhost:${PORT}`);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

module.exports = { server }