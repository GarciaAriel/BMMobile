angular.module('starter.scheduleservices', [])

//SERVICE FORWARD ADD PARTICIPANTS
.factory('forwardAddParticipantService', function($resource,apiUrlLocal,FORWARD_ADD_PARTICIPANT) {
  var url = apiUrlLocal+FORWARD_ADD_PARTICIPANT;
  console.log('==SERVICE SCHEDULE== URL',url);
  return $resource(url,{},{'query':{method:'GET', isArray:false}}); 
})

//SERVICE SEE PARTICIPANTS
.factory('deleteParticipantService', function($resource,apiUrlLocal,DELETE_PARTICIPANT) {
  var url = apiUrlLocal+DELETE_PARTICIPANT;
  console.log('==SERVICE SCHEDULE== URL',url);
  return $resource(url,{},{'query':{method:'GET', isArray:false}}); 
})

//SERVICE SEE PARTICIPANTS
.factory('seeParticipantsService', function($resource,apiUrlLocal,SEE_PARTICIPANTS) {
  var url = apiUrlLocal+SEE_PARTICIPANTS;
  console.log('==SERVICE SCHEDULE== URL',url);
  return $resource(url,{},{'query':{method:'GET', isArray:false}}); 
})

//SERVICE RESOURCE QUERY
.factory('scheduleService', function($resource,apiUrlLocal,pathSchedule) {
  var url = apiUrlLocal+pathSchedule;
  console.log('==SERVICE SCHEDULE== URL',url);
  return $resource(url,{},{'query':{method:'GET', isArray:false}}); 
})

// SERVICE SAVE APPOINTMENT
.service('bridgeServiceAppointment', function() {
  var appointment = {};

  var saveAppointment = function(newAppointment) {
      appointment = newAppointment;
  };

  var getAppointment = function(){
      return appointment;
  };

  return {
    saveAppointment: saveAppointment,
    getAppointment: getAppointment
  };

})

// SERVICE
.service('timezone', function() {
  var timeZones = [{name: 'America/La_Paz', value: -4},{name: 'America/Godthab', value: -3}];
                           
  var getTimezone = function(text){
    var res = {};
    for (var i = 0; i < timeZones.length; i++) {
      if (timeZones[i].name == text) {
        console.log('timeZone service find ok ',timeZones[i]);
        res = timeZones[i];
        break;
      }
    }
    return res;
  };

  return {
    getTimezone: getTimezone
  };

})

// SERVICE SAVE DATE
.service('bridgeServiceDate', function() {
  var date = {};

  var saveDate = function(newDate) {
      date = newDate;
  };

  var getDate = function(){
      return date;
  };

  return {
    saveDate: saveDate,
    getDate: getDate
  };

})

// SERVICE TO GET FORMAT DATE
.factory('getFormatDate', function() {

    return {
      getStringDate:  function(date,datePattern) {
        console.log('----------------START----------------');
        console.log('function to change format date to: ',datePattern);
        var yyyy = date.getFullYear();
        var mm = (date.getMonth()+1).toString().length == 1 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
        var dd = (date.getDate()).toString().length == 1 ? "0"+(date.getDate()) : (date.getDate());

        var result = "";

        switch(datePattern) {
          case "MM/dd/yyyy":
              result = mm+'/'+dd+'/'+yyyy;
              break;
          case "dd.MM.yyyy":
              result = dd+'.'+mm+'.'+yyyy;
              break;
          case "dd/MM/yyyy":
              result = dd+'/'+mm+'/'+yyyy;
              break;
        } 
        console.log('final result: ',result);
        console.log('----------------END----------------');
        return result;
      }
    };

})

// SERVICE TO HELP LOAD OBJECT 'dataDate' AND CHANGE DAY TODAY
.factory('Load_variable_date', function(SCHEDULE_TYPE_DAY_STRING,SCHEDULE_TYPE_WEEK_STRING,SCHEDULE_TYPE_MONTH_STRING,SCHEDULE_TYPE_DAY,SCHEDULE_TYPE_WEEK,SCHEDULE_TYPE_MONTH,SCHEDULE_TYPE_MONTH_STRING,$localstorage) {
  return{

    newValue: function(yyyy,mm,ww,dd,view){      
      var _data_date = $localstorage.getObject('dataDate');
      switch(view) {
          case SCHEDULE_TYPE_MONTH_STRING:
              _data_date.type = SCHEDULE_TYPE_MONTH;
              _data_date.data = yyyy+""+mm;
              console.log("0. factory month: ",_data_date.data)
              break;
          case SCHEDULE_TYPE_WEEK_STRING: 
              _data_date.type = SCHEDULE_TYPE_WEEK;
              _data_date.data = _data_date.yyyyc+""+ww;
              console.log("0. factory week: ",_data_date.data)
              break;
          case SCHEDULE_TYPE_DAY_STRING:
              _data_date.type = SCHEDULE_TYPE_DAY;
              _data_date.data = yyyy+""+mm+""+dd;
              console.log("0. factory day: ",_data_date.data)
              break;    
      }
      $localstorage.setObject('dataDate',_data_date);    
      
    },    
    setData: function(){
      var date = new Date();

      var yyyy = date.getFullYear().toString();
      var ww = (date.getWeek()).toString().length == 1 ? "0"+(date.getWeek()).toString() : (date.getWeek()).toString();       
      var mm = (date.getMonth()+1).toString().length == 1 ? "0"+(date.getMonth()+1).toString() : (date.getMonth()+1).toString();
      var dd = (date.getDate()).toString().length == 1 ? "0"+(date.getDate()).toString() : (date.getDate()).toString();
        
      $localstorage.setObject('dataDate',{'yyyy':yyyy,'mm':mm,'ww':ww,'dd':dd,'yyyyc':yyyy,'mmc':mm,'wwc':ww,'ddc':dd,'data':yyyy+mm, 'type':SCHEDULE_TYPE_MONTH,'type_string':SCHEDULE_TYPE_MONTH_STRING});    
    },
    setDataToday: function(){
      var _data_date = $localstorage.getObject('dataDate');
      _data_date.yyyyc = _data_date.yyyy;
      _data_date.mmc = _data_date.mm;
      _data_date.wwc = _data_date.ww;
      _data_date.ddc = _data_date.dd;
        if (_data_date.type == 3) {_data_date.data = _data_date.yyyyc+_data_date.mmc};
        if (_data_date.type == 2) {_data_date.data = _data_date.yyyyc+_data_date.wwc};
        if (_data_date.type == 1) {_data_date.data = _data_date.yyyyc+_data_date.mmc+_data_date.ddc};
        
      $localstorage.setObject('dataDate',_data_date);    
    }
  }
})

//  HELP SERVICE TO NEXT OR ANT IN DAY, WEEK AND MONTH
.factory('schedule_calculate_Next_Ant', function($localstorage,SCHEDULE_TYPE_MONTH,SCHEDULE_TYPE_WEEK,SCHEDULE_TYPE_DAY) {
  return{
    go: function(tipo) {
      var _data_date = $localstorage.getObject('dataDate');
      var _data;
      var _type;
      
      var _current_date = new Date(parseInt(_data_date.yyyyc),parseInt(_data_date.mmc)-1,parseInt(_data_date.ddc));
      var _tomorrow = new Date(_current_date);

      // CHECK THE TYPE
      switch(_data_date.type) {
          case SCHEDULE_TYPE_MONTH:
              //month next or ant
              _current_date.setMonth(_current_date.getMonth()+tipo);
              
              // save year
              var _new_year = _current_date.getFullYear();
              _data_date.yyyyc = _new_year;
              
              // convert month to String + "0" and save mmc and data
              var _new_value = _current_date.getMonth()+1;
              if (_new_value<10) {_new_value = "0"+_new_value};
              _data_date.mmc = _new_value;
              _data_date.data = _data_date.yyyy+_new_value;
              break;
          case SCHEDULE_TYPE_WEEK: 
              //  date current add week or 7 day
              _tomorrow.setDate(_current_date.getDate()+(7*tipo));

              // save year
              var _new_year = _tomorrow.getFullYear();
              console.log("semanaaa yearrrrrr", _new_year);
              _data_date.yyyyc = _new_year+"";

              // convert month to String + "0" and save mmc
              var _new_value_month = _tomorrow.getMonth()+1;
              console.log("semanaaa monthhhhhhh", _new_value_month);
              if (_new_value_month<10) {_new_value_month = "0"+_new_value_month};
              _data_date.mmc = _new_value_month;
              
              // save week
              var _new_value = _tomorrow.getWeek();
              console.log("semanaaa week", _new_value);
              if (_new_value<10) {_new_value = "0"+_new_value};
              _data_date.wwc = _new_value;

              //  save day
              var _new_value_day = _tomorrow.getUTCDate()// (parseInt(_data_date.wwc))+tipo; 
              console.log("semanaaa dayyyyyyyy", _new_value_day);
              if (_new_value_day<10) {_new_value_day = "0"+_new_value_day};
              _data_date.ddc = _new_value_day;

              _data_date.data = _data_date.yyyyc+_data_date.wwc;
              break;
          case SCHEDULE_TYPE_DAY:
              //  date current add week or 7 day
              _tomorrow.setDate(_current_date.getDate()+tipo);

              // save year
              var _new_year = _tomorrow.getFullYear();
              console.log("semanaaa yearrrrrr", _new_year);
              _data_date.yyyyc = _new_year+"";

              // convert month to String + "0" and save mmc
              var _new_value_month = _tomorrow.getMonth()+1;
              console.log("semanaaa monthhhhhhh", _new_value_month);
              if (_new_value_month<10) {_new_value_month = "0"+_new_value_month};
              _data_date.mmc = _new_value_month;
              
              // save week
              var _new_value = _tomorrow.getWeek();
              console.log("semanaaa week", _new_value);
              if (_new_value<10) {_new_value = "0"+_new_value};
              _data_date.wwc = _new_value;

              //  save day
              var _new_value_day = _tomorrow.getUTCDate()// (parseInt(_data_date.wwc))+tipo; 
              console.log("semanaaa dayyyyyyyy", _new_value_day);
              if (_new_value_day<10) {_new_value_day = "0"+_new_value_day};
              _data_date.ddc = _new_value_day;
              
              _data_date.data = _data_date.yyyyc+_data_date.mmc+_data_date.ddc;
              break;    
      } 
      $localstorage.setObject('dataDate',_data_date);
    }
  }
})

.factory('getAppointments', function($http,apiUrlLocal,pathSchedule) {

    return { 
      getData:  function(_data_date) {

        return $http({
          method: 'get',
          url: apiUrlLocal+""+pathSchedule,
          async: false,
          data: {
            type: _data_date.type,
            calendar: _data_date.data 
          }
      }).then(function(result){
            return result.data;
        });
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