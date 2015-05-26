'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var server = require('./server');

function config (app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.set('clientPath', server.root + '/client');
  app.use(morgan('dev'));
  app.use(express.static(app.get('clientPath')));
}

module.exports = config;