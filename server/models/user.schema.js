'use strict';

var knex = require('../config/db').knex;

knex.schema.hasTable('users').then(function(exists) {
  console.log('users, ', exists)
  if (!exists) {
    return knex.schema.createTable('users', function(user) {
      user.increments('id').primary();
      user.string('username', 16).unique().notNullable();
      user.string('password', 100).notNullable();
      user.string('role', 16).notNullable();
      user.timestamps();
    });
  }
}).then(function () {
  console.log('users table created');
});