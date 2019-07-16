const { Router } = require('express');
const path = require('path');
const archiver = require('archiver');
const sanitize = require('sanitize-filename');
const unusedFilename = require('unused-filename');
const { DATADIR } = require('./dirs');
const { authMiddleware } = require('./authentication');
const fs = require('fs');
const { timeStamp, completionCode } = require('./serverUtils');

var DataRecord = require('./models/DataRecord.model');

const collection = 'experiment_data'

module.exports = (router = new Router()) => {
  router.get('/', authMiddleware);
  router.get('/', (req, res) => {
    DataRecord.find({}).then(function(dataRecords) {
      var response = {};
      var count = 1;
      dataRecords.forEach(function(record) { 
        response[count] = JSON.parse(record["data"]);
        count += 1;
      });
      return Promise.all([response]);
    }).then(function(respArray) {
      res.status(200).set({
      'Content-Type': 'application/json',
      });
      res.send(respArray[0]);
    }).catch(function(error) {
      res.status(500).send(error);
    });
  });

  router.post('/', (req, res) => {
    const jsonData = req.body
    if (Object.keys(jsonData).length === 0) {
      return res.status(400).send('Malformed or bad data');
    }
    //we need the front end to tell us which config it used to run the experiment, since 
    //the researcher probably wants to know this to make sense of the data.
    const configID = jsonData['configID']
    const time = timeStamp()
    //some problem with this completion code
    //const completionID = completionCode()
    const completionID = "abcd";

    const data = new DataRecord({time: time, completionID: completionID, configID: configID, data: JSON.stringify(jsonData)});
    data.save(function (err, fluffy) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send('Data saved');
    });
    return false;
  });
  return router;
};
