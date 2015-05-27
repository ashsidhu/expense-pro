var components = '/app/components';
var expenseApp = angular.module('expense', ['ui.router', 'ui.bootstrap']);

expenseApp
.config(config)
.factory('authInterceptor', authInterceptor)
.service('auth', authService)
.run(function ($rootScope, $state, auth) {
  $rootScope.$on('$stateChangeStart', function (event, next) {
    if (!next.name) {
      return
    }
    if (next.authenticate && !auth.isLoggedIn()) {
      // send logged out user to login
      event.preventDefault();
      $state.go('login');
    } else if ((['login', 'signup'].indexOf(next.name) > -1) && auth.isLoggedIn()) {
      // send logged in user straight to dashboard
      event.preventDefault();
      $state.go('dashboard');
    }
  });
})

function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: components + '/home/home.template.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: components + '/login/login.template.html'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: components + '/signup/signup.template.html'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: components + '/dashboard/dashboard.template.html',
      authenticate: true
    })
    .state('users', {
      url: '/users',
      templateUrl: components + '/manager/manager.template.html',
      authenticate: true
    });

  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('authInterceptor');
}


function authInterceptor(auth) {
  return {
    // automatically attach Authorization header
    request: function(config) {
      var token;
      if (token = auth.getToken()) {
        config.headers.token = token;
      }
      return config;

    },

    response: function(res) {
      if(res.config.url.indexOf('api') !== -1 && res.data.data.token) {
        auth.saveToken(res.data.data.token);
      }

      return res;
    },

    responseError: function(res) {
      if (res.status === 401) {
        auth.logout()
      }
    }
  }
}

function authService($window, $injector) {
  this.$window = $window
  this.$injector = $injector
}
authService.prototype.parseJwt = function (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(this.$window.atob(base64));
}
authService.prototype.saveToken = function(token) {
  this.$window.localStorage.jwtToken = token;
  this.$injector.get('$state').go('dashboard');
}
authService.prototype.getToken = function() {
  return this.$window.localStorage.jwtToken;
}
authService.prototype.isLoggedIn = function () {
  var token = this.getToken();
  if(!token) {
    return false;
  }
  var params = this.parseJwt(token);
  return Math.round(new Date().getTime() / 1000) <= params.exp;
}
authService.prototype.logout = function() {
  this.$window.localStorage.removeItem('jwtToken');
  this.$injector.get('$state').go('login');
}

