'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var anagram = require('./lib/anagram');

app.use(morgan('dev'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', require('./lib/routes'));

anagram.load();

app.listen(3000, function() {
  console.log("Listening on port 3000");
});


module.exports = app;
