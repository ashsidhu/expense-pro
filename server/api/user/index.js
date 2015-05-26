'use strict';

var express = require('express');
var controller = require('./user.controller');
var util = require('../util');
var router = express.Router();

router.get('/', util.authenticate, controller.index);
router.post('/', controller.create);
router.post('/login', controller.login);

router.get('/:id', util.authenticate, controller.show)
router.delete('/:id', util.authenticate, controller.remove);

router.put('/:id/role', util.authenticate, controller.updateRole);
// router.put('/:id/password', controller.changePassword);


module.exports = router;