'use strict';

var morgan = require('morgan');
var server = require('./server');

function config (app) {
  app.set('clientPath', server.root + '/client');
  app.use(morgan('dev'));
}

module.exports = config;