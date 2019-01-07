![travis](https://travis-ci.org/sandboxneu/psych-backend.svg?branch=master)
# Sandbox Psych Backend

A simple shared backend to run Northeastern Sandbox's custom online psychology experiments.

## Required Setup

Create a `.env` file containing a directory on your machine for storing config and collected data files. 

```
FILEDIR=/your/directory
```
On Windows you might need `\\` instead of `/`. Not sure.

## Running

Development: `npm run dev`

Production: `npm start`

Testing: `npm test`

## Deployment

Pushing to master deploys to Digital Ocean server running the projects on different ports:

**Development environment:** `142.93.49.129:3000`

**Image project:** `142.93.49.129:3001`

**Game project:** `142.93.49.129:3002`

**Video project:** `142.93.49.129:3003`

Use the development environment first because the other three are for PRODUCTION.

## Usage

`GET /experiment` to download config file

`POST /experiment` with multipart/form-data and the config in the file field to upload config

`GET /data` to download zip of data files

`POST /data` with multipart/form-data and the config in the file field to upload data

See [example](example/index.html) for much clearer info. Better docs needed!
