
angular.module('starter.contactservices', [])

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

.service('bridgeService', function() {
  var contact = {};

  var saveContact = function(newContact) {
      contact = newContact;
  };

  var getContact = function(){
      return contact;
  };

  return {
    saveContact: saveContact,
    getContact: getContact
  };

})

.service('contactsListActual', function() {
  var contactList = {};

  var saveContactList = function(newContactList) {
      contactList = newContactList;
  };

  var getContactList = function(){
      return contactList;
  };

  return {
    saveContactList: saveContactList,
    getContactList: getContactList
  };

})

.service('bridgeServiceNewContactPerson', function() {
  var contact = {};

  var saveContact = function(newContact) {
      contact = newContact;
  };

  var getContact = function(){
      return contact;
  };

  return {
    saveContact: saveContact,
    getContact: getContact
  };

})

.factory('Contact', function ($resource,recentContact,apiUrlLocal) {
	var url = apiUrlLocal+recentContact;
	return $resource(url,{},{'query':{method:'GET', isArray:false},
                           'save':   {method:'POST'}});
})

.factory('allContact', function ($resource,pathContact,apiUrlLocal) {
  var url = apiUrlLocal+pathContact;
  return $resource(url,{},{'query':{method:'GET', isArray:false},
                           'save':   {method:'POST'}});
})

.factory('contactPersonDetail', function ($resource,pathContactPersonDetail,apiUrlLocal) {
  var url = apiUrlLocal+pathContactPersonDetail;
  return $resource(url,{},{'query':{method:'GET', isArray:false} });
})

.factory('ContactPerson', function ($resource,pathContactPerson,apiUrlLocal) {
  var url = apiUrlLocal+pathContactPerson;
  return $resource(url,{},{'query':{method:'GET', isArray:false}});
})

.factory('listToAddContactPerson', function ($resource,pathListToAddContactPerson,apiUrlLocal) {
  var url = apiUrlLocal+pathListToAddContactPerson;
  return $resource(url,{},{'query':{method:'GET', isArray:false}});
})

.factory("transformRequestAsFormPost",function() {
// I prepare the request data for the form post.
  function transformRequest( data, getHeaders ) {
    var headers = getHeaders();
    headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";    
    return( serializeData( data ) );
  }
  // Return the factory value.
    return( transformRequest );
  // ---
  // PRVIATE METHODS.
  // ---
  // I serialize the given Object into a key-value pair string. This
  // method expects an object and will default to the toString() method.
  // --
  // NOTE: This is an atered version of the jQuery.param() method which
  // will serialize a data collection for Form posting.
  // --
  // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
  function serializeData( data ) {
// If this is not an object, defer to native stringification.
if ( ! angular.isObject( data ) ) {
return( ( data == null ) ? "" : data.toString() );
}
var buffer = [];
// Serialize each key in the object.
for ( var name in data ) {
if ( ! data.hasOwnProperty( name ) ) {
continue;
}
var value = data[ name ];
buffer.push(
encodeURIComponent( name ) +
"=" +
encodeURIComponent( ( value == null ) ? "" : value )
);
}
// Serialize the buffer and clean it up for transportation.
var source = buffer
.join( "&" )
.replace( /%20/g, "+" )
;
return( source );
}
}
)


.directive('focus',
  function($timeout) {
    return {
      scope : {
        trigger : '@focus'
      },
      link : function(scope, element) {
        scope.$watch('trigger', function(value) {
          if (value === "true") {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
      }
    };
  }
)

.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                        scope.$apply(function(){
                                scope.$eval(attrs.ngEnter);
                        });
                        
                        event.preventDefault();
                }
            });
        };
}); 
