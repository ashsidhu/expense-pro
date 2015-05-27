'use strict';

var util = require('../util');
var Expense = require('../../models/expense.model').model;
var Expenses = require('../../models/expense.model').collection;
var errors = require('../../config/errorCodes')


var controller = {};

controller.index = function (req, res) {
  var filter = {
    user_id: req.user.id,
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
    return expense.set({
      user_id: req.user.id,
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
    // if (error.messagereturn util.send500(res, errors.SERVER_ERROR);
    return util.send500(res, errors.SERVER_ERROR);
  })
};

controller.update = function (req, res) {

};

controller.remove = function (req, res) {

};

module.exports = controller;