'use strict';

var jwt = require('jsonwebtoken');
var config = require('../../config/server');
var util = require('../util');
var User = require('../../models/user.model').model;
var Users = require('../../models/user.model').collection;
var errors = require('../../config/errorCodes')
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
    return util.send500(res, errors.SERVER_ERROR);
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
    return sendToken(res, {id: user.id, role: user.get('role') });
  }).catch(function(error) {
    if (error.code === errors.PG_DUPLICATE_KEY || error.code === errors.PASSWORD_SHORT) {
      return util.send400(res, error.code);
    }
    return util.send500(res, errors.SERVER_ERROR)
  });
};

controller.login = function (req, res) {
  return User.forge()
  .query({where: {username: req.body.username}})
  .fetchAll()
  .then(function (users) {
    if (!users.models.length) {
      var error = (new Error)
      error.code = errors.INVALID_CREDENTIALS;
      throw error;
    }
    return users.models[0].validatePassword(req.body.password)
  }).then(function (user) {
    return sendToken(res, {id: user.id, role: user.get('role') })
  }).catch(function (error) {
    if (error.code === errors.INVALID_CREDENTIALS) {
      return util.send404(res, error.code)
    }
    return util.send500(res, errors.SERVER_ERROR)
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
    return util.send500(res, errors.SERVER_ERROR)
  })
};

controller.updateRole = function (req, res) {
  if (['user', 'manager', 'admin'].indexOf(req.body.role) === -1) {
    return util.send400(res, 'send valid role')
  } else if (!req.body.username) {
    return util.send400(res, 'send valid username')
  }

  return User.forge()
  .query({where: {id: req.params.id}})
  .fetchAll()
  .then(function (users) {
    if (!users.models.length) {
      var error = (new Error)
      error.code = errors.NOT_FOUND;
      throw error;
    }
    return users.models[0].set({
      'role': req.body.role,
      'username': req.body.username
    }).save()
  }).then(function () {
    return util.send200(res, 'user details saved')
  })
  .catch(function (error) {
    if (error.code === errors.NOT_FOUND) {
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
      var error = (new Error)
      error.code = errors.NOT_FOUND;
      throw error;
    }
    return users.models[0].destroy()
  }).then(function() {
    return util.send200(res, 'user destroyed');
  }).catch(function(error) {
    if (error.code === errors.NOT_FOUND) {
      return util.send400(res, 'id:' + req.params.id + ' not found');
    }
    return util.send500(res, errors.SERVER_ERROR);
  })
}

controller.isAuthorized = function(req, res, next) {
  // will pass to next if user.role is manager or admin
  if (['manager', 'admin'].indexOf(req.user.role) === -1) {
    return util.send403(res, errors.UNAUTHORIZED)
  }
  return next()
}

module.exports = controller;