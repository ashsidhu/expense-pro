'use strict';

var bookshelf = require('../config/db');
var User = require('./user.model');

var Expense = bookshelf.Model.extend({
  tableName: 'expenses',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo(User);
  }
});

module.exports = Expense;