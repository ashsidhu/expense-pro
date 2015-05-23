'use strict';
var Promise = require('bluebird');
var bookshelf = require('../config/db');

var User = bookshelf.Model.extend({
  intialize: function () {
    console.log(this);
  }
});

module.exports = User;