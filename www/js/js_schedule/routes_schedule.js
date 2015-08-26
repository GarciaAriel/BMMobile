angular.module('starter.scheduleroutes', ['starter.scheduleControllerShowParticipants','starter.scheduleController','starter.scheduleControllerNew','starter.scheduleControllerEdit','starter.scheduleControllerDetail','starter.scheduleControllerAddParticipants','starter.constantsSchedule'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  
  // ROUTE EDIT APPOINTMENT
  .state('app.schedulerEdit', {
    url: "/schedulerEdit",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_schedule/newAppointment.html",
        controller: "ControllerScheduleEdit"
      }
    }
  })

  // ROUTE NEW APPOINTMENT
  .state('app.newAppointment', {
    url: "/newAppointment",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_schedule/newAppointment.html",
        controller: "NewAppointmentController"
      }
    }
  })
  
  // ROUTE VIEW CALENDAR
  .state('app.schedulerView', {
    url: "/schedulerView",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_schedule/schedulerView.html",
        controller: "ControlSchedule"
      }
    }
  })
  
  // ROUTE DETAIL APPOINTMENT
  .state('app.schedulerDetail', {
    url: "/schedulerDetail?appointmentId",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_schedule/appointmentDetail.html",
        controller: "ControlScheduleDetail"
      }
    }
  })

  // ROUTE TO SEE PARTICIPANTS AN APPOINTMENT
  .state('app.participants', {
    url: "/participants?appointmentId",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_schedule/seeParticipants.html",
        controller: "seeParticipants"
        // controller: "addParticipantsToAnAppointment"
      }
    }
  })

  // ROUTE TO ADD PARTICIPANTS AN APPOINTMENT
  .state('app.addParticipants', {
    url: "/addParticipants?appointmentId",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/views_schedule/addParticipants.html",
        controller: "addParticipants"
        // controller: "addParticipantsToAnAppointment"
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});