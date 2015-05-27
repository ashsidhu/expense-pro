'use strict';

// var errors = require('./components/errors');
var express = require('express');

module.exports = function(app) {
  app.use('/api/expenses', require('./api/expense'));
  app.use('/api/users', require('./api/user'));

  // All undefined asset or api routes should return a 404
  // app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  //  .get(errors[404]);

  // All other routes should redirect to the index.html
  app.get('/*', function(req, res) {
    res.sendFile(app.get('clientPath') + '/index.html');
  });
};