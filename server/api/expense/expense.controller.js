'use strict';

var util = require('../util');
var Expense = require('../../models/expense.model').model;
var Expenses = require('../../models/expense.model').collection;
var errors = require('../../config/errorCodes')


var controller = {};

controller.index = function (req, res) {
  var filter = {
    user_id: req.query.userId || req.user.id,
    category: req.query.category,
    minAmount: req.query.minAmount,
    maxAmount: req.query.maxAmount
  }
  return Expense.forge()
  .filterQuery(filter)
  .fetchAll()
  .then(function (expenses) {
    return util.send200(res, expenses.toJSON());
  }).catch(function (error) {
    if (error.code === errors.INVALID_AMOUNT) {
      return util.send400(res, error.code);
    }
    return util.send500(res, errors.SERVER_ERROR);
  });
};

controller.create = function (req, res) {
  return Expense.forge()
  .setAmount(req.body.amount)
  .then(function (expense) {
    console.log(req.body, req.query)
    return expense.set({
      user_id: req.query.userId || req.user.id,
      description: req.body.description,
      category: req.body.category,
      date: req.body.date,
      comment: req.body.comment
    }).save();
  }).then(function () {
    return util.send200(res)
  }).catch(function (error) {
    if (error.code === errors.PG_DECIMAL_RANGE) {
      return util.send400(res, errors.PG_DECIMAL_RANGE);
    }
    return util.send500(res, errors.SERVER_ERROR);
  })
};

controller.update = function (req, res) {
  return Expense.forge()
  .query({where: {id: req.params.id}})
  .fetch()
  .then(function(expense){
    if (!expense){
      var error = new Error;
      error.code = errors.NOT_FOUND
      throw error
    }
    return expense.setAmount(req.body.amount)
  }).then(function (expense) {
    return expense.set({
      description: req.body.description,
      category: req.body.category,
      date: req.body.date,
      comment: req.body.comment
    }).save();
  }).then(function () {
    return util.send200(res)
  }).catch(function (error) {
    if ([errors.PG_DECIMAL_RANGE, errors.NOT_FOUND].indexOf(error.code) !== -1) {
      return util.send400(res, error.code);
    }
    return util.send500(res, errors.SERVER_ERROR);
  })
};

controller.remove = function (req, res) {
  return Expense.forge()
  .query({where: {id: req.params.id}})
  .fetch()
  .then(function(expense){
    if (!expense){
      var error = new Error;
      error.code = errors.NOT_FOUND
      throw error
    }
    return expense.destroy();
  }).then(function() {
    return util.send200(res, errors.DESTROYED);
  }).catch(function(error) {
    if (error.code === errors.NOT_FOUND) {
      return util.send400(res, 'id:' + req.params.id + ' not found');
    }
    return util.send500(res, errors.SERVER_ERROR);
  })
};

module.exports = controller;