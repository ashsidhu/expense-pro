angular.module('expense')
  .controller('dashboard.controller', DashboardController);

function DashboardController($state, $http) {
  this.foo='bar'
}