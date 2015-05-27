angular.module('expense')
  .controller('dashboard.controller', DashboardController);

function DashboardController($state, $http, $scope, $stateParams) {

  var vm = this;
  vm.userId = $stateParams.userId
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
    var url = 'api/expenses/?'
    if (vm.userId) {
      url = url + 'userId=' + vm.userId + '&'
    }
    if (vm.filter.minAmount) {
      url = url + 'minAmount=' + vm.filter.minAmount + '&'
    }
    if (vm.filter.maxAmount) {
      url = url + 'maxAmount=' + vm.filter.maxAmount + '&'
    }
    if (vm.filter.maxDate) {
      console.log(vm.filter.maxDate.toString())
      url = url + 'maxDate=' + vm.filter.maxDate.toISOString() + '&'
    }
    if (vm.filter.minDate) {
      url = url + 'minDate=' + vm.filter.minDate.toISOString() + '&'
    }
    return url;
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

