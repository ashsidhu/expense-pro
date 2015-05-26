angular.module('expense')
  .controller('manager.controller', ManagerController);

function ManagerController($state, $http) {
  this.foo='bar'
}