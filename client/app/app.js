var components = '/app/components';
var expenseApp = angular.module('expense', ['ui.router', ]);

expenseApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: components + '/home/home.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: components + '/login/login.html'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: components + '/signup/signup.html'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: components + '/dashboard/dashboard.html'
    });

  $locationProvider.html5Mode(true);
})
