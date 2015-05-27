'use strict';

var express = require('express');
var controller = require('./expense.controller');
var util = require('../util');
var router = express.Router();

router.get('/', util.authenticate,  controller.index);
router.post('/', util.authenticate, controller.create);

router.put('/:id', util.authenticate, controller.update);
router.delete('/:id', util.authenticate, controller.remove);

module.exports = router;