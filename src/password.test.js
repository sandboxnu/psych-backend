const express = require('express');
const bodyParser = require('body-parser');
const request = require('supertest');
const fse = require('fs-extra');
const path = require('path');
require('dotenv').config();

process.env.FILEDIR = path.join(process.env.FILEDIR, 'test');
const TESTDIR = process.env.FILEDIR;
const HASHFILE = path.join(TESTDIR, 'passwordHash.txt');
const { verify, hashAndStore, changePassword } = require('./authentication');

beforeEach(async () => {
  fse.ensureDirSync(TESTDIR);
  fse.emptyDirSync(TESTDIR);
});

afterAll(() => {
  fse.removeSync(TESTDIR);
});

const app = express();
app.use(bodyParser.json());
app.post('/', changePassword);

test('set initial password when no password file', async () => {
  await request(app)
    .post('/')
    .send({ newPassword: 'new' })
    .expect(200);
  expect(await verify('new')).toBeTruthy();
});

test('set initial password when password file empty', async () => {
  fse.createFile(HASHFILE);
  await request(app)
    .post('/')
    .send({ newPassword: 'new' })
    .expect(200);
  expect(await verify('new')).toBeTruthy();
});

test('change password using old password', async () => {
  await hashAndStore('old');
  await request(app)
    .post('/')
    .auth('', 'old')
    .send({ newPassword: 'new' })
    .expect(200);
  expect(await verify('new')).toBeTruthy();
});

test('reject change password with wrong old password', async () => {
  await hashAndStore('old');
  await request(app)
    .post('/')
    .auth('', '')
    .send({ newPassword: 'new' })
    .expect(401);
  expect(await verify('old')).toBeTruthy();
});

test('reject change password with no supplied old password', async () => {
  await hashAndStore('old');
  await request(app)
    .post('/')
    .send({ newPassword: 'new' })
    .expect(401);
  expect(await verify('old')).toBeTruthy();
});

test('400 if supplied no old or new passwords', async () => {
  await request(app)
    .post('/')
    .expect('Must provide newPassword')
    .expect(400);
});

test('400 if supplied no new passwords', async () => {
  await request(app)
    .post('/')
    .send({ garbage: 'no' })
    .expect('Must provide newPassword')
    .expect(400);
});
