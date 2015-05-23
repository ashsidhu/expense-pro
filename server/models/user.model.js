'use strict';

var bookshelf = require('../config/db');
var Expense = require('./expense.model');

var User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  expenses: function () {
    return this.hasMany(Expense);
  }

});

module.exports = User;