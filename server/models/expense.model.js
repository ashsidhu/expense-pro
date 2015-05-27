'use strict';

var bookshelf = require('../config/db');
var User = require('./user.model');
var Promise = require('bluebird')

var Expense = bookshelf.Model.extend({
  tableName: 'expenses',
  hasTimestamps: true,
  user: function () {
    return this.belongsTo(User);
  },
  setAmount: function(amount) {
    var expense = this;
    return new Promise(function (resolve, reject) {
      amount = parseInt(amount);
      if (isNaN(amount) && amount <= 0) {
        return reject({
          error: true,
          code: errors.INVALID_AMOUNT
        });
      }
      expense.set('amount', amount);
      return resolve(expense)
    })
  },
  filterQuery: function (filter) {
    return this.query(function(qb) {
      qb.where({user_id: filter.user_id})
      if (filter.category) {
        qb.andWhere({category: filter.category})
      }
      if (filter.minAmount) {
        qb.andWhere('amount', '>=', filter.minAmount)
      }
      if (filter.maxAmount) {
        qb.andWhere('amount', '<=', filter.maxAmount)
      }
    })
  }
});

var Expenses = bookshelf.Collection.extend({
  model: Expense
});


module.exports = {
  model: Expense,
  collection: Expenses
};