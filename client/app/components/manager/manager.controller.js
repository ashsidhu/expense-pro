angular.module('expense')
  .controller('manager.controller', ManagerController);

function ManagerController($state, $http) {
  var vm = this;
  vm.users=[{}];
  vm.getUsers = getUsers
  vm.updateUser = updateUser
  vm.deleteUser = deleteUser
  getUsers()
  function getUsers() {
    return $http.get('api/users')
    .then(function(response) {
      if (response && response.status === 200) {
        vm.users = response.data.data
      }
    })
  }
  function updateUser(id, user) {
    return $http.put('api/users/' + id, {
      role: user.role,
      username: user.username
    }).then(function(response){
      if (response && response.status === 200) {
        user.updated = true;
        setTimeout(function() {user.updated = false;}, 2000)
      }
    })
  }
  function deleteUser(id) {
    return $http.delete('api/users/' + id)
    .then(function(response){
      if (response && response.status === 200) {
        return getUsers();
      }
    })
  }
}