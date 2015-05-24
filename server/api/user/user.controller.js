'use strict';

var util = require('../util')
var User = require('../../models/user.model')
var controller = {};

controller.index = function (req, res) {
  User.fetchAll()
  .then(function (collection) {
    res.json(collection)
  }).catch(function () {
    util.send500(res);
  })
}

controller.create = function (req, res) {
  var password = req.body.password;
  var newUser = User.forge();
  return newUser.hashPassword(password)
  .then(function (hash) {
    req.body.password = hash;
    return req.body;
  }).then(function (userData) {
    return newUser.set(userData).save();
  }).then(function () {
    // set jwt
    return util.send200(res);
  }).catch(function(error) {
    if (error.code === '23505') {
      return util.send400(res, 'username already exists');
    }
    if (error.message === 'password length') {
      return util.send400(res, 'Password should be atleast 8 characters')
    }
    if (error.message === 'hash') {
      return util.send500(res, 'Error in storing user data')
    }
    return util.send500(res, 'Error in server')
  });
}

module.exports = controller;