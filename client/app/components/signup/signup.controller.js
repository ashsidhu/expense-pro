angular.module('expense')
  .controller('signup.controller', SignupController);

function SignupController($http, $state) {
  this.username = '';
  this.password = '';
  this.$http = $http;
  this.$state = $state;
}

SignupController.prototype.signup = function() {
  var vm = this;
  return this.$http.post('/api/users/', {
    username: this.username,
    password: this.password
  })
}

SignupController.prototype.validate = function() {
  console.log(this)
}