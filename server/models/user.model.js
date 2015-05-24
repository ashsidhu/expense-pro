'use strict';

var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var bookshelf = require('../config/db');
var Expense = require('./expense.model');


var User = bookshelf.Model.extend({
  tableName: 'users',
  initialize: function () {
    this.set('role', 'user');

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
            message: 'hash',
            error: true
          });
        }
        return resolve(hash);
      });
    });
  }
});

module.exports = User;