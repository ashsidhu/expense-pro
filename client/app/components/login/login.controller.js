angular.module('expense')
  .controller('login.controller', LoginController);

function LoginController($state, $http) {
  this.username = '';
  this.password = '';
  this.$state = $state;
  this.$http = $http;
}

LoginController.prototype.postCredentials = function() {
  var vm = this;
  return this.$http.post('/api/users/login', {
    username: this.username,
    password: this.password
  })
}

LoginController.prototype.foo = function() {
  this.$http.get('/api/users/')
  .then(function(body) {
    console.log(body)
  })
}

