const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const fse = require('fs-extra');
require('dotenv').config();

const { server } = require('../server.js');

process.env.FILEDIR = `${process.env.FILEDIR}/test`;
const TESTDIR = process.env.FILEDIR;
const experiment = require('./experiment');
const { hashAndStore } = require('./authentication');

var mongoose = require('mongoose');

const tempPassword = 'sandboxNEU';

beforeEach(async () => {
  fse.ensureDirSync(TESTDIR);
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
app.use(experiment());

test('GET experiment config (with password) should succeed', async () => {
  await request(app)
    .get('/')
    .auth('', tempPassword)
    .expect(200);
});

test('GET experiment config (without password) should fail', async () => {
  await request(app)
    .get('/')
    .expect(401);
});

test('POST experiment config with bad password should fail', async () => {
  await request(app)
    .post('/')
    .auth('', 'WRONG')
    .attach('file', Buffer.from('heyheyhey'))
    .expect(401);
});

test('POST experiment config (with password) should succeed', async () => {
  await request(app)
    .post('/')
    .set('Content-Type', 'application/json')
    .auth('', tempPassword)
    .send({ 'configData': "sandboxNEU" })
    .expect(200, 'Data saved');
});

test('POST experiment config (without password) should fail', async () => {
  await request(app)
    .post('/')
    .set('Content-Type', 'application/json')
    .send({ 'configData': "sandboxNEU" })
    .expect(401);
});

test('POST experiment config with file should succeed', async () => {
  await request(app)
    .post('/')
    .auth('', tempPassword)
    .attach('file', Buffer.from('heyheyhey'))
    .expect(400);
});
