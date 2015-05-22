var morgan = require('morgan');

function config (app) {
  
  app.use(morgan('dev'));
}

module.exports = config;