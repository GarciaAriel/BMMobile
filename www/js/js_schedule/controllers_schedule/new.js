angular.module('starter.scheduleControllerNew', ['starter.scheduleservices','ionic-datepicker'])

// 
// CONTROLLER SCHEDULE NEW APPOINTMENT
// 
.controller('NewAppointmentController',function($rootScope,bridgeServiceDate,CREATE_APPOINTMENT_URL,$filter,getFormatDate,$state,NEW_APPOINTMENT_FORWARD,$scope,PopupFactory,apiUrlLocal,$http){
  console.log('*******************************************************');
  console.log("==CONTROLLER SCHEDULE NEW APPOINTMENT==");

  // prepare info to view
  $scope.entity = {isAllDay: false, reminder: false, isPrivate:false, location:"",descriptionText:"",title:"",isRecurrence:false};
  $scope.viewTitle = $filter('translate')('NewAppointment');
  var dateBridge = bridgeServiceDate.getDate();
  console.log('date calendar to use in new appointment: ',dateBridge);
  
  // reminter list type
  var textMinute = $filter('translate')('minutesBefore');
  var textHour = $filter('translate')('hourBefore');
  var textDay = $filter('translate')('dayBefore');  
  $scope.reminderList = [{name: '5 '+textMinute,type: '1',value: '5'},{name: '15 '+textMinute,type: '1',value: '15'},
        {name: '30 '+textMinute,type: '1',value: '30'},{name: '45 '+textMinute,type: '1',value: '45'},
        {name: '1 '+textHour,type: '2',value: '1'},{name: '2 '+textHour,type: '2',value: '2'},
        {name: '3 '+textHour,type: '2',value: '3'},{name: '12 '+textHour,type: '2',value: '12'},
        {name: '1 '+textDay,type: '3',value: '1'},{name: '2 '+textDay,type: '3',value: '2'},];

  $scope.typeReminder = $scope.reminderList[0];

  // display the current day // start and end
  var date = dateBridge; 
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(0); 
  // $scope.dateStart = { value: date };
  $scope.dateStart = date;
  var dateToday = dateBridge;
  var datePlus = new Date(dateToday.setHours(dateToday.getHours()+1));
  datePlus.setMilliseconds(0);
  datePlus.setSeconds(0);
  datePlus.setMinutes(0);
  // $scope.dateEnd = { value: datePlus };
  $scope.dateEnd = datePlus;
  console.log('date start: ',$scope.dateStart);
  console.log('date end: ',$scope.dateEnd);

  var datePattern = $filter('translate')('datePattern');
  $scope.textButtonStart = getFormatDate.getStringDate($scope.dateStart,datePattern);
  $scope.textButtonEnd = getFormatDate.getStringDate($scope.dateEnd,datePattern);

  $scope.datePickerCallbackStart = function (val) {
      if(typeof(val)==='undefined'){      
        console.log('Date not selected');
      }else{
          console.log('Selected date is : ', val);
          $scope.dateEnd = val;
          $scope.dateStart = val;
          var datePattern = $filter('translate')('datePattern');
          $scope.textButtonStart = getFormatDate.getStringDate(val,datePattern);
          $scope.textButtonEnd = getFormatDate.getStringDate(val,datePattern);
      }
  };

  $scope.datePickerCallbackEnd = function (val) {
      if(typeof(val)==='undefined'){      
        console.log('Date not selected');
      }else{
          console.log('Selected date is : ', val);
          $scope.dateEnd = val;
          var datePattern = $filter('translate')('datePattern');
          $scope.textButtonEnd = getFormatDate.getStringDate(val,datePattern);  
      }
  };

  // $scope.changeValueStart = function(dateStart){
  //   $scope.dateEnd = { value:  dateStart};

  //   var datePattern = $filter('translate')('datePattern');
  //   $scope.textButtonStart = getFormatDate.getStringDate(dateStart,datePattern);
  // }

  // var datePattern = $filter('translate')('datePattern');
  // console.log("++++++++++++++datePattern",datePattern);
  // $scope.dateStart = $filter("date")($scope.dateStart, datePattern);

  $scope.endHourType = {};
  $scope.startHourType = {};

  // Simple POST request
  var request = $http({
    method: "get",        
    url: apiUrlLocal+NEW_APPOINTMENT_FORWARD 
  });
  request.success(
    function(data, status, headers, config) {    

      // call factory to validate the response
      PopupFactory.getPopup($scope,data);

      console.log("results of request: ",data);
      
      // list of type of appointments
      var appointmentTypeArray = data.mainData.appointmentTypeArray;  
      $scope.appointmentTypes = [];
        appointmentTypeArray.forEach(function(appointmentType) {           
          $scope.appointmentTypes.push({
            name: appointmentType.name,
            value:appointmentType.appointmentTypeId
          });       
      });  
      $scope.typeAppointment = $scope.appointmentTypes[0];

      var aHoursArray = data.mainData.hoursArray;
      $scope.hoursArray = [];    
      aHoursArray.forEach(function(aHour) {           
          $scope.hoursArray.push({
            name: aHour.label,
            value: aHour.value
          });       
      });
      $scope.startHourType = $scope.hoursArray[0];
      $scope.endHourType = $scope.hoursArray[0];

      var aMinutesArray = data.mainData.minutesArray;
      $scope.minutesArrayStart = [];    
      $scope.minutesArrayEnd = [];    
      aMinutesArray.forEach(function(aMinute) {           
          $scope.minutesArrayStart.push({
            name: aMinute.label,
            value: aMinute.value
          });       
          $scope.minutesArrayEnd.push({
            name: aMinute.label,
            value: aMinute.value
          });
      });
      $scope.startMinuteType = $scope.minutesArrayStart[0];
      $scope.endMinuteType = $scope.minutesArrayEnd[0];

  //     var datePattern = $filter('translate')('datePattern');
  // stringDateStart = getFormatDate.getStringDate($scope.dateStart.value,datePattern);
  // stringDateEnd = getFormatDate.getStringDate($scope.dateEnd.value,datePattern);
  
  // console.log('---===',stringDateStart);
  // console.log('---===',stringDateEnd);
  // document.getElementById("dateStartValue").value = stringDateStart;
  // document.getElementById("dateEndValue").value = stringDateEnd;
   // $scope.date = $filter("date")(Date.now(), 'yyyy.MM.dd');

    }).error(
    function(data, status, headers, config) {    
      console.log("problems with http request: get info new appointment",data);
    }
  );

  $scope.updateTypeAppointment = function (nTypeAppointment){
    $scope.typeAppointment = nTypeAppointment;
  }

  $scope.updateReminder = function(nTypeReminder){
    $scope.typeReminder = nTypeReminder;
  }

  // update date end with date start
  $scope.changeValue = function(dateStart){
    $scope.dateEnd = { value:  dateStart};

  //   var datePattern = $filter('translate')('datePattern');
  //   stringDateStart = getFormatDate.getStringDate($scope.dateStart.value,datePattern);
  //   stringDateEnd = getFormatDate.getStringDate($scope.dateEnd.value,datePattern);
  
  // console.log('---===',stringDateStart);
  // console.log('---===',stringDateEnd);
  document.getElementById("dateStartValue").value = "02.02.2015";
  // document.getElementById("dateEndValue").value = stringDateEnd;

  }

  // help function to update hour
  $scope.updateStartHour = function(nHourType){
    $scope.startHourType = nHourType;
    
    $scope.endHourType = $scope.hoursArray[$scope.hoursArray.length-1];
    $scope.hoursArray = $scope.hoursArray;
    for (i = 0; i < $scope.hoursArray.length-1; i++) {
      if(nHourType.value == $scope.hoursArray[i].value) {
        $scope.endHourType = $scope.hoursArray[i+1];
      }
    }  

    var val = nHourType.name;
    var sel = document.getElementById('endHour');
    var opts = sel.options;
    sel.selectedIndex = opts.length-1;
    
    for(j=0 ; j < opts.length-1 ; j++){
      if(opts[j].label == val) {
          sel.selectedIndex = j+1;
          break;
      }
    }

  }

  // help function to update hour
  $scope.updateEndHour = function(nHourType){
    $scope.endHourType = nHourType;
  }

  // help function to update minutes
  $scope.updateStartMinute = function(nStartMinute){
    $scope.startMinuteType = nStartMinute;

    for (i = 0; i < $scope.minutesArrayEnd.length; i++) {
      if(nStartMinute.value == $scope.minutesArrayEnd[i].value) {
        $scope.endMinuteType = $scope.minutesArrayEnd[i];
        break;
      }
    }
    var val = nStartMinute.name;
    var sel = document.getElementById('endMinute');
    var opts = sel.options;
    for(var opt, j = 0; opt = opts[j]; j++) {
        if(opt.label == val) {
            sel.selectedIndex = j;
            break;
        }
    }
  }

  // help function to update minutes
  $scope.updateEndMinute = function(nEndMinute){
    $scope.endMinuteType = nEndMinute;
  }

  $scope.maxLenght = function(text){
    $scope.entity.location = text.length > 30 ? text.substring(0,30) : text;
  }
  
  $scope.saveAppointment = function(){
    console.log('*******************************************************');
    console.log("==CONTROLLER SCHEDULE NEW APPOINTMENT==save appointment");
    console.log('save appointment entity: ',$scope.entity);
    console.log('save appointment type appointment',$scope.typeAppointment);
    console.log('save appointment date start',$scope.dateStart);
    console.log('save appointment date end',$scope.dateEnd);
    console.log('save appointment type reminder',$scope.entity.reminder);
    console.log('save appointment start hour: ',$scope.startHourType);
    console.log('save appointment start minutes: ',$scope.startMinuteType);
    console.log('save appointment end hour: ', $scope.endHourType);
    console.log('save appointment end minutes: ', $scope.endMinuteType);
    console.log('');

    // load into usint Form Data
    var fd = new FormData();
    fd.append('dto(op)', 'create');
    fd.append('dto(save)', 'save');
    fd.append('dto(title)', $scope.entity.title);
    fd.append('dto(appointmentTypeId)', $scope.typeAppointment.value);
    fd.append('dto(descriptionText)',$scope.entity.descriptionText);
    fd.append('dto(location)', $scope.entity.location);

    var datePattern = $filter('translate')('datePattern');
    var stringDateStart = "";
    var stringDateEnd = "";
    // if ($scope.dateStart.value != null) {
      stringDateStart = getFormatDate.getStringDate($scope.dateStart,datePattern);
    // }
    // if ($scope.dateEnd.value != null) {
      stringDateEnd = getFormatDate.getStringDate($scope.dateEnd,datePattern);
    // }
    fd.append('dto(startDate)', stringDateStart);
    fd.append('dto(startHour)',$scope.startHourType.value);
    fd.append('dto(startMin)', $scope.startMinuteType.value);
    fd.append('dto(endDate)', stringDateEnd);
    fd.append('dto(endHour)', $scope.endHourType.value);
    fd.append('dto(endMin)', $scope.endMinuteType.value);
    
    if ($scope.entity.isAllDay) {
      console.log('ppointment all day true');
      fd.append('dto(isAllDay)', $scope.entity.isAllDay);  
    }
    if ($scope.entity.isPrivate) {
      console.log('appointment private true');
      fd.append('dto(isPrivate)', $scope.entity.isPrivate);
    }
    if ($scope.entity.reminder) {
      console.log('appointment reminder true');

      fd.append('dto(reminder)', $scope.entity.reminder);
      fd.append('dto(reminderType)',$scope.typeReminder.type);
      fd.append('dto(timeBefore_1)',$scope.typeReminder.value);
      fd.append('dto(timeBefore_2)',$scope.typeReminder.value);
    }
      
    // ajax query post to create new appointment           
    $.ajax({
      url: apiUrlLocal+CREATE_APPOINTMENT_URL,
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data){

        var result = JSON.parse(data);
        if(result.forward == "Success")
        {
          console.log("Appointment create succesfull");
          $state.go('app.schedulerView');
        }
        else
        {        
          PopupFactory.getPopup($scope,result);
        }             
      }
    });

  }
});
