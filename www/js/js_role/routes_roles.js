// Ionic Starter App
    // var db = null;
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter.rolesroutes', ['starter.rolescontrollers'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  //  ROUTE LOGIN
  .state('login', {
      url: '/login',
      cache: false,
      templateUrl: 'templates/login.html',
      controller: 'LoginController',
      params : {
          updated : false
      }
  })

  // ROUTE APP
  .state('app', {
    url: "/app",
    cache: false,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.startPage', {
    url: "/startPage",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/startPage.html",
        controller: "ControlStartPage"
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
