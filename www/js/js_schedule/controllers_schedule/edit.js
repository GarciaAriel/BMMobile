angular.module('starter.scheduleControllerEdit', ['starter.scheduleservices','ionic-datepicker'])

// 
// CONTROLLER SCHEDULE EDIT
//
.controller('ControllerScheduleEdit', function(UPDATE_APPOINTMENT_URL,$state,PopupFactory,apiUrlLocal,getFormatDate,$filter,$scope,bridgeServiceAppointment){
  
  console.log('*******************************************************');
  console.log("==CONTROLLER SCHEDULE== edit appointment");

  // GET OBJECT APPOINTMET TO EDIT
  $scope.viewTitle = $filter('translate')('EditAppointment');
  var mainData = bridgeServiceAppointment.getAppointment();
  console.log("recover mainData: ",mainData);

  $scope.entity = mainData.entity;

  // prepare info to view
  // display the current day // start and end
  $scope.dateStart = new Date(parseInt($scope.entity.startDateTime,10));
  $scope.dateEnd = new Date(parseInt($scope.entity.endDateTime,10));
  // $scope.dateStart = { value: dateStart };
  // $scope.dateEnd = { value: dateEnd };
  $scope.entity.isAllDay  = $scope.entity.isAllDay == 'true' ? true : false;
  $scope.entity.reminder  = $scope.entity.reminder == 'true' ? true : false;
  $scope.entity.isPrivate = $scope.entity.isPrivate == 'true' ? true : false;
  $scope.entity.isRecurrence = $scope.entity.isRecurrence == 'true' ? true : false;

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

  var aTypesArray = mainData.appointmentTypeArray;
  $scope.appointmentTypes = [];  
  aTypesArray.forEach(function(aType) {           
      $scope.appointmentTypes.push({
        name: aType.name,
        value: aType.appointmentTypeId
      });       
      if($scope.entity.appointmentTypeId == aType.appointmentTypeId) {             
         $scope.typeAppointment = $scope.appointmentTypes[$scope.appointmentTypes.length-1];  
      } 
  });

  var aHoursArray = mainData.hoursArray;
  $scope.hoursArray = [];    
  aHoursArray.forEach(function(aHour) {           
      $scope.hoursArray.push({
        name: aHour.label,
        value: aHour.value
      });       
      if($scope.entity.startHour == aHour.value) {             
         $scope.startHourType = $scope.hoursArray[$scope.hoursArray.length-1];  
      }
      if($scope.entity.endHour == aHour.value) {             
         $scope.endHourType = $scope.hoursArray[$scope.hoursArray.length-1];  
      }
  });
  
  var aMinutesArray = mainData.minutesArray;
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
      if($scope.entity.startMin == aMinute.value) {             
         $scope.startMinuteType = $scope.minutesArrayStart[$scope.minutesArrayStart.length-1];  
      }
      if($scope.entity.endMin == aMinute.value) {             
         $scope.endMinuteType = $scope.minutesArrayEnd[$scope.minutesArrayEnd.length-1];  
      }
  });

  // var prioritiesArray = mainData.priorityArray;
  // $scope.priorities = [];    
  // prioritiesArray.forEach(function(priority) {           
  //     $scope.priorities.push({
  //       name: priority.name,
  //       value:priority.priorityId
  //     });       
  //     if($scope.entity.priorityId == priority.priorityId) {             
  //        $scope.priority = $scope.priorities[$scope.priorities.length-1];  
  //     } 
  // });

  var textMinute = $filter('translate')('minutesBefore');
  var textHour = $filter('translate')('hourBefore');
  var textDay = $filter('translate')('dayBefore');  
  $scope.reminderList = [{name: '5 '+textMinute,type: '1',value: '5'},{name: '15 '+textMinute,type: '1',value: '15'},
        {name: '30 '+textMinute,type: '1',value: '30'},{name: '45 '+textMinute,type: '1',value: '45'},
        {name: '1 '+textHour,type: '2',value: '1'},{name: '2 '+textHour,type: '2',value: '2'},
        {name: '3 '+textHour,type: '2',value: '3'},{name: '12 '+textHour,type: '2',value: '12'},
        {name: '1 '+textDay,type: '3',value: '1'},{name: '2 '+textDay,type: '3',value: '2'},];
  $scope.typeReminder = $scope.reminderList[0];

  // search type of rimender type by id
  if ($scope.entity.reminder == true) {
    $scope.typeReminder = $scope.reminderList.filter(function ( obj ) {
      if (obj.type === $scope.entity.reminderType) {
        if (obj.type == '1') {
          if (parseInt(obj.value) == parseInt($scope.entity.timeBefore_1) ) {
            return obj;
          }
        }
        else{
          if (parseInt(obj.value) == parseInt($scope.entity.timeBefore_2) ) {
            return obj;
          }
        }
      }
    })[0];  

    // add new value if not exist
    if ($scope.typeReminder == undefined) {
      var newType = $scope.entity.reminderType;
      var newTimeBefore1 = $scope.entity.timeBefore_1;
      var newTimeBefore2 = $scope.entity.timeBefore_2;

      if (newType == '1') {
        var text = newTimeBefore1+' '+'minutos';
        $scope.typeReminder = {name: text,type: newType, value: newTimeBefore1};
        $scope.reminderList.unshift($scope.typeReminder);  
      }
      else{
        if (newType == '2') {
          var text = newTimeBefore2+' '+'hour';
          $scope.typeReminder = {name: text,type: newType, value: newTimeBefore1};
          $scope.reminderList.unshift($scope.typeReminder);     
        }
        else{
          var text = newTimeBefore2+' '+'day';
          $scope.typeReminder = {name: text,type: newType, value: newTimeBefore2};
          $scope.reminderList.unshift($scope.typeReminder);    
        }
      }
    }
  }
  
  console.log('reminder type: ',$scope.typeReminder);
 
  // help function to update reminder
  $scope.updateReminder = function(nTypeReminder){
    $scope.typeReminder = nTypeReminder;
  };

  // update date end with date start
  $scope.changeValue = function(dateStart){
    $scope.dateEnd = { value:  dateStart};
  }

  $scope.maxLenght = function(text){
    $scope.entity.location = text.length > 30 ? text.substring(0,30) : text;
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
  };

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
  $scope.updateEndMinute = function(nMinuteType){
    $scope.endMinuteType = nMinuteType;
  };

  // help function to update type
  $scope.updateTypeAppointment = function (nTypeAppointment)
  {
    $scope.typeAppointment = nTypeAppointment;
  }
  // help function to update appointment
  $scope.saveAppointment = function(){
    console.log('*******************************************************');
    console.log("==CONTROLLER SCHEDULE UPDATE APPOINTMENT== update appointment");
    console.log('update appointment entity: ',$scope.entity);
    console.log('update appointment type appointment',$scope.typeAppointment);
    console.log('update appointment date start',$scope.dateStart);
    console.log('update appointment date end',$scope.dateEnd);
    console.log('update appointment type reminder',$scope.typeReminder);
    
    var fd = new FormData();
    fd.append('dto(op)', 'update');
    fd.append('dto(save)', 'save');
    fd.append('dto(appointmentId)',$scope.entity.appointmentId);
    fd.append('dto(version)',$scope.entity.version);
    fd.append('dto(appointmentTypeId)', $scope.typeAppointment.value);
    fd.append('dto(reminder)', $scope.entity.reminder);

    if ($scope.entity.title != undefined) {
      fd.append('dto(title)', $scope.entity.title);
    }
    else{
     fd.append('dto(title)', ""); 
    }

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

      fd.append('dto(reminderType)',$scope.typeReminder.type);
      fd.append('dto(timeBefore_1)',$scope.typeReminder.value);
      fd.append('dto(timeBefore_2)',$scope.typeReminder.value);
    }

    if ($scope.entity.isRecurrence) {
     fd.append('dto(isRecurrence)',$scope.entity.isRecurrence); 
    }
    else{
     fd.append('dto(isRecurrence)',false);  
    }
    
    var datePattern = $filter('translate')('datePattern');
    var stringDateStart = "";
    var stringDateEnd = "";
    // if ($scope.dateStart != null) {
      stringDateStart = getFormatDate.getStringDate($scope.dateStart,datePattern);
    // }
    // if ($scope.dateEnd != null) {
      stringDateEnd = getFormatDate.getStringDate($scope.dateEnd,datePattern);
    // }
    fd.append('dto(startDate)', stringDateStart);
    fd.append('dto(startHour)',$scope.startHourType.value);
    fd.append('dto(startMin)', $scope.startMinuteType.value);
    fd.append('dto(endDate)', stringDateEnd);
    fd.append('dto(endHour)', $scope.endHourType.value);
    fd.append('dto(endMin)', $scope.endMinuteType.value);
    
    fd.append('dto(location)',$scope.entity.location);
    fd.append('dto(descriptionText)',$scope.entity.descriptionText);
               
    $.ajax({
      url: apiUrlLocal+UPDATE_APPOINTMENT_URL,
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data){

        var result = JSON.parse(data);
        if(result.forward == "Success"){
          console.log("Appointment update succesfull");
          $state.go('app.schedulerView');
        }
        else{        
          // call factory to validate the response
          PopupFactory.getPopup($scope,result);
        }             
      }
    });
  }
});
