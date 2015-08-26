angular.module('starter.rolesservices', [])

//SERVICE RESOURCE QUERY
.factory('LogoutService', function($resource,apiUrlLocal,pathLogout) {
  var url = apiUrlLocal+pathLogout;
  console.log('==SERVICE SCHEDULE== URL',url);
  return $resource(url,{},{'query':{method:'GET', isArray:false}}); 
})

// SERVICE LOGIN SERVICE
.service('LoginService', function($q) {
    return {
        loginUser: function(name, company) {

            console.log("==SERVICE ROLE== CREATE  "+name+" service "+company+"-");
            var deferred = $q.defer();
            var promise = deferred.promise;

            // if (name == "ariel" && company == "piramide") {
                deferred.resolve('Welcome ' + name + '!');
            // } else {
                // deferred.reject('Wrong credentials.');
            // }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            
            return promise;
        }
    };
})

// SERVICE AUTHENTICATION SERVICE
.factory('AuthenticationService', function ($http, SessionService) {
  console.log("==SERVICE ROLE== Authentication Service");
  'use strict';
  // FUNTIONS login / isLoggedIn / logout
  return {

    login: function (user) {
      // this method could be used to call the API and set the user instead of taking it in the function params
      SessionService.currentUser = user;
    },
    isLoggedIn: function () {
      return SessionService.currentUser !== null;
    },
    logout: function(){
      SessionService.currentUser = null;
      return SessionService.currentUser;
    }
  };
})

// SERVICE SESSION SERVICE
.factory('SessionService', function () {

  'use strict';

  return {
    currentUser: null
  };
})

// HELP SERVICE LOCAL STORAGE
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

// SERVICE ROLE SERVICE
.factory('RoleService', function ($http) {

  'use strict';

  var adminRoles = ['admin', 'editor'];
  var otherRoles = ['user'];

  return {
    validateRoleAdmin: function (currentUser) {
      return currentUser ? _.contains(adminRoles, currentUser.role) : false;
    },

    validateRoleOther: function (currentUser) {
      return currentUser ? _.contains(otherRoles, currentUser.role) : false;
    }
  };
});
