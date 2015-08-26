angular.module('starter.scheduleControllerDetail', ['starter.scheduleservices','ionic-datepicker'])

// 
// CONTROLLER SCHEDULE DETAIL
//
.controller('ControlScheduleDetail', function($localstorage,bridgeServiceAppointment,$state,PopupFactory,$scope, $stateParams,scheduleService,pathSchedule,$ionicActionSheet) {
  console.log('*******************************************************');
  console.log("==CONTROLLER SCHEDULE== view detail");
  console.log("param id appointment: ", $stateParams.appointmentId);

  $scope.accessRight = $localstorage.getObject('accessRight');
  $scope.updatePermission = $scope.accessRight.APPOINTMENT.UPDATE;
  console.log('Access right appointment update',$scope.accessRight);

  // EXECUTE QUERY WITH (appointment id)
  $scope.taskcall = scheduleService.query({'dto(appointmentId)':$stateParams.appointmentId,'dto(title)':'meeting'});

  // PROMISE
  $scope.taskcall.$promise.then(function (results){

    // call factory to validate the response
    PopupFactory.getPopup($scope,results);
    console.log("results of request: ",results);

    // prepare info to view
    $scope.mainData = results['mainData'];
    $scope.entity = results['mainData']['entity'];
    $scope.appointmentTypeArray = results['mainData']['appointmentTypeArray'];
    $scope.priorityArray = results['mainData']['priorityArray'];
    $scope.reminderTypeArray = results['mainData']['reminderTypeArray'];

    $scope.appointmentType = $scope.appointmentTypeArray.filter(function ( obj ) {
      return obj.appointmentTypeId === $scope.entity.appointmentTypeId;
    })[0];
    console.log('appointment type: ',$scope.appointmentType);

    // search priority by id
    if ($scope.entity.priorityId != '') {
      $scope.priority = $scope.priorityArray.filter(function ( obj ) {
        return obj.priorityId === $scope.entity.priorityId;
      })[0];  
      console.log('priority type: ',$scope.priority);
    }
    // search reminder by id
    if ($scope.entity.reminderType != '') {
      $scope.reminder = $scope.reminderTypeArray.filter(function ( obj ) {
        return obj.value === $scope.entity.reminderType;
      })[0];  
      $scope.timebefore = $scope.entity.reminderType == '1' ? $scope.entity.timeBefore_1 : $scope.entity.timeBefore_2;
      console.log('reminder type: ',$scope.reminder);
      console.log('reminder time before: ',$scope.timebefore);
    }
  })

  $scope.callToEditAppointment = function(){
    // SEND OBJECT APPOINTMET TO EDIT
    bridgeServiceAppointment.saveAppointment($scope.mainData);
    $state.go('app.schedulerEdit');
  }

  $scope.participants = function(){
    // SEND OBJECT APPOINTMET TO EDIT
    $state.go('app.participants',{'appointmentId': $scope.entity.appointmentId});
  }
});