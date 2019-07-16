const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const fse = require('fs-extra');
require('dotenv').config();
var mongoose = require('mongoose');
const path = require('path');

const { server } = require('../server.js');

process.env.FILEDIR = `${process.env.FILEDIR}/test`;
const TESTDIR = process.env.FILEDIR;
const data = require('./data');
const { hashAndStore } = require('./authentication');

const tempPassword = 'sandboxNEU';

beforeEach(async () => {
  fse.emptyDirSync(TESTDIR);
  await hashAndStore(tempPassword);
  fse.ensureDirSync(`${TESTDIR}/data`);
});

afterAll(async () => {
  fse.removeSync(TESTDIR);
  await server.close();
  await mongoose.disconnect();
});

const app = express();
app.use(bodyParser.json());
app.use(data());

test('GET data (correct password) should succeed with json Content-Type', async () => {
  await request(app)
    .get('/')
    .auth('', tempPassword)
    .expect('Content-Type', "application/json; charset=utf-8")
    .expect(200);
});

test('GET data (wrong password) should fail', async () => {
  await request(app)
    .get('/')
    .auth('', 'wrong password')
    .expect(401);
});

test('GET data (no password) should fail', async () => {
  await request(app)
    .get('/')
    .expect(401);
});

test('GET data (no password stored) should fail', async () => {
  await fse.emptyDir(TESTDIR, err => {
    if (err) return console.error(err)
  });
  //this is a hack--need to figure out why password file appears in project root.
  await fse.remove(`${process.env.FILEDIR}/../passwordHash.txt`, err => {
    if (err) return console.error(err)
  });
  await request(app)
    .get('/')
    .auth('', tempPassword)
    .expect(401);
});

test('POST with json data should succeed', async () => {
  await request(app)
    .post('/')
    .set('Content-Type', 'application/json')
    .send({ 'data': "sandboxNEU", 'configID': 1 })
    .expect(200, 'Data saved');
});

test('POST data with no data should fail', async (done) => {
  await request(app)
    .post('/')
    .expect(400);
  done()
});

test('POST a data file should fail', async (done) => {
  await request(app)
    .post('/')
    .attach('file', Buffer.from('heyheyhey'), 'data.txt')
    .expect(400);
  done()
});

// TODO: test the contents of the zip.
// TODO: mock the file system instead of using a tmp folder.
