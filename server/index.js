var express = require('express');
var config = require('./config');
var app = express();

config(app);

app.use(function (req, res) {
  res.sendStatus(200);
})

app.listen(4000);