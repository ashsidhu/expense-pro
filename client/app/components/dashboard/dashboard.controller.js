angular.module('expense')
  .controller('dashboard.controller', DashboardController);

function DashboardController($state, $http, $scope) {
  var vm = this;
  vm.expenses=[{}];
  vm.getExpenses = getExpenses
  vm.updateExpense = updateExpense
  vm.deleteExpense = deleteExpense
  vm.newExpense = false
  vm.filter = {}
  vm.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    today: new Date()
  };
  getExpenses();
  $scope.$watch('vm.newExpense', getExpenses)

  function getExpenses() {
    var url = getFilterUrl();
    return $http.get(url)
    .then(function(response) {
      if (response && response.status === 200) {
        vm.newExpense = false;
        for (var i = 0; i < response.data.data.length; i++) {
          response.data.data[i].amount = +response.data.data[i].amount
        }
        vm.expenses = response.data.data;
      }
    })
  }

  function getFilterUrl() {
    return 'api/expenses'
  }

  function updateExpense(id, expense) {
    return $http.put('api/expenses/' + id, {
      amount: expense.amount,
      category: expense.category,
      comment: expense.comment,
      description: expense.description,
      date: expense.date
    }).then(function(response){
      if (response && response.status === 200) {
        expense.updated = true;
        setTimeout(function() {expense.updated = false;}, 2000)
      }
    })
  }

  function deleteExpense(id) {
    return $http.delete('api/expenses/' + id)
    .then(function(response){
      if (response && response.status === 200) {
        return getExpenses();
      }
    })
  }
}

