'use strict';

var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'expense'
  }
});

module.exports = require('bookshelf')(knex);