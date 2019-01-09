![travis](https://travis-ci.org/sandboxneu/psych-backend.svg?branch=master)
# Sandbox Psych Backend

A simple shared backend to run Northeastern Sandbox's custom online psychology experiments.

## Usage

There is a separate server instance for each project.

**Development environment:** `https://api.sandboxneu.com/test`

**Predictive Affect project:** `https://api.sandboxneu.com/predictive-affect`

**Allostasis Game project:** `https://api.sandboxneu.com/allostasis-game`

**Empathic Accuracy Project:** `https://api.sandboxneu.com/empathic-accuracy`

Use the development environment to test so you don't interfere with real collected experiment data. 

### Endpoints

`GET /experiment` to download config file

`POST /experiment` with multipart/form-data and the config in the file field to upload config

`GET /data` to download zip of data files

`POST /data` with multipart/form-data and the config in the file field to upload data

See [example](example/index.html) for much clearer info. Better docs needed!

## Setting Up Backend Locally

If you want to develop for the backend or just want a clean backend environment for testing, clone this repo.

Create a `.env` file containing a directory on your machine for storing config and collected data files. 

```
FILEDIR=/your/directory
```
On Windows you might need `\\` instead of `/`. Not sure.

## Running Backend Locally

Development: `npm run dev`

Production: `npm start`

Testing: `npm test`

## Digital Ocean Setup

Pushing to master deploys to Digital Ocean server.

1. Push to master
2. Travis runs tests
3. If tests pass, and the branch is master, Travis pushes the repo to the Digital Ocean server using Git over SSH. Travis has the SSH private key as an [encrypted environment variable](https://docs.travis-ci.com/user/environment-variables/#defining-encrypted-variables-in-travisyml).
4. The repo on the Digital Ocean server has a post-receive hook that starts an instance of the server for each project on different ports.
5. Nginx runs as a reverse proxy to (a) route requests to the right port, ie. api.sandboxneu.com/empathic-accuracy goes to the instance on port 3000 (b) handle all HTTPS work (I used `certbot --nginx` to generate cert with LetsEncrypt as well as configure nginx.conf).


For Travis, I roughly followed [this tutorial](https://kjaer.io/travis/)

Git bare repo is in /var/www/psych-backend/src.git

The server-side post-receive hook:
```bash
#!/bin/bash

echo ‘post-receive: Triggered.’

cd /var/www/psych-backend/live

echo ‘post-receive: git check out…’

git --git-dir=/var/www/psych-backend/src.git --work-tree=/var/www/psych-backend/live checkout master -f

echo ‘post-receive: npm install…’

npm install \
&& echo ‘post-receive: → done.’ \
&& (pm2 delete /psych-backend-by-githook.*/ || true) \
&& NODE_ENV=production PORT=3000 FILEDIR=/var/www/psych-backend/files0 pm2 start npm --name psych-backend-by-githook0 -- start \
&& NODE_ENV=production PORT=3001 FILEDIR=/var/www/psych-backend/files1 pm2 start npm --name psych-backend-by-githook1 -- start \
&& NODE_ENV=production PORT=3002 FILEDIR=/var/www/psych-backend/files2 pm2 start npm --name psych-backend-by-githook2 -- start \
&& NODE_ENV=production PORT=3003 FILEDIR=/var/www/psych-backend/files3 pm2 start npm --name psych-backend-by-githook3 -- start \
&& echo ‘post-receive: app started successfully with pm2.
```

The nginx config is in /etc/nginx/sites-available/api.sandbox.com

I followed [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-let-s-encrypt-with-nginx-server-blocks-on-ubuntu-16-04) for nginx.
