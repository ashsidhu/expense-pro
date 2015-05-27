angular.module('expense')
  .controller('newExpense.controller', NewExpenseController);

function NewExpenseController($state, $http, $scope) {
  this.parent = $scope.vm;
  this.$http = $http;
  this.model = {
    date: new Date()
  }
  this.status = {
    open: !this.parent.expenses.length
  }
  this.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    today: new Date()
  };
}

NewExpenseController.prototype.createExpense = function() {
  var vm = this;
  if (!vm.isValid()) {
    return;
  }
  var url = '/api/expenses'
  if (vm.parent.userId) {
    url = url + '?userId=' + vm.parent.userId
  }
  return vm.$http.post(url, vm.model)
  .then(function(response){
    if (response && response.status === 200) {
      vm.model = {
        date: new Date()
      };
      vm.parent.newExpense = true
    }
  }, function (error) {
    console.log(error)
  })
}
NewExpenseController.prototype.isValid = function() {
  if (!this.model.amount || this.model.amount <= 0) {
    return false;
  }
  return true;
}