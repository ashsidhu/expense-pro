'use strict';

var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var bookshelf = require('../config/db');
var Expense = require('./expense.model');

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
          message: 'password length'
        });
      }
      return bcrypt.hash(password, 8, function(err, hash) {
        if (err) {
          return reject({
            message: 'hash error',
            error: true
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