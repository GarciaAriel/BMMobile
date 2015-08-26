angular.module('starter.constantscontact',[])  

//CONSTANTS FOR CONTACTS
//type of contact
// Contact person>1
.constant('PersonType',1)
// contact Organiztion or company> 0
.constant('OrgType',0)

// create person and organization
.constant('CREATE_PER_AND_ORG_URL','/bmapp/Address/Create.do')

// forward new person and organization
.constant('FORWARD_NEW_PER_AND_ORG_URL','/bmapp/Address/Forward/Create.do')

// update person url
.constant('UPDATE_PER_AND_ORG_URL','/bmapp/Address/Update.do')

// get cities of a country
.constant('GET_CITIES_OF_COUNTRY_URL','/bmapp/Country/City.do') 

// ***************************CONTACT PERSON**********************
// edit contact person
.constant('EDIT_CONTACT_PERSON_URL','/bmapp/ContactPerson/Update.do')

// create contact person
.constant('CREATE_CONTACT_PERSON_URL','/bmapp/ContactPerson/Create.do')

// new contact person forward
.constant('FORWARD_NEW_CONTACT_PERSON_URL','/bmapp/ContactPerson/Import.do')

// ***************************HELP**********************

.constant('newPersonGetJsonInfo','/bmapp/Address/Forward/Create.do');