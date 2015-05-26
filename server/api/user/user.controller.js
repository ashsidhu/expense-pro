'use strict';

var jwt = require('jsonwebtoken');
var config = require('../../config/server');
var util = require('../util');
var User = require('../../models/user.model').model;
var Users = require('../../models/user.model').collection;
var controller = {};

function sendToken(res, payload) {
  var token = jwt.sign(payload, config.sessionSecret, { expiresInMinutes: 60*5 });
  return util.send200(res, {token: token});
}

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
    return sendToken({id: user.id });
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

controller.login = function (req, res) {
  return User.forge()
  .query({where: {username: req.body.username}})
  .fetchAll()
  .then(function (users) {
    if (!users.models.length) {
      throw new Error('invalid credentials');
    }
    // console.log('here', users.models[0].validatePassword)
    return users.models[0].validatePassword(req.body.password)
  }).then(function (user) {
    return sendToken(res, {id: user.id })
  }).catch(function (error) {
    if (error.message === 'invalid credentials') {
      return util.send404(res, 'invalid credentials')
    }
    return util.send500(res, 'Error in server')
  }) 
}

controller.show = function (req, res) {
  return User.forge()
  .query({where: {id: req.params.id}})
  .fetchAll()
  .then(function (users) {
    if (!users.models.length) {
      return util.send404(res, 'id:' + req.params.id + ' not found');
    }
    return util.send200(res, users.models[0].stripPassword());
  }).catch(function (error) {
    return util.send500(res, 'Error in server')
  })
};

controller.updateRole = function (req, res) {
  if (['user', 'manager', 'admin'].indexOf(req.body.role) === -1) {
    return util.send400(res, 'send valid role')
  }

  return User.forge()
  .query({where: {id: req.params.id}})
  .fetchAll()
  .then(function (users) {
    if (!users.models.length) {
      throw new Error('not found');
    }
    return users.models[0].set({'role': req.body.role}).save()
  }).then(function () {
    return util.send200(res, 'role saved')
  })
  .catch(function (error) {
    if (error.message === 'not found') {
      return util.send400(res, 'id:' + req.params.id + ' not found');
    }
    return util.send500(res, 'Error in server');
  })
}

controller.remove = function(req, res) {
  return User.forge()
  .query({where: {id: req.params.id}})
  .fetchAll()
  .then(function (users) {
    if (!users.models.length) {
      throw new Error('not found');
    }
    return users.models[0].destroy()
  }).then(function() {
    return util.send200(res, 'user destroyed');
  }).catch(function(error) {
    if (error.message === 'not found') {
      return util.send400(res, 'id:' + req.params.id + ' not found');
    }
    return util.send500(res, 'Error in server');
  })
}

module.exports = controller;