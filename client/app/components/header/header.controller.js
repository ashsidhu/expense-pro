angular.module('expense')
  .controller('header.controller', HeaderController);

function HeaderController($state, auth) {
  this.auth = auth;
}

HeaderController.prototype.isLoggedIn = function() {
  return this.auth.isLoggedIn();
}

HeaderController.prototype.logout = function() {
  console.log('here')
  return this.auth.logout();
}