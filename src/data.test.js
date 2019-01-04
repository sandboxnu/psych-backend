const express = require('express');
const fileUpload = require('express-fileupload');
const request = require('supertest');
const data = require('./data');

const app = express();
app.use(fileUpload());
app.use(data());

test('GET data should succeed with zip Content-Type', async () => {
  await request(app)
    .get('/')
    .expect('Content-Type', 'application/zip')
    .expect(200);
});

test('POST data file should succeed', async () => {
  await request(app)
    .post('/')
    .attach('file', Buffer.from('heyheyhey'), 'data.txt')
    .expect(200);
});

test('POST data with no file should fail', async () => {
  await request(app)
    .post('/')
    .expect(400);
});

test('POST data with no file name should fail', async () => {
  await request(app)
    .post('/')
    .attach('file', Buffer.from('heyheyhey'))
    .expect(400);
});

// No good way to test the zip data. The lib used to zip files reads actual files.
//  Extracting zip files programmatically is also a hassle.
// Probaby just need to mock the archiver and file middleware but its not worth it.
