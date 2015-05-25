'use strict';

var express = require('express');
var controller = require('./expense.controller');
var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);

router.get('/:id', controller.show)
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;