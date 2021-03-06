#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)

if [[ (($TRAVIS_BRANCH == 'master') || ($TRAVIS_BRANCH == 'staging')) && ($TRAVIS_PULL_REQUEST == 'false') ]]; then
  chmod 600 sandbox-deploy-key
  mv sandbox-deploy-key ~/.ssh/id_rsa
  git remote add deploy "deploy@142.93.49.129:/var/www/psych-backend/"$TRAVIS_BRANCH"/.git"
  git config user.name "Travis CI"
  git config user.email "dajinchu+travisCI@gmail.com"
  
  git push --force deploy $TRAVIS_BRANCH
else
  echo "Not deploying, since this branch isn't master or staging."
fi
