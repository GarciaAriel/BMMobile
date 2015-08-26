// Ionic Starter App
    // var db = null;
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var starter = angular.module('starter', ['ionic','starter.constants','ui.router','starter.rolesroutes','starter.scheduleroutes','underscore', 'ngCordova', 'pascalprecht.translate', 'starter.controllers','starter.services','starter.webmailroutes','starter.contactroutes','starter.productRoutes','ngResource'])

.run(function(PopupFactory,apiUrlLocal,$http,$state,$localstorage,$translate,$cordovaNetwork,$ionicPopup,$ionicPlatform, $translate,$rootScope, $location, AuthenticationService, RoleService, SessionService) {  

  $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
      var permisos = RoleService.validateRoleAdmin(SessionService.currentUser);
  });

  $ionicPlatform.ready(function() {

    // Simple POST request to refresh info user
    var request = $http({
        method: "get",        
        url: apiUrlLocal+"/bmapp/Reload/UserInfo.do"
    });
    request.success(
        function(data, status, headers, config) {    
            
            if (data.forward != "SessionExpired") {
                $localstorage.setObject('accessRight',data.mainData.accessRight);
                $localstorage.setObject('userInfo',data.mainData.userInfo);
                if (data.mainData.userInfo.locale) {
                    $translate.use(data.mainData.userInfo.locale);
                }
                var User = $localstorage.get("currentUser");
                if( User == 'true') {
                  var accessRight = $localstorage.getObject('accessRight');
                  
                    if (accessRight.CONTACT.VIEW == "true") {
                        $state.go('app.contacts');
                    }
                    else{
                      if (accessRight.APPOINTMENT.VIEW == "true") {
                        $state.go('app.schedulerView');
                      }
                      else{
                        if (accessRight.MAIL.VIEW == "true") {
                          $state.go('app.mailboxes');
                        }
                        else{
                          if (accessRight.PRODUCT.VIEW == "true") {
                            $state.go('app.products');
                          }
                          else{
                            $state.go('app.startPage');  
                          }
                        }
                      }
                    }
                  
                }                
            }
            
            
    }).error(
    function(data, status, headers, config) {    
            console.log("problems with http request: reload user info",data);
        }
    );

          
    var userInfo = $localstorage.getObject('userInfo');
    
    if (userInfo.locale) {
        $translate.use(userInfo.locale);
    }
    else{
        var language = navigator.language;
        if( language.indexOf("fr") != -1){
          $translate.use("fr");  
        }
        else{
          if (language.indexOf("de") != -1) {
            $translate.use("de");
          }
          else{
            if (language.indexOf("es") != -1) {
              $translate.use("es");
            }
          }
        }    
    }
      
    
    var isOnline = $cordovaNetwork.isOnline()
    if(!isOnline)
    {
      var alertPopup = $ionicPopup.alert({
        title: 'No Internet Connection',
        template: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
      });
      alertPopup.then(function(res) {
        ionic.Platform.exitApp();
      });    
    }

    StatusBar.overlaysWebView(false);

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    if (window.cordova && window.cordova.plugins.Keyboard) 
    {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) 
    {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (typeof navigator.globalization !== "undefined"){
      navigator.globalization.getPreferredLanguage(function(language) {
       //alert((language.value).split("-")[0]);
       $translate.use((language.value).split("-")[0]).then(function(data) {
       //  alert(language.value);
       // $translate.use(language.value).then(function(data) {
        console.log("SUCCESS -> " + data);
      }, function(error) {
        console.log("ERROR -> " + error);
      });
     },null);
    }

    

  });
})

.config(['$httpProvider', function($httpProvider) {
  console.log('------credentials');
  $httpProvider.defaults.withCredentials = true;
  console.log('------credentials');
}])

.config(function($translateProvider) {

  $translateProvider.translations("en", {

    DeleteParticipant:"Delete participant",
    NewMail:"New e-mail",
    Vat:"VAT",
    NetPrice:"Net price",
    GrossPrice:"Gross price",
    EditAppointment:"Edit appointment",
    NewAppointment:"New appointment",
    Cc:"Cc",
    Bcc:"Bcc",
    dayBefore: "day before",
    hourBefore: "hour before",
    minutesBefore: "min before",
    products: "Products",
    before: "before",
    EditContactPerson: "Edit Contact Person",
    EditOrganization: "Edit Organization",
    EditPerson: "Edit Person",
    NewPerson: "New Person",
    NewContactPerson: "New Contact Person",
    NewOrganization : "New Organization",
    Photo: "Photo",
    SelectContact: "Select Contact",
    InsertTelecom: "Insert data of telecom",
    ConcurrencyFail: "Concurrency Fail",
    Error: "Error",
    AllDay: "All day",
    Recurrent: "Recurrent",
    datePattern: "MM/dd/yyyy",
    Street: "Street",
    Name: "Name",
    LastName: "Last name",
    FirstName: "First Name",
    Department: "Department",
    PersonType: "Person Type",
    Functionn: "Function",
    Country: "Country",
    Language: "Language",
    DataAccessSecurity: "Data Access Security",
    CommunicationInfo: "Communication Info",
    AdditionalInfo: "Additional Info",
    Close: "Close",
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday",
    Sunday: "Sunday",
    addContact: "Add contact",
    Funtion: "Function",
    From: "From",
    To: "To",
    DateMail: "Date",
    Subject: "Subject",
    Description: "Description",
    CheckFolder: "Please check your folder bm App.",
    Downloaded: "Downloaded",
    SelectAnother: "Please select another folder.",
    PulltoRefresh: "Please pull to refresh.",
    NoItems: "No Items",
    Messagefailed: "Please check your credentials.",
    MessageRequired: "Logon credentials invalid session.",
    Loading: "More features under construccion",
    Start: "Start", 
    End: "End",
    ReadMail: 'Read mail', 
    Mailboxes: 'Mailboxes',  
    Inbox: "Inbox",
    SentItems: "Sent Items",
    DraftItems: "Draft Items",
    Trash: "Trash",
    Outbox: "Outbox",
    Login: "Log on",
    Username: "Username",
    Password:   "Password",
    Company: "Company",
    Menu: "Menu",
    Contacts:   "Contacts",
    ContactPersons:   "Contact Persons",
    Scheduler: "Scheduler",
    Webmail: "Webmail",
    Logout: "Log out",
    Detail: "Detail",
    Address: "Address",
    Street: "Street",
    Zip: "Zip",
    City: "City",
    Communication: "Communication Info",
    Info: "Info",
    Search: "Search",
    Previous: "Previous",
    Today: "Today",
    Next: "Next",
    Month: "Month",
    Week: "Week",
    Daily: "Daily",
    Year: "Year",
    Day: "Day",
    AppointmentDetail: "Appointment Detail",
    Title: "Title",
    Type: "Type",
    Priority: "Priority",
    StartDate: "Start Date",
    Thisisanalldayappointment: "This is an all day appointment", 
    EndDate: "End Date",
    Recurrent: "Recurrent",
    Location: "Location",
    Reminder: "Reminder",
    Private: "Private"

  });
  $translateProvider.translations("es", {
    
    DeleteParticipant:"¿Eliminar participante?",
    NewMail:"Nuevo e-mail",
    Vat:"IVA",
    NetPrice:"Precio neto",
    GrossPrice:"Precio bruto",
    EditAppointment:"Modificar evento",
    NewAppointment:"Nuevo evento",
    Cc:"Cc",
    Bcc:"Bcc",
    dayBefore: "día antes",
    hourBefore: "horas antes",
    minutesBefore: "min antes",
    products: "Productos",
    before: "antes",
    EditContactPerson: "Editar Persona de Contacto",
    EditOrganization: "Editar Organizacion",
    EditPerson: "Editar Persona",
    NewPerson: "Nueva Persona",
    NewContactPerson: "Nueva Persona de Contacto",
    NewOrganization : "Nueva Organizacion",
    Photo: "Foto",
    SelectContact: "Seleccione Contacto",
    InsertTelecom: "Ingrese Informacion",
    ConcurrencyFail: "Fallo de Concurrencia",
    Error: "Error",
    AllDay: "Todo el dia",
    Recurrent: "Recurrente",
    datePattern: "dd/MM/yyyy",
    Street: "Calle",
    Name: "Nombre",
    LastName: "Apellido",
    FirstName: "Nombre",
    Department: "Departamento",
    PersonType: "Tipo de Persona",
    Functionn: "Función",
    Country: "País",
    Language: "Idioma",
    DataAccessSecurity: "Seguridad de acceso a datos",
    CommunicationInfo: "Datos de Comunicación",
    AdditionalInfo: "Información Adicional",
    Close: "Cerrar",
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
    addContact: "Agregar contacto",
    Funtion: "Funcion",
    From: "De",
    To: "A",
    DateMail: "Fecha",
    Subject: "Asunto",
    Description: "Descripcion",
    CheckFolder: "Por favor revise su carpeta de bm App.",
    Downloaded: "Descargado",
    SelectAnother: "Por favor, seleccione otra carpeta.",
    PulltoRefresh: "Por favor, deslice para refrescar.",
    NoItems: "No hay artículos",
    Messagefailed: "Por favor compruebe sus credenciales.",
    MessageRequired: "Credenciales de inicio de sesión no válidos.",
    Loading: "Mas funcionalidades en construccion",
    Start: "Inicio",
    End: "Fin",  
    ReadMail: 'Leer email', 
    Mailboxes: 'Carpetas',
    Inbox: "Bandeja de entrada",
    SentItems: "Elementos enviados",
    DraftItems: "Borrador",
    Trash: "Basurero",
    Outbox: "Bandeja de salida",
    Login: "Ingresar",
    Username: "Usuario",
    Password: "Contraseña",
    Company: "Compañia",
    Menu: "Menu",
    Contacts:   "Contactos",
    ContactPersons: "Personas de contacto",
    Scheduler: "Calendario",
    Webmail: "Webmail",
    Logout: "Salir", 
    Detail: "Detalle",
    Address: "Direccion",
    Street: "Calle",
    Zip: "Zip",
    City: "Ciudad",
    Communication: "Información de comunicaciones",
    Info: "Info",
    Search: "Buscar",
    Previous: "Anterior",
    Today: "Hoy",
    Next: "Siguiente",
    Month: "Mes",
    Week: "Semana",
    Daily: "Diario",
    Year: "Año",
    Day: "Dia",
    AppointmentDetail: "Detalle de Evento",
    Title: "Titulo",
    Type: "Tipo",
    Priority: "Prioridad",
    StartDate: "Fecha de inicio",
    Thisisanalldayappointment: " Evento de todo el día ", 
    EndDate: "Fecha de finalización",
    Recurrent: "Recurrente",
    Location: "Localización",
    Reminder: "Recordatorio",
    Private: "Privado"
  });



  $translateProvider.translations("de", {
    
    DeleteParticipant:"Gruppe entfernen",
    NewMail:"eMail schreiben",
    Vat:"USt.",
    NetPrice:"Nettopreis",
    GrossPrice:"Bruttopreis",
    EditAppointment:"Termin bearbeiten",
    NewAppointment:"Neuer Termin",
    Cc:"CC",
    Bcc:"BCC",
    dayBefore: "tag(e) vorher",
    hourBefore: "Stunde(n) vorher",
    minutesBefore: "minuten vorher",
    products: "Produkte",
    before: "vorher",
    EditContactPerson: "Bearbeiten Kontaktperson",
    EditOrganization: "Bearbeiten Organisation",
    EditPerson: "Bearbeiten Person",
    NewPerson: "Neue Person",
    NewContactPerson: "Neue Kontaktperson",
    NewOrganization : "Neue Organisation",
    Photo: "Bild",
    SelectContact: "Wählen Sie einen Kontakt",
    InsertTelecom: "Einfügen von Daten der Telekom-",
    ConcurrencyFail: "Concurrency Ausfallen",
    Error: "Fehler",
    AllDay: "Ganztägig",
    Recurrent: "Wiederkehrender Termin",
    datePattern: "dd.MM.yyyy",
    Street: "Straße",
    Name: "Name",
    LastName: "Nachname",
    FirstName: "Vorname",
    Department: "Abteilung",
    PersonType: "Person Art",
    Functionn: "Funktion",
    Country: "Land",
    Language: "Sprache",
    DataAccessSecurity: "Zugriffsrechte",
    CommunicationInfo: "Kommunikations info",
    AdditionalInfo: "Zusätzliche Informationen",
    Close: "Schließen",
    Monday: "Montag",
    Tuesday: "Dienstag",
    Wednesday: "Mittwoch",
    Thursday: "Donnerstag",
    Friday: "Freitag",
    Saturday: "Samstag",
    Sunday: "Sonntag",
    addContact: "Kontakt hinzufügen",
    Funtion: "Funktion",
    From: "Von",
    To: "An",
    DateMail: "Datum",
    Subject: "Betreff",
    Description: "Beschreibung",
    CheckFolder: "Bitte überprüfen Sie Ihre Ordner bm App.",
    Downloaded: "Heruntergeladen",
    SelectAnother: "Bitte wählen Sie einen anderen Ordner",
    PulltoRefresh: "Bitte ziehen Sie zur Erfrischung.",
    NoItems: "Keine Einträge",
    Messagefailed: "Bitte überprüfen Sie Ihre Anmeldeinformationen.",
    MessageRequired: "Anmeldeinformationen ungültig Sitzung.",
    Loading: "Mehrere Funktionen unter construccion",
    Start: "Anfang", 
    End: "Ende",
    ReadMail: 'eMail lesen', 
    Mailboxes: 'Mailboxes',
    Inbox: "Posteingang",
    SentItems: "Gesendet",
    DraftItems: "Entwurf",
    Trash: "Papierkorb",
    Outbox: "Postausgang",
    Login: "Anmeldung",
    Username: "Benutzername",
    Password: "Kennwort",
    Company: "Firma",
    Menu: "Menü",
    Contacts:   "Kontakte",
    ContactPersons: "Kontaktpersonen",
    Scheduler: "Termine",
    Webmail: "Webmail",
    Logout: "Abmelden", 
    Detail: "Allgemein",
    Address: "Anschrift",
    Street: "Straße",
    Zip: "PLZ",
    City: "Ort",
    Communication: "Kontakt",
    Info: "Info",
    Search: "Suche",
    Previous: "früher",
    Today: "heute",
    Next: "nächster",
    Month: "Monat",
    Week: "Woche",
    Daily: "Täglich",
    Year: "Jahr",
    Day: "Tag",
    AppointmentDetail: "Termin Allgemein",
    Title: "Termin",
    Type: "Terminart",
    Priority: "Priorität",
    StartDate: "Beginn",
    Thisisanalldayappointment: "ganztägig", 
    EndDate: "Ende",
    Recurrent: "Wiederkehrender Termin",
    Location: "Ort",
    Reminder: "Erinnerung ",
    Private: "Privat"
  });



  $translateProvider.translations("fr", {
    
    DeleteParticipant:"Supprimer participant?",
    NewMail:"Nouveau e-mail",
    Vat:"TVA",
    NetPrice:"Prix net",
    GrossPrice:"Prix brut",
    EditAppointment:"Modifier un événement",
    NewAppointment:"Nouvel événement",
    Cc:"Cc",
    Bcc:"Bcc",
    dayBefore: "jour avant",
    hourBefore: "heures avant",
    minutesBefore: "minutes avant",
    products: "Produits",
    before: "avant",
    EditContactPerson: "Modifier Personne de Contact",
    EditOrganization: "Modifier Organisation",
    EditPerson: "Modifier Personne",
    NewPerson: "Nouvelle Personnet",
    NewContactPerson: "Nouvelle Personne de Contact",
    NewOrganization : "Nouvelle Organisation",
    Photo: "Photo",
    SelectContact: "Sélectionnez Contact",
    InsertTelecom: "Insérer des données de télécommunications ",
    ConcurrencyFail: "Concurrence Fail",
    Error: "Erreur",
    AllDay: "Toute la journée",
    Recurrent: "Récurrent(e)",
    datePattern: "dd/MM/yyyy",
    Street: "Rue",
    Name: "Nom",
    LastName: "Nom de Famille",
    FirstName: "Prénom",
    Department: "Département",
    PersonType: "Type de Personne",
    Functionn: "Fonction",
    Country: "Pays",
    Language: "Langue",
    DataAccessSecurity: "Sécurité d'accès aux données",
    CommunicationInfo: "Infos de Communication",
    AdditionalInfo: "Information Additionnelle",
    Close: "Près",
    Monday: "Lundi",
    Tuesday: "Mardi",
    Wednesday: "Mercredi",
    Thursday: "Jeudi",
    Friday: "Vendredi",
    Saturday: "Samedi",
    Sunday: "Dimanche",
    addContact: "Ajouter Le Contact",
    Funtion: "Fonction",
    From: "De",
    To: "A",
    DateMail: "Date",
    Subject: "Affaire", 
    Description: "Description",
    CheckFolder: "Se il vous plaît vérifier votre dossier bm App.", 
    Downloaded: "Téléchargé", 
    SelectAnother: "Se il vous plaît sélectionner un autre dossier", 
    PulltoRefresh: "Se il vous plaît tirer pour rafraîchir.", 
    NoItems: "Aucun article", 
    Messagefailed: "Se il vous plaît vérifier vos informations d'identification.",
    MessageRequired: "Références de connexion de session valide.",  
    Loading: "Plusieurs fonctions sous construccion", 
    Start: "Début",
    End: "Fin",
    ReadMail: 'Lire e-mail',         
    Mailboxes: 'Dossiers',    
    Inbox: "Plateau d'entrée",
    SentItems: "Eléments envoyés",
    DraftItems: "Brouillon",
    Trash: "Corbeille",
    Outbox: "Plateau de sortie",
    Login: "Connexion",
    Username: "Utilisateur",
    Password: "Mot de passe",
    Company: "Société",
    Menu: "Menu",
    Contacts:   "Contacts",
    ContactPersons: "Personnes de contact",
    Scheduler: "Scheduler",
    Webmail: "Webmail",
    Logout: " Sortir",
    Detail: "Détail",
    Address: "Adresse",
    Street: "Rue",
    Zip: "Zip",
    City: "Ville",
    Communication: "Information de communications",
    Info: "Infos",
    Search: "Rechercher",
    Previous: "précédent",
    Today: "aujourd'hui",
    Next: "suivant",
    Month: "Mois",
    Week: "Semaine",
    Daily: "Journal",
    Year: "Année",
    Day: "Jour",
    AppointmentDetail: "Événement Détail",
    Title: "Titre",
    Type: "Tipy",
    Priority: "Priorité",
    StartDate: "Date de début",
    Thisisanalldayappointment: "Événement de toute la journée", 
    EndDate: "Fin de date",
    Recurrent: "Récurrent(e)",
    Location: "Localisation",
    Reminder: "Rappel",
    Private: "Privé"
  });

  $translateProvider.preferredLanguage("en");
  $translateProvider.fallbackLanguage("en");
});
