'use strict';

var jwt = require('jsonwebtoken');
var config = require('../../config/server');
var util = require('../util')
var User = require('../../models/user.model').model;
var Users = require('../../models/user.model').collection;
var controller = {};

controller.index = function (req, res) {
  Users.forge()
  .fetch()
  .then(function (users) {
    return util.send200(res, users.stripPasswords());
  }).catch(function () {
    return util.send500(res);
  });
};

controller.create = function (req, res) {
  var password = req.body.password;
  var newUser = User.forge();
  return newUser.hashPassword(password)
  .then(function (hash) {
    req.body.password = hash;
    return req.body;
  }).then(function (userData) {
    return newUser.set(userData).save();
  }).then(function (user) {
    var token = jwt.sign({id: user.id }, config.sessionSecret, { expiresInMinutes: 60*5 });
    return util.send200(res, {token: token});
  }).catch(function(error) {
    if (error.code === '23505') {
      return util.send400(res, 'username already exists');
    }
    if (error.message === 'password length') {
      return util.send400(res, 'Password should be atleast 8 characters')
    }
    if (error.message === 'hash error') {
      return util.send500(res, 'Error in storing user data')
    }
    return util.send500(res, 'Error in server')
  });
};

User.forge({id: '47'})
  .fetch()
  .then(function (user) {
    console.log(user)
  })

controller.show = function (req, res) {
  return User.forge({id: req.params.id})
  .fetch()
  .then(function (user) {
    if (!user) {
      return util.send404(res, 'id:' + req.params.id + ' not found')
    }
    return util.send200(res, user.stripPassword())
  }).catch(function (error) {
    return util.send500(res, 'Error in server')
  })
};

controller.updateRole = function (req, res) {
  if (['user', 'manager', 'admin'].indexOf(req.body.role) === -1) {
    return util.send400(res, 'send valid role')
  }

  return User.forge({id: req.params.id})
  .save({
    role:req.body.role
  }, {patch: true})
  .then(function (user) {
    if (!user) {
      throw new Error('not found');
    }

    return util.send200(res, user.stripPassword())
  }).catch(function (error) {
    if (error.message === 'not found') {
      return util.send400(res, 'id:' + req.params.id + ' not found')
    }
    if (error.message === 'invalid role') {
    }
    return util.send500(res, 'Error in server')
  })
}

module.exports = controller;