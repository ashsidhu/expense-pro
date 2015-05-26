'use strict';

var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var bookshelf = require('../config/db');
var Expense = require('./expense.model');
var errors = require('../config/errorCodes')

var User = bookshelf.Model.extend({
  tableName: 'users',
  initialize: function () {
    if (!this.get('role')) {
      this.set('role', 'user');
    }

  },
  hasTimestamps: true,
  expenses: function () {
    return this.hasMany(Expense);
  },
  hashPassword: function (password) {
    return new Promise(function (resolve, reject) {
      if (password.length < 8) {
        return reject({
          error: true,
          code: errors.PASSWORD_SHORT
        });
      }
      return bcrypt.hash(password, 8, function(err, hash) {
        if (err) {
          return reject({
            error: true,
            code: errors.SERVER_ERROR
          });
        }
        return resolve(hash);
      });
    });
  },
  stripPassword: function () {
    return {
      username: this.get('username'),
      id: this.get('id'),
      role: this.get('role'),
      created_at: this.get('created_at'),
      updated_at: this.get('updated_at')
    }
  },
  validatePassword: function (password) {
    var user = this;
    return new Promise(function (resolve, reject) {

      return bcrypt.compare(password, user.get('password'), function(err, match) {
        if (err) {
          return reject({
            error: true,
            code: errors.SERVER_ERROR
          });
        } else if (!match) {
          return reject({
            error: true,
            code: errors.INVALID_CREDENTIALS
          });
        }
        return resolve(user);
      })
    });
  }
});

var Users = bookshelf.Collection.extend({
  model: User,
  stripPasswords: function () {
    return this.models.map(function (model) {
      return model.stripPassword();
    });
  }
});


module.exports = {
  model: User,
  collection: Users
};