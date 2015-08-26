angular.module('starter.constants',[])  

//.constant('apiUrlLocal', 'http://localhost:8080/bm')
 .constant('apiUrlLocal', 'http://10.0.0.100:8080/bm')
// .constant('apiUrlLocal', 'http://192.168.1.132:8080/bm')

// .constant('apiUrlLocal', 'http://10.0.0.11/bm')
// .constant('apiUrlLocal', 'https://dev.jatun.net/bm')

// .constant('apiUrlLocal', '/bm')

//path contact
.constant('pathContactPerson', '/bmapp/ContactPerson/List.do')

//path contact person detail
.constant('pathContactPersonDetail', '/bmapp/ContactPerson/Forward/Update.do')

//path contact
.constant('pathContact', '/bmapp/Contact/REST.do')

// path recent contact
.constant('recentContact', '/bmapp/Contact/Recent/List.do')

//path schedule
.constant('pathSchedule', '/bmapp/Appointment/REST.do')

//path logon
.constant('pathLogon','/bmapp/LogonBMApp.do')

//path logout
.constant('pathLogout','/bmapp/LogoffBMApp.do')

//path list To Add Contact Person
.constant('pathListToAddContactPerson','/bmapp/ContactPerson/SearchContact.do')

//color view
.constant('COLOR_VIEW','color: #ba0808')
.constant('COLOR_2','#ba0808');
// .constant('COLOR_VIEW','color: #1A36A7')