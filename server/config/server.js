'use strict';

var path = require('path');

module.exports = {
  root: path.normalize(__dirname + '/../..'),
  db: {

  },
  sessionSecret: process.env.EXPENSE_SECRET || 'expense-secret'
}