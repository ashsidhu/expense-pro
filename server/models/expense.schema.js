'use strict';

var knex = require('../config/db').knex;

knex.schema.hasTable('expenses').then(function(exists) {
  console.log(exists)
  if (!exists) {
    return knex.schema.createTable('expenses', function(expense) {
      expense.increments('id').primary();
      expense.decimal('amount').notNullable();
      expense.string('description');
      expense.string('comment');
      expense.string('category', 100);
      expense.integer('user_id').unsigned().references('users.id');
      expense.dateTime('date');
      expense.timestamps();
    });
  }
}).then(function () {
  console.log('expenses table created');
});