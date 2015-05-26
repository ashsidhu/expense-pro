angular.module('expense')
  .controller('signup.controller', SignupController);

function SignupController($state) {
  this.username = '';
  this.password = '';
  this.$state = $state;
}

SignupController.prototype.signup = function() {
  console.log(this)
  this.$state.go('login')
}

SignupController.prototype.validate = function() {
  console.log(this)
}