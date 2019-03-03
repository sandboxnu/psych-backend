const express = require('express');
const fileUpload = require('express-fileupload');
const request = require('supertest');
const fse = require('fs-extra');
const { hashAndStore, verify } = require('./authentication');
require('dotenv').config();


process.env.FILEDIR = `${process.env.FILEDIR}/test`;
const TESTDIR = process.env.FILEDIR;
const data = require('./data');

const tempPassword = "sandboxNEU";

beforeEach(() => {
  fse.emptyDirSync(TESTDIR);
  hashAndStore(tempPassword);
  fse.ensureDirSync(`${TESTDIR}/data`);
});

afterAll(() => {
  fse.remove(TESTDIR);
});

const app = express();
app.use(fileUpload());
app.use(data());

test('GET data (correct password) should succeed with zip Content-Type', async () => {
  await request(app)
    .get('/')
    .query({ password : tempPassword})
    .expect('Content-Type', 'application/zip')
    .expect(200);
});

test('GET data (wrong password) should fail', async () => {
  await request(app)
    .get('/')
    .query({ password : "wrong password"})
    .expect('Incorrect password')
    .expect(401);
});

test('POST data file (correct password) should succeed', async () => {
  await request(app)
    .post('/')
    .query({ password : tempPassword})
    .attach('file', Buffer.from('heyheyhey'), 'data.txt')
    .expect(200);
});


test('Post data file (wrong password) should fail', async () => {
  await request(app)
    .post('/')
    .query({ password : "wrong password"})
    .attach('file', Buffer.from('heyheyhey'), 'data.txt')
    .expect('Incorrect password')
    .expect(401);
});

test('POST data with no file should fail', async () => {
  await request(app)
    .post('/')
    .query({ password : tempPassword})
    .expect(400);
});

test('POST data with wrong field name should fail', async () => {
  await request(app)
    .post('/')
    .query({ password : tempPassword})
    .attach('WRONG', Buffer.from('heyheyhey'))
    .expect(400);
});

test('POST data with no file name should fail', async () => {
  await request(app)
    .post('/')
    .query({ password : tempPassword})
    .attach('file', Buffer.from('heyheyhey'))
    .expect(400);
});

// TODO: test the contents of the zip.
// TODO: mock the file system instead of using a tmp folder.
