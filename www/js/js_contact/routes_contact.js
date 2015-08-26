
angular.module('starter.contactroutes', ['starter.contactcontrollers'])


.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider.state('app.contacts', {
    url: '/contacts',
    cache: true,
    views: {
      'menuContent': {
       controller: 'ContactsCtrl',
       templateUrl: 'templates/views_contact/contactslist.html'
      }
    }
  })

  $stateProvider.state('app.contactsCadeco', {
    url: '/contactsCadeco',
    cache: false,
    views: {
      'menuContent': {
       controller: 'ContactsCtrl',
       templateUrl: 'templates/views_contact/contactslistCadeco.html'
      }
    }
  })
  
  $stateProvider.state('app.search', {
    url: '/parameter(contactSearchName)',
  }) 

  $stateProvider.state('app.contactPerson', {
    url: "/contactPerson?contactId&addressId&contactPersonId&name1&name2",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/contactPerson.html",
        controller: 'ContactPersonCtrl'
      }
    }
  })

  $stateProvider.state('app.organization', {
    url: "/organization?contactId&addressId&contactPersonId&addressType",
    cache: true,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/organization.html",
        controller: 'OrganizationCtrl'
      }
    }
  })

  $stateProvider.state('app.person', {
    url: "/person?contactId&addressId&contactPersonId&addressType",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/person.html",
        controller: 'PersonCtrl'
      }
    }
  })

  $stateProvider.state('app.newperson', {
    url: "/newperson",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/newperson.html",
        controller: 'newpCtrl'
      }
    }
  })


  $stateProvider.state('app.editPerson', {
    url: "/editPerson",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/newperson.html",
        controller: 'editPersonCtrl'
      }
    }
  })


  $stateProvider.state('app.editContactPerson', {
    url: "/editContactPerson",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/newContactPerson.html",
        controller: 'EditContactPersonCtrl'
      }
    }
  })

  $stateProvider.state('app.newContactPerson', {
    url: "/newContactPerson",
    cache: true,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/newContactPerson.html",
        controller: 'newContactPersonCtrl'
      }
    }
  })

  $stateProvider.state('app.addContactPerson', {
    url: "/addContactPerson",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/listToAddContactPerson.html",
        controller: 'listToAddContactPersonCtrl'
      }
    }
  })

  $stateProvider.state('app.editOrganization', {
    url: "/editOrganization",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/neworganization.html",
        controller: 'editOrganizationCtrl'
      }
    }
  })

  $stateProvider.state('app.seeContactsPerson', {
    url: '/seeContactsPerson',
    cache: true,
    views: {
      'menuContent': {
       controller: 'ctrlSeeContactsPerson',
       templateUrl: 'templates/views_contact/seeContactsPerson.html'
      }
    }
  })

  $stateProvider.state('app.neworganization', {
    url: "/neworganization",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_contact/neworganization.html",
        controller: 'neworganizationCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
  
});
