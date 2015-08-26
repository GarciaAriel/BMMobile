angular.module('starter.constantsSchedule',[])  

// add participant an appointment
.constant('ADD_PARTICIPANT','/bmapp/AppointmentParticipant/Create.do') 

// forwart new appointment
.constant('NEW_APPOINTMENT_FORWARD','/bmapp/Appointment/Forward/Create.do') 

// forward create participant an appointment
.constant('FORWARD_ADD_PARTICIPANT','/bmapp/AppointmentParticipant/Forward/Create.do') 

// see participants an appointment
.constant('DELETE_PARTICIPANT','/bmapp/AppointmentParticipant/Delete.do') 

// see participants an appointment
.constant('SEE_PARTICIPANTS','/bmapp/Appointment/ParticipantList.do') 

// create appointment
.constant('CREATE_APPOINTMENT_URL','/bmapp/Appointment/Create.do')

// update appointment
.constant('UPDATE_APPOINTMENT_URL','/bmapp/Appointment/Update.do')

// CONSTANTS TYPE SCHEDULE STRING
.constant('SCHEDULE_TYPE_MONTH_STRING','month')
.constant('SCHEDULE_TYPE_WEEK_STRING','week')
.constant('SCHEDULE_TYPE_DAY_STRING','day')

// CONSTANTS TYPE SCHEDULE INT
.constant('SCHEDULE_TYPE_MONTH',3)
.constant('SCHEDULE_TYPE_WEEK',2)
.constant('SCHEDULE_TYPE_DAY',1)

// DEFAULT TYPE OF CUSTOM FOLDER
.constant('FOLDE','default');
