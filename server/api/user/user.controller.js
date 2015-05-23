'use strict';

var User = require('../../models/user.model')
var controller = {};

controller.index = function (req, res) {
  User.fetchAll()
  .then(function (collection) {
    res.json(collection)
  }).catch(function () {
    res.sendStatus(500)
  })
}

controller.create = function (req, res) {
  User.forge(req.body)
  .save()
  .then(function () {
    console.log(arguments)
  })
  .catch(function () {
    console.log(arguments)
  })
}

module.exports = controller;