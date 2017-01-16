'use strict';

var dynamoose = require('dynamoose');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var dictionary = require('./lib/dictionary');
// bug with dynamoose.  Shouldn't have to add this.
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var app = express();

app.use(morgan('dev'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', require('./lib/routes'));

// dictionary.load();  // WARNING, THIS TAKES SEVERAL HOURS.

app.listen(3000, function() {
  console.log("Listening on port 3000");
});

module.exports = app;
