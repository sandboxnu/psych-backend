const express = require('express');
const fileUpload = require('express-fileupload');
const request = require('supertest');
const fse = require('fs-extra');
require('dotenv').config();

process.env.FILEDIR = `${process.env.FILEDIR}/test`;
const TESTDIR = process.env.FILEDIR;
const data = require('./data');

afterEach(() => {
  fse.emptyDirSync(TESTDIR);
  fse.ensureDirSync(`${TESTDIR}/data`);
});

afterAll(() => {
  fse.remove(TESTDIR);
});

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

test('POST data with wrong field name should fail', async () => {
  await request(app)
    .post('/')
    .attach('WRONG', Buffer.from('heyheyhey'))
    .expect(400);
});

test('POST data with no file name should fail', async () => {
  await request(app)
    .post('/')
    .attach('file', Buffer.from('heyheyhey'))
    .expect(400);
});

// TODO: test the contents of the zip.
// TODO: mock the file system instead of using a tmp folder.
