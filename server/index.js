'use strict';

var express = require('express');
var config = require('./config');
var routes = require('./routes');
var app = express();

config(app);
routes(app);

app.listen(4000);