'use strict';

var util = {};
var jwt = require('express-jwt')
var server = require('../config/server');

util.authenticate = jwt({
  secret: server.sessionSecret,
  getToken: function (req) {
    return req.headers.token;
  }
})

util.send200 = function (res, data) {
  data = data || 'OK';
  return res.status(200).json({
    error: false,
    data: data,
    length: Array.isArray(data) ? data.length : null
  });
};

util.send400 = function (res, message) {
  message = message || 'Bad Request';
  return res.status(400).json({
    error: true,
    data: message
  });
};

util.send403 = function (res, message) {
  message = message || 'Not permitted';
  return res.status(403).json({
    error: true,
    data: message
  });
};

util.send404 = function (res, message) {
  message = message || 'Resource Not Found';
  return res.status(404).json({
    error: true,
    data: message
  });
};

util.send500 = function (res, message) {
  message = message || 'Internal Server Error';
  return res.status(500).json({
    error: true,
    data: message
  });
};

module.exports = util;