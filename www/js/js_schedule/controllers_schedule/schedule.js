angular.module('starter.scheduleController', ['starter.scheduleservices','ionic-datepicker'])

// 
// CONTROLLER SCHEDULE VIEW CALENDAR
// 
.controller('ControlSchedule',function(timezone,bridgeServiceDate,PopupFactory,getAppointments,$http,apiUrlLocal,pathSchedule,$ionicScrollDelegate,$state,$window,COLOR_VIEW,COLOR_2,$scope,Load_variable_date,schedule_calculate_Next_Ant,$q,scheduleService,$localstorage,SCHEDULE_TYPE_MONTH,SCHEDULE_TYPE_WEEK,SCHEDULE_TYPE_DAY,SCHEDULE_TYPE_MONTH_STRING,SCHEDULE_TYPE_WEEK_STRING,SCHEDULE_TYPE_DAY_STRING){
  console.log('*******************************************************');
  console.log("==CONTROLLER SCHEDULE VIEW CALENDAR==");

  // COLOR DEFAULT
  $scope.colorFont = COLOR_VIEW;
  $('button').css({"color":COLOR_2});
  $('view-title').css({"color":COLOR_2});

  $scope.calendar;
  $scope.accessRight = $localstorage.getObject('accessRight');
  $scope.newPermission = $scope.accessRight.APPOINTMENT.CREATE;
  console.log('Access right appointment create: ',$scope.newPermission);

  // GET USER INFO FOR LANGUAGE CALENDAR
  var userInfo = $localstorage.getObject('userInfo');
  $scope.languageCalendar = "";
  switch(userInfo.locale) {
    case 'es':
        $scope.languageCalendar = 'es-ES';
        break;
    case 'de':
        $scope.languageCalendar = 'de-DE';
        break;
    case 'fr':
        $scope.languageCalendar = 'fr-FR';
        break;    
  };

  console.log('------controller',userInfo.dateTimeZone);
  var timeZone = userInfo.dateTimeZone;
  
  //  LOAD OBJECT IN LOCAL STORAGE
  Load_variable_date.setData();

  //  GET OBJECT OF LOCAL STORAGE
  var _data_date = $localstorage.getObject('dataDate');

  var date = new Date();

  var yyyy = date.getFullYear().toString();
  var ww = (date.getWeek()).toString().length == 1 ? "0"+(date.getWeek()).toString() : (date.getWeek()).toString();       
  var mm = (date.getMonth()+1).toString().length == 1 ? "0"+(date.getMonth()+1).toString() : (date.getMonth()+1).toString();
  var dd = (date.getDate()).toString().length == 1 ? "0"+(date.getDate()).toString() : (date.getDate()).toString();

  //  HELP TO SEE DATE IN VIEW
  $scope.real_date_view = yyyy+"-"+mm+"-"+dd;

  var options = {
    events_source: function () {
        return [];
    },
    tmpl_path: 'lib/bootstrap-calendar/tmpls/',
    view: 'month',
    language: $scope.languageCalendar,
    time_zone_value: timeZone,
    tmpl_cache: false,
    day: yyyy+"-"+mm+"-"+dd,
    time_start: '06:00',
    time_end: '23:00',
    time_split: '60',
    width: '100%',   

    onClickADate: function(event) {
      console.log('*******************************************************');
    	var aux = this.innerHTML;
      var pos = aux.indexOf("data-cal-date=");
      var res = aux.substring(pos+15, pos+25);     
		  setTimeout(function(){
		    console.log('first name being reset');
			  $scope.$apply(function(){
				  $scope.real_date_view = res;
				})
		  }, 0);
    },
    onAfterViewLoad: function(view)
    {
      console.log('*******************************************************');     
      console.log('on after view load');     
      if ($scope.calendar != undefined) {
        console.log("see calendar: ",$scope.calendar);

        var yyyy = $scope.calendar.options.position.start.getFullYear();
        var mmm = ($scope.calendar.options.position.start.getMonth()+1);
        var ddd = ($scope.calendar.options.position.start.getDate());  
        var www = ($scope.calendar.options.position.start.getWeek());

        var mm = (mmm).toString().length == 1 ? "0"+(mmm).toString() : (mmm).toString();
        var dd = (ddd).toString().length == 1 ? "0"+(ddd).toString() : (ddd).toString();
        var ww = (www).toString().length == 1 ? "0"+(www).toString() : (www).toString();

        // load date in calendar view
        var realDate = $scope.calendar.options.day;
        $scope.real_date_view = realDate;

        Load_variable_date.newValue(yyyy,mm,ww,dd,$scope.calendar.options.view);

        var _data_date = $localstorage.getObject('dataDate');
      };
      
      $scope.appointments =[];
      var _data_date = $localstorage.getObject('dataDate');
      
      // EXECUTE QUERY WITH (type, calendar)
      $scope.newAppointments = scheduleService.query({type: _data_date.type,calendar: _data_date.data});

      // PROMISE
      $scope.newAppointments.$promise.then(function (results){

        // call factory to validate the response
        PopupFactory.getPopup($scope,results);

        console.log("results of request: ",results);

        $scope.listAppointments = (results['mainData'])['appointmentsList'];
    
  // console.log('-----=====',$scope.listAppointments[0]);  
  // var d = new Date(parseInt($scope.listAppointments[0].startMillis));
  // console.log('-----=====',d);
  // d.setUTCMilliseconds(3600000);
  // console.log('-----=====00000000000000000000000000',$scope.calendar);
  // aaaaaaa
  // console.log('-----=====',d);
// aaaaaa

// var userInfo = $localstorage.getObject('userInfo');
// console.log('timezone user',userInfo.dateTimeZone);
//   var res = timezone.getTimezone(userInfo.dateTimeZone);

        //parse to variables
        $scope.appointments = [];
        angular.forEach($scope.listAppointments, function (appointment) {

          // APPOINTMENT RECURRENT GET ID WITHOUT "-"
          var str = appointment.virtualAppointmentId;
          var pos = str.indexOf("-"); 
          var idAppointment = appointment.virtualAppointmentId;
          if (pos > -1) {
            idAppointment = str.substring(0, pos);   
            console.log("new id appointment without '-' IN RECURRENT", idAppointment);
          };

          // var startMillis = parseInt($scope.listAppointments[0].startMillis);
          // var endMillis = parseInt($scope.listAppointments[0].endMillis);
          // console.log('startMillis: ',startMillis);
          // console.log('endMillis: ',endMillis);
          
          // load appointment and push in list
          var change = {id: appointment.virtualAppointmentId, title: appointment.title, start: appointment.startMillis, end: appointment.endMillis ,body: appointment.location,url:'#app/schedulerDetail'+'?appointmentId=' +idAppointment};
          $scope.appointments.push(change);
      
        });

        console.log("final list of appointments: ",$scope.appointments);

        $scope.calendar.options.events = $scope.appointments;
        $scope.calendar._render();

        // get month string to show in view
        var realDate = $scope.calendar.options.day;
        var res = realDate.substring(5, 7); 
        var resInt = parseInt(res);

        var monthString = $scope.calendar.locale['m'+(resInt-1)];
        $scope.realMonth = monthString;
        
    });//END PROMISE
    
    },
    onAfterEventsLoad: function(events)
    {
      if(!events)
      {
        return;
      }
      var list = $('#eventlist');
      list.html('');
      $.each(events, function(key, val)
      {
        $(document.createElement('li'))
        .html('<a href="' + val.url + '">' + val.title + '</a>')
        .appendTo(list);
      });
    },
  };

 

  //LOAD OPTIONS TO CALENDAR
  $scope.calendar = $('#calendar').calendar(options);    
  $scope.calendar.setTimeZone('timezone');
  // FUNCTION NEXT FOR DAY WEEK AND MONTH  
  $scope.scheduleLoadAppointments = function(){
     return [];
  };   

  // FUNCTION NEXT/PREV FOR DAY WEEK AND MONTH  
  $scope.scheduleNext  = function(){
    $scope.calendar.navigate('next');
  };

  $scope.schedulePrev  = function(){
    $scope.calendar.navigate('prev');
  };

  $scope.scheduleToday  = function(){
    $scope.calendar.navigate('today');
  };

  $scope.dataScheduleMonth = function(){
    var _data_date = $localstorage.getObject('dataDate');
    _data_date.type = SCHEDULE_TYPE_MONTH;
    $localstorage.setObject('dataDate',_data_date);    
    $scope.calendar.view('month');
  };

  $scope.dataScheduleDay = function()    {
    var _data_date = $localstorage.getObject('dataDate');
    _data_date.type = SCHEDULE_TYPE_DAY;
    $localstorage.setObject('dataDate',_data_date);    

    $scope.calendar.view('day');
  };

  $scope.dataScheduleWekk = function(){
    var _data_date = $localstorage.getObject('dataDate');
    _data_date.type = SCHEDULE_TYPE_WEEK;
    $localstorage.setObject('dataDate',_data_date);    
    
    $scope.calendar.view('week');
  };

  $scope.doRefresh = function() {
    console.log('*******************************************************');
    console.log('refresh calendar');

    // GET OBJECT OF LOCAL STORAGE
    var _data_date = $localstorage.getObject('dataDate');

    // EXECUTE QUERY WITH (type, calendar)
    $scope.newAppointments = scheduleService.query({type: _data_date.type,calendar: _data_date.data});

      // PROMISE 
    $scope.newAppointments.$promise.then(function (results){
      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);
        
      $scope.listAppointments = (results['mainData'])['appointmentsList'];

      //parse to variables
      $scope.appointments = [];
      angular.forEach($scope.listAppointments, function (appointment) {

        // APPOINTMENT RECURRENT GET ID WITHOUT "-"
        var str = appointment.virtualAppointmentId;
        var pos = str.indexOf("-"); 
        var idAppointment = appointment.virtualAppointmentId;
        if (pos > -1) {
          idAppointment = str.substring(0, pos);   
          console.log("new id appointment without '-' IN RECURRENT", idAppointment);
        };
        
        var change = {id: appointment.virtualAppointmentId, title: appointment.title, start: appointment.startMillis, end: appointment.endMillis ,body: appointment.location,url:'#app/schedulerDetail'+'?appointmentId=' +idAppointment};
        $scope.appointments.push(change);
      });

      console.log("final list of appointments: ",$scope.appointments);

      $scope.$broadcast('scroll.refreshComplete');  

      //LOAD OPTIONS TO CALENDAR
      $scope.calendar.options.events = $scope.appointments;
      $scope.calendar._render();          
    });//END PROMISE

  };

  $scope.newevent = function(){
    // console.log('^^^^^^^^^^^^^^^^START^^^^^^^^^^^^^^^^');
    console.log('----------------START----------------');
    console.log('new event');

    var check = new Date();
    var from = $scope.calendar.options.position.start;
    var to = $scope.calendar.options.position.end;
    var result = from;
    if((check.getTime() <= to.getTime() && check.getTime() >= from.getTime())){
      console.log('date actual into range view');
      result = check;
    }
    bridgeServiceDate.saveDate(result);
    
    console.log('-------------END------------------');
    $state.go('app.newAppointment');
  };

});