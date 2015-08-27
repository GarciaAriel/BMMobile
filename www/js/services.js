angular.module('starter.services', [])

.factory("PopupFactory", function ($ionicHistory,$ionicPopup,$state,$filter) {
  
  function getPopup(scope,result,showErrorAndGoBack) {
    console.log('----------------START----------------');

      // if session Expired
      if (result.forward != undefined && showErrorAndGoBack == true) {
        console.log("==ERROR CONTROL== show error and go back:",result);
        console.log('----------------END----------------');
        
        var message = "";
        message = result.errorsArray[0].error;
        for (var i = 1; i < result.errorsArray.length; i++) {
          message=message+"<br>"+result.errorsArray[i].error ;
        };
        
        return $ionicPopup.show({
          title: $filter('translate')('Error'),
          template:  message,
          scope: scope,
          buttons: [
            { text: '<b>close</b>',
              type: 'button-positive',
              onTap: function(e) {
                $ionicHistory.goBack();
              }
            },
          ]
        })

      };

      // if session Expired
      if (result.forward != undefined && result.forward == "SessionExpired") {
        console.log("==ERROR CONTROL== session expired:",result);
        console.log('----------------END----------------');
        return $ionicPopup.show({
         
          title: "Error",
          template: "Session Expired",
          scope: scope,
          buttons: [
            { text: '<b>close</b>',
              type: 'button-positive',
              onTap: function(e) {
                $state.go('login');  
              }
            },
          ]
        })
      };

      // if appointment was deleted by other user
      if (result.forward != undefined && result.forward == "MainSearch") {
        console.log("==ERROR CONTROL== appointment deleted:",result);
        console.log('----------------END----------------');

        var message = "";
        if (result.errorsArray) {
          message = result.errorsArray[0].error;
          for (var i = 1; i < result.errorsArray.length; i++) {
            message=message+"<br>"+result.errorsArray[i].error ;
          };
        }
        
        return $ionicPopup.show({
          title: $filter('translate')('Error'),
          template:  message,
          scope: scope,
          buttons: [
            { text: '<b>close</b>',
              type: 'button-positive',
              onTap: function(e) {
                $ionicHistory.goBack();
                $state.go('app.schedulerView');
              }
            },
          ]
        })
      };

      // if Concurrency fail
      if (result.forward != undefined && result.forward == "ConcurrencyFail") {
        console.log("==ERROR CONTROL== Concurrency Fail:",result);
        console.log('----------------END----------------');

        var message = "";
        if (result.errorsArray) {
          message = result.errorsArray[0].error;
          for (var i = 1; i < result.errorsArray.length; i++) {
            message=message+"<br>"+result.errorsArray[i].error ;
          };
        }
        else{
          message = $filter('translate')('ConcurrencyFail');
        }
        
        return $ionicPopup.show({
          title: $filter('translate')('Error'),
          template:  message,
          scope: scope,
          buttons: [
            { text: '<b>close</b>',
              type: 'button-positive',
              onTap: function(e) {
                $ionicHistory.goBack();
              }
            },
          ]
        })
      };
      
      if (result.errorsArray) {
        console.log("==ERROR CONTROL== errors array:",result);
        console.log('----------------END----------------');

        var message = result.errorsArray[0].error;
        for (var i = 1; i < result.errorsArray.length; i++) {
          message=message+"<br>"+result.errorsArray[i].error ;
        };
        return $ionicPopup.show({
         
         title: 'Error',
         template: message,
         scope: scope,
         buttons: [
           { text: '<b>OK</b>',
           type: 'button-positive'
         },
           
         ]
        })  
      };

      console.log("==ERROR CONTROL== no problems");
      console.log('----------------END----------------');
  }
       
   return {
       getPopup: getPopup
   };  

})

.factory('myHttpInterceptor', function($q,$location,$injector) {
  return {
    'request': function(config) {
      $injector.get("$ionicLoading").show({
        template: '<i class="icon ion-loading-d" style="font-size: 40px"></i>',
        animation: 'fade-in',
        noBackdrop: false
      });
      return config;
    },

    // optional method
    'response': function(response) {
      $injector.get("$ionicLoading").hide();
      return response;
    },

    // optional method
    'responseError': function(rejection) {
      $injector.get("$ionicLoading").hide();
      // do something on error
      if (rejection.status == 302){
        $location.path('/login');
      }
      // if (canRecover(rejection)) {
      //   return responseOrNewPromise
      // }
      return $q.reject(rejection);
    }
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
}]);