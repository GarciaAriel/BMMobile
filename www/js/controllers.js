angular.module('starter.controllers', ['starter.services'],function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.withCredentials = true;
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
   var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];

  $httpProvider.interceptors.push('myHttpInterceptor');
})



// .controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup) {

//   //call services data
//   // Contacts.all();
//   //MailList.all();
//   // TaskList.all();

//   //var firstUse = $localstorage.get("starter",null);
//   var firstUse = null;
//   if(firstUse == null){ //if first time
//     // Contacts.all();
//     // MailList.all();
//   }
//   else{

//   }

// })


// .controller('DashCtrl', function($scope) {})

// .controller('LoginController', function (LoginService,apiUrlLocal,pathLogon,$ionicPopup,$scope,$ionicModal, AuthenticationService,$state,$http) {
//     'use strict';

//     $scope.data = {};

//     $ionicModal.fromTemplateUrl('templates/login.html', {
//       scope: $scope
//     }).then(function(modal) {
//       $scope.modal = modal;
//     });

//     $scope.closeLogin = function() {
//       $scope.modal.hide();
//     };

//     $scope.doLogin = function() {
//       console.log('==LOGIN== HTTP POST REQUEST', $scope.data);

//       // Simple POST request
//       $http({
//         method: 'POST',
//         url: apiUrlLocal+""+pathLogon,
//         data: {"dto(login)":$scope.data.username, "dto(companyLogin)":$scope.data.company, "dto(password)":$scope.data.password, "dto(language)":"en","dto(rememberInfo)":true}
//       }).success(function(data, status, headers, config) {
//         console.log('==LOGIN== REQUEST SUCCESS OK');


//         // console.log(headers('UserLastLogin'));

//         var auxiliary = "/"+data+"/";
//         var size = auxiliary.length;
//         if( size>4 )
//         {
//           console.log(size);
//           console.log("DATA: ",data);
//           console.log("status: ",status);
//           console.log("headers: ",headers);
//           console.log("CONFIG: ",config);

//           AuthenticationService.login({name: $scope.data.username, company: $scope.data.company});
//           $scope.closeLogin();
//           $state.go('app');
//         }
//         else
//         {
//           var alertPopup = $ionicPopup.alert({
//                 title: 'Log on, Failed!',
//                 template: 'Please check your credentials!'
//             });
//         }
//       }).
//       error(function(data, status, headers, config) {
//        console.log('==LOGIN== ERROR', data);
//       });

//     };

// })

// .controller('logoutController', function($scope, $state,AuthenticationService){
//     'use strict';
//     AuthenticationService.logout();
// })

//dooooooooooooooooooooooooooooooooooooooooooo

// .controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
//     $scope.data = {};

//     $scope.login = function() {
//         LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
//             $state.go('app');
//         }).error(function(data) {
//             var alertPopup = $ionicPopup.alert({
//                 title: 'Log on, Failed!',
//                 template: 'Please check your credentials!'
//             });
//         });
//     }
// });
