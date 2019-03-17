const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const experiment = require('./src/experiment');
const data = require('./src/data');
const { hashAndStore, authMiddleware } = require('./src/authentication');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(fileUpload());
app.use(cors()); // Allow cross-origin requests since frontend is on different domain than backend.
app.use('/experiment', experiment());
app.use('/data', data());

app.post('/password', authMiddleware);
app.post('/password', (req, res) => {
  hashAndStore(req.query.newPassword);
  res.status(200).send('New password set');
});

/* eslint no-console: "off" */
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
