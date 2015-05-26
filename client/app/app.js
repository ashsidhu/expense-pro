var components = '/app/components';
var expenseApp = angular.module('expense', ['ui.router' ]);

expenseApp
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
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
      templateUrl: components + '/signup/signup.template.html',
      authenticate: true

    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: components + '/dashboard/dashboard.template.html',
      authenticate: true
    });

  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('authInterceptor');
}).factory('authInterceptor', authInterceptor)
.service('auth', authService)
// .run(function ($rootScope, $state, auth) {
//       $state.go('login');
//   // $rootScope.$on('$stateChangeStart', function (event, next) {
//   //   if (next.name && next.authenticate && !auth.isLoggedIn()) {
//   //     debugger
//   //     $state.go('login');
//   //   }
//   // });
// })

function authInterceptor(auth) {
  return {
    // automatically attach Authorization header
    request: function(config) {
      console.log(config)
      var token;
      if (token = auth.getToken()) {
        config.headers.token = token;
      }
      return config;

    },

    response: function(res) {
      console.log(res.data)
      if(res.config.url.indexOf('api') !== -1 && res.data.data.token) {
        auth.saveToken(res.data.data.token);
      }

      return res;
    },

    responseError: function(res) {
      console.log(res)
      if (res.status === 401) {
        auth.logout()
      }
    }
  }
}

function authService($window) {
  this.$window = $window
}
authService.prototype.parseJwt = function (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(this.$window.atob(base64));
}
authService.prototype.saveToken = function(token) {
  this.$window.localStorage.jwtToken = token;
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
}

