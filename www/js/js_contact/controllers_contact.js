angular.module('starter.contactcontrollers',['starter.contactservices','starter.constantscontact'] )
 
.controller('editPersonCtrl', function($cacheFactory,UPDATE_PER_AND_ORG_URL,GET_CITIES_OF_COUNTRY_URL,$ionicPopup,$filter,$ionicHistory,$state,$cordovaCamera,$cordovaImagePicker,PersonType,PopupFactory,apiUrlLocal,$http,transformRequestAsFormPost,bridgeService,$scope,COLOR_VIEW, $stateParams,apiUrlLocal,$localstorage) {
    $scope.apiUrlLocal = apiUrlLocal;
    $scope.colorFont = COLOR_VIEW;
    $scope.ntitle = $filter('translate')('EditPerson');
    $scope.ntitleCommunication = $filter('translate')('CommunicationInfo');
    $scope.DataAccessSecurity = $filter('translate')('DataAccessSecurity');
    $scope.AdditionalInfo = $filter('translate')('AdditionalInfo');
    // get contact for edit
    var mainData = bridgeService.getContact();
    $scope.entity = mainData.entity;
    $scope.maindata = mainData;

    $scope.iframeWidth = $(window).width();

    console.log("==EDIT PERSON CONTROLLER==  get maindata:", $scope.maindata);

    var countryArray = $scope.maindata.countryArray;
    $scope.countries = [];    
    countryArray.forEach(function(country) {           
        $scope.countries.push({
          name: country.name,
          value:country.countryId
        });       
        if($scope.entity.countryId == country.countryId) {             
           $scope.country = $scope.countries[$scope.countries.length-1];  
        } 
    });    

    var languageArray = $scope.maindata.languageArray;
    $scope.languages = [];    
    languageArray.forEach(function(language) {           
        $scope.languages.push({
          name: language.name,
          value:language.languageId
        });       
        if($scope.entity.languageId == language.languageId) {             
           $scope.language = $scope.languages[$scope.languages.length-1];  
        } 
    });  

    var telecomTypeArray = $scope.maindata.telecomTypeArray;
    $scope.telecoms = []      
    telecomTypeArray.forEach(function(telecom) {           
      $scope.telecoms.push({
          name: telecom.telecomTypeName,
          value:telecom.telecomTypeId,
      });                  
    }); 

    var groupsArray = $scope.maindata.dataAccessUserGroupArray;
    $scope.GroupsAvailable = [];
    groupsArray.forEach(function(group) {  
        var array =  $scope.entity.accessUserGroupIds.split(',');
        var value = false;
        if(array.indexOf(group.userGroupId) != -1){
          value = true;
        }                
        $scope.GroupsAvailable.push({
          name: group.name,
          userGroupId: group.userGroupId,
          value : value
        });                  
    });   

     if($scope.entity.countryId != "" && $scope.entity.cityId == ""){
       var cityRequest = $http({
        method: "post",        
        url: apiUrlLocal+GET_CITIES_OF_COUNTRY_URL,
        data: {
            'countryId' : $scope.entity.countryId 
         }
      });
      cityRequest.success(
        function(data, status, headers, config) {      

          // call factory 
          PopupFactory.getPopup($scope,data);

          var cityArray = data.mainData.cityArray;
          $scope.cities = [];    
          cityArray.forEach(function(city) {           
              $scope.cities.push({
                name: city.cityName,
                value:city.cityId, 
                zip: city.zip,             
              });                     
          });    
      });
    }

    if($scope.entity.cityId != ""){
      var cityRequest = $http({
        method: "post",        
        url: apiUrlLocal+GET_CITIES_OF_COUNTRY_URL,
        data: {
            'countryId' : $scope.country.value
         }
      });
      cityRequest.success(
        function(data, status, headers, config) {      

          // call factory 
          PopupFactory.getPopup($scope,data);

          var cityArray = data.mainData.cityArray;
          $scope.cities = [];    
          cityArray.forEach(function(city) {           
              $scope.cities.push({
                name: city.cityName,
                value:city.cityId, 
                zip: city.zip,             
              });   
              if($scope.entity.cityId == city.cityId) {             
                 $scope.city = $scope.cities[$scope.cities.length-1];  
              }                  
          });    
      });
    }

    $scope.choices = [];  

    $scope.entity.telecoms.forEach(function(telecom){      
        telecom.telecomList.forEach(function(item){

          var newItemNo = $scope.choices.length+1;          
          $scope.telecoms.forEach(function(telecomearr){
            if(telecomearr.value == telecom.telecomTypeId)
              $scope.auxvar=telecomearr;
          });
      
          $scope.choices.push({'id':newItemNo, value:item.data, telecom: $scope.auxvar });
        });        
    });    

    $scope.addNewChoice = function(value,telecom) {  
      if(value != undefined && telecom != undefined && value != ""){ 
        var newItemNo = $scope.choices.length+1;
        $scope.choices.push({'id':newItemNo, value:value, telecom:telecom});    
      }       
    };
      
    $scope.removeChoice = function(choice) {
      var index = $scope.choices.indexOf(choice);    
      $scope.choices.splice(index,1);
    };    

    function convertImgToBase64(url, callback, outputFormat){
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
          var canvas = document.createElement('CANVAS');
          var ctx = canvas.getContext('2d');
        canvas.height = this.height;
        canvas.width = this.width;
          ctx.drawImage(this,0,0);
          var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg');
          callback(dataURL);
          canvas = null; 
      };
      img.src = url;
    }

    $scope.pickerImage= function (){
      var options = {
      maximumImagesCount: 1,
      width: 300,
      height: 300,
      quality: 75
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {          
            convertImgToBase64(results[0], function(base64Img){
                $scope.$apply(function(){
                  $scope.imgURI=base64Img;
                })           
            });      
        }, function(error) {
          // error getting photos
        })
    };
    
    $scope.takePicture = function() {
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {      
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
          // An error occured. Show a message to the user
      });
    }

    $scope.updateCountry = function (ncountry)
    {
      $scope.country = ncountry; 
      $scope.city =  undefined; 
      var cityRequest = $http({
        method: "post",        
        url: apiUrlLocal+GET_CITIES_OF_COUNTRY_URL,
        data: {
            'countryId' : ncountry.value
         }
      });
      cityRequest.success(
        function(data, status, headers, config) {      

          // call factory 
          PopupFactory.getPopup($scope,data);

          var cityArray = data.mainData.cityArray;
          $scope.cities = [];    
          cityArray.forEach(function(city) {           
              $scope.cities.push({
                name: city.cityName,
                value:city.cityId, 
                zip: city.zip,             
              });                     
          });    
      });
   
    }

    $scope.updateLanguage = function (nlanguage)
    {
      $scope.language = nlanguage;     
    }

    $scope.updateCity = function (ncity)
    {
      $scope.city = ncity;     
    }

    verifyIndexTelecom = function(contIndexTelecom,choice){
      respCont = 0;
      enterIn = false;
      contIndexTelecom.forEach(function(cont){
        if(cont.id == choice.telecom.value)
        {
          cont.cont = cont.cont + 1;
          respCont= cont.cont;
          enterIn = true;
        }  
      });
      if(!enterIn)
      {
        contIndexTelecom.push({id:choice.telecom.value , cont:0});
      }
      return respCont;
    }

    dataURItoBlob = function(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    }

    $scope.savePerson = function() {
      contIndexTelecom = [];
      var fd = new FormData();    
      fd.append( 'dto(addressId)', $scope.entity.addressId);
      fd.append( 'dto(companyId)', $scope.entity.companyId);
      fd.append( 'dto(addressType)', $scope.entity.addressType);      
      fd.append( 'dto(version)', $scope.entity.version);      
      if ($scope.entity.name1 !=  undefined){
        fd.append( 'dto(name1)', $scope.entity.name1);
      }
      else
      {
        fd.append( 'dto(name1)' , '');  
      }
      
      if ($scope.entity.name2 !=  undefined){
        fd.append( 'dto(name2)', $scope.entity.name2);
      }
      else
      {
        fd.append( 'dto(name2)' , '');  
      }

      fd.append( 'dto(name3)', '');    

      if($scope.entity.street != undefined){
        fd.append( 'dto(street)', $scope.entity.street);  
      } 

      if($scope.country != undefined){
        fd.append( 'countryId', $scope.country.value);
      }
      if($scope.language != undefined){
        fd.append( 'dto(languageId)', $scope.language.value);  
      }
      if($scope.city != undefined){
        fd.append( 'cityId', $scope.city.value);
        fd.append( 'city', $scope.city.name);
        fd.append( 'zip', $scope.city.zip);
      }    

      console.log('----lo anterior changeeeeee entity',$scope.entity);
      console.log('---- city',$scope.city);
// ariel
      // var aaaa = $cacheFactory;
      // console.log('cache',aaaa);

      $scope.choices.forEach(function(choice){      
        index = verifyIndexTelecom(contIndexTelecom,choice);
        if(index == 0){
          newdata = "telecom("+choice.telecom.value+").predeterminedIndex";
          fd.append(newdata,0);
        }
        newdata = "telecom("+choice.telecom.value+").telecom["+index+"].data"; 
        fd.append(newdata,choice.value);        
      });
      
      $scope.telecoms.forEach(function(telecom){
        newdata = "telecom("+telecom.value+").telecomTypeId";
        fd.append(newdata,telecom.value);     
        newdata = "telecom("+telecom.value+").telecomTypeName";
        fd.append(newdata,telecom.name);       
      });    

      var accessUserGroupIds = "";
      $scope.GroupsAvailable.forEach(function(group){
          if(group.value == true){
            accessUserGroupIds = accessUserGroupIds + group.userGroupId + ",";
          }
      });

      if(accessUserGroupIds.length != 0){
        accessUserGroupIds = accessUserGroupIds.substring(0, accessUserGroupIds.length - 1);
      }

      fd.append( 'dto(accessUserGroupIds)',accessUserGroupIds);

      if($scope.imgURI != undefined){
        fd.append( 'imageFile', dataURItoBlob($scope.imgURI));
      }    

    
        $.ajax({
          url: apiUrlLocal+UPDATE_PER_AND_ORG_URL,
          data: fd,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data){
            var result = JSON.parse(data);
            if(result.forward == "Success")
            {
              console.log("Person edit succesfull");          
              $state.go('app.contacts'); 
            }
            else
            {        
              PopupFactory.getPopup($scope,result);
            }             
          }
        });
     

        
    };

})

.controller('listToAddContactPersonCtrl',function($filter,bridgeServiceNewContactPerson,$state,apiUrlLocal,$localstorage,$ionicScrollDelegate,listToAddContactPerson,bridgeService,$scope,PopupFactory){

  $scope.ntitle= $filter('translate')('SelectContact');
  var mainData = bridgeService.getContact();
  console.log('bridge service result: ',mainData);

  $scope.accessRight = $localstorage.getObject('accessRight');  
  console.log('Access Right',$scope.accessRight);
  
  $scope.varUpdate = $scope.accessRight.CONTACTPERSON.UPDATE;

  $scope.totalPages; 
  $scope.page = 1; 
  $scope.asknext = false; 
  $scope.helpToCallList = false;
  $scope.contacts = [];
  $scope.apiUrlLocal = apiUrlLocal;
  $scope.showSearchBar = false;

  $scope.newContacts = listToAddContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});
  
  $scope.newContacts.$promise.then(function (results){
        
    // call factory 
    PopupFactory.getPopup($scope,results);
    
    console.log("1. promise list to add contact person: ",(results['mainData']));

    $scope.contacts = (results['mainData'])['list'];
    $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
    $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);

    console.log("current page: ", $scope.page);
    console.log("total pages: ", $scope.totalPages);

    if ( $scope.totalPages > $scope.page) {
      $scope.asknext = true;  
    };
    // if no exists items show message
    if ($scope.contacts.length == 0) {

      var message = $filter('translate')('NoItems');
      var messageClose = $filter('translate')('Close');
      // An alert dialog
      console.log("==CONTROLLER CONTACTS== alert if no exists items");
      var alertPopup = $ionicPopup.alert({
          title: message,
          buttons: [
            { text: '<b>'+messageClose+'</b>',
              type: 'button-positive',
              onTap: function(e) {
                $window.history.back();
              }
            },
          ]
      });
    }
    $ionicScrollDelegate.scrollTop();
  })

  $scope.hideSearch = function() {
    $scope.searchKey = "";
    $scope.showSearchBar = false;
  };

  $scope.doRefresh = function() {
    $scope.searchKey = "";
    $scope.page = 1;
    $scope.helpToCallList = false;
    $scope.showSearchBar = false;
    $scope.asknext = false; 
    $scope.newContacts = listToAddContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});

    $scope.newContacts.$promise.then(function (results){

      // call factory 
      PopupFactory.getPopup($scope,results);
      console.log("2. promise results: ",(results['mainData']));

      if (results['forward'] == "") {
        $scope.contacts = (results['mainData'])['list'];
        
        $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
        $scope.totalPages=parseInt((results['mainData'])['pageInfo']['totalPages']);
        
        if ( $scope.totalPages > $scope.page ) {
          $scope.asknext = true;
        };
        $ionicScrollDelegate.scrollTop();
        $scope.$broadcast('scroll.refreshComplete'); 
      }
    });
  };  

  $scope.loadMore = function() {
    
    $scope.page = $scope.page + 1;
    // $scope.asknext = false;
    $scope.newContacts = listToAddContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});
    $scope.newContacts.$promise.then(function(results){
      
      // call factory 
      PopupFactory.getPopup($scope,results);
      console.log("3. promise results: ",(results['mainData']));

      $scope.contacts = $scope.contacts.concat((results['mainData'])['list']);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      
      $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages=parseInt((results['mainData'])['pageInfo']['totalPages']);
      
      if ($scope.totalPages<$scope.page+1) {
        $scope.asknext = false;  
      };
        
    });
  };

  $scope.getContactUrl = function(item,type){  
    var accessRight = $localstorage.getObject('accessRight');
    accessRightContactPerson = $scope.accessRight.CONTACTPERSON.VIEW;  

    // IF CONTACT PERSON HAVE PERMISSION TO READ
    var result = '#';
    if (item.contactPersonAddressId != "" && accessRightContactPerson != "true") {
      result = '#';
    }
    // switch(type) {
      // case 'contactPerson':
      result = '#/app/contactPerson?contactId='+item.addressId+'&addressId='+item.addressId+'&contactPersonId='+item.contactPersonId+'&name1='+item.lastName+'&name2='+item.firstName;
          
          // break;
      // default:
      return result;
    // }    
  };

  $scope.addContactPerson = function(item){
    console.log('==CONTACT CONTROLLER== go to add contact person controller',item);
    bridgeServiceNewContactPerson.saveContact(item);
    $state.go('app.newContactPerson');
  }



  $scope.formSearch = function(){
    $scope.showSearchBar = !$scope.showSearchBar;
  }

  $scope.search = function () {
    
    console.log("==CONTROLLER CONTACT== search contact person");
    $scope.helpToCallList = true;
    $scope.contacts = [];
    $scope.showSearchBar = !$scope.showSearchBar;
    console.log("-------search ---",$scope.searchKey);
// lastName@_firstName@_searchName
// 'contactId':mainData.entity.addressId,
    $scope.buscados = listToAddContactPerson.query({'contactId':mainData.entity.addressId,'parameter(contactSearchName)':$scope.searchKey});
    $scope.asknext = false;

    $scope.buscados.$promise.then(function (results){
        // call factory 
      PopupFactory.getPopup($scope,results);    

      $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
              
      $scope.contacts = (results['mainData'])['list'];
       
      if ($scope.contacts.length > 0 && $scope.totalPages>$scope.page) {
        $scope.asknext = true;  
      }; 

      // if no exists items show message
      if ($scope.contacts.length == 0) {

        var message = $filter('translate')('NoItems');
        var messageRefresh = $filter('translate')('PulltoRefresh');
        // An alert dialog
        console.log("==CONTROLLER CONTACTS== alert if no exists items");
        var alertPopup = $ionicPopup.alert({
            title: message,
            template: messageRefresh
        });
      }
      $ionicScrollDelegate.scrollTop();
                
    });
      
    $scope.loadMore = function() {
      console.log("------------------1 loadMore dentro search");
      $scope.page = $scope.page +1;     
      console.log("trying to load more of the search",$scope.page);
      if ($scope.helpToCallList) {
        console.log("search load more: value true",mainData.entity.addressId);
        $scope.buscados = listToAddContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page,'parameter(contactSearchName)':$scope.searchKey});
      }
      else{
        console.log("search load more: value false",mainData.entity.addressId);
        $scope.buscados = listToAddContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});
      }

      
      $scope.buscados.$promise.then(function(results){

          // call factory 
          PopupFactory.getPopup($scope,results);

          $scope.totalPages=parseInt((results['mainData'])['pageInfo']['totalPages']);

          $scope.contacts = $scope.contacts.concat((results['mainData'])['list']);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          console.log("======0000new list of contacts for search",$scope.contacts);
      });
            
      if ($scope.totalPages<$scope.page+1) {
        $scope.asknext = false;  
      };              
    };
  }
})


.controller('newContactPersonCtrl',function($stateParams,FORWARD_NEW_CONTACT_PERSON_URL,CREATE_CONTACT_PERSON_URL,$ionicPopup,$filter,$cordovaCamera,$cordovaImagePicker,bridgeServiceNewContactPerson,bridgeService,$state,$scope,$http,apiUrlLocal,PopupFactory,$localstorage){


  var mainData = bridgeService.getContact();
  var entityComp = mainData.entity;
  $scope.ntitle = $filter('translate')('NewContactPerson');
  $scope.ntitleCommunication = $filter('translate')('CommunicationInfo');  
  $scope.AdditionalInfo = $filter('translate')('AdditionalInfo');
  
  entity = bridgeServiceNewContactPerson.getContact();
  $scope.entity = entity;  
  $scope.apiUrlLocal= apiUrlLocal;
  console.log('bridgeService company',entityComp);
  console.log('bridgeServiceNewContactPerson new contact person',entity);

  $scope.information = {};
  var request = $http({
    method: "get",                                          
    url: apiUrlLocal+FORWARD_NEW_CONTACT_PERSON_URL+"?contactId="+entityComp.addressId+"&dto(addressIdToImport)="+entity.addressId+"&dto(addressType)="+entity.addressType+"&dto(name1)="+entity.name1+"&dto(name2)="+entity.name2,      
  });
  request.success(
    function(data, status, headers, config) {    
      // call factory 
      PopupFactory.getPopup($scope,data);  
      
      $scope.mainData = data.mainData;
      var entity = data.mainData.entity;
      $scope.entity = data.mainData.entity;

      var departmentArray = $scope.mainData.departmentArray;  
        $scope.departments = [];    
        departmentArray.forEach(function(department) {           
          $scope.departments.push({
            name: department.name,
            value: department.departmentId
          });       
          if( entity.departmentId == department.departmentId) {             
             $scope.department = $scope.departments[$scope.departments.length-1];  
          } 
      });  

      var personTypeArray = $scope.mainData.personTypeArray;  
        $scope.personTypes = [];    
        personTypeArray.forEach(function(personType) {           
          $scope.personTypes.push({
            name: personType.name,
            value:personType.personTypeId
          });       
          if(entity.personTypeId == personType.personTypeId) {             
             $scope.personType = $scope.personTypes[$scope.personTypes.length-1];  
          } 
      });  

      var telecomTypeArray = $scope.mainData.telecomTypeArray;
      $scope.telecoms = []      
      telecomTypeArray.forEach(function(telecom) {           
          $scope.telecoms.push({
            name: telecom.telecomTypeName,
            value:telecom.telecomTypeId,
          });                  
      });  
      
  });

  $scope.iframeWidth = $(window).width();  

  $scope.choices = [];

  $scope.removeChoice = function(choice) {
    var index = $scope.choices.indexOf(choice);    
    $scope.choices.splice(index,1);
  };

  $scope.addNewChoice = function(value,telecom) { 
    if(value != undefined && telecom != undefined && value != ""){   
      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({'id':newItemNo, value:value, telecom:telecom});    
    }
  };  

  $scope.updateDepartment = function (nDepartment)
  {
    $scope.department = nDepartment;     
  };

  $scope.updatePersonType = function (nPersonType)
  {
    $scope.personType = nPersonType;     
  };

  $scope.pickerImage= function ()
  {
    var options = {
    maximumImagesCount: 1,
    width: 300,
    height: 300,
    quality: 75
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {          
          convertImgToBase64(results[0], function(base64Img){
              $scope.$apply(function(){
                $scope.imgURI=base64Img;
              })           
          });      
      }, function(error) {
        // error getting photos
      })
  };
  function convertImgToBase64(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
        ctx.drawImage(this,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg');
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
  };

  $scope.takePicture = function() {
    var options = { 
        quality : 75, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : Camera.PictureSourceType.CAMERA, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {      
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
        // An error occured. Show a message to the user
    });
  };

  verifyIndexTelecom = function(contIndexTelecom,choice){
      respCont = 0;
      enterIn = false;
      contIndexTelecom.forEach(function(cont){
        if(cont.id == choice.telecom.value)
        {
          cont.cont = cont.cont + 1;
          respCont= cont.cont;
          enterIn = true;
        }  
      });
      if(!enterIn)
      {
        contIndexTelecom.push({id:choice.telecom.value , cont:0});
      }
      return respCont;
    }

  dataURItoBlob = function(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    }

    $scope.saveContactPerson = function() {
      console.log('save contact person data:',$scope.entity);
      contIndexTelecom = [];
      var fd = new FormData(); 

      fd.append('dto(addressId)', entityComp.addressId);
      fd.append('dto(addressIdToImport)', $scope.entity.addressIdToImport );
      fd.append('dto(importAddress)', true);      
      if ($scope.entity.name1 !=  undefined){
        fd.append( 'dto(name1)', $scope.entity.name1);  
      }
      else
      {
        fd.append( 'dto(name1)' , '');  
      }
      
      if ($scope.entity.name2 !=  undefined){
        fd.append( 'dto(name2)', $scope.entity.name2);
      }
      else
      {
        fd.append( 'dto(name2)' , '');  
      }

      if ($scope.entity.function !=  undefined){
        fd.append('dto(function)', $scope.entity.function);
      }

      if($scope.department != undefined){

        fd.append( 'dto(departmentId)', $scope.department.value);
      }

      if($scope.personType != undefined){
        fd.append( 'dto(personTypeId)', $scope.personType.value);
      }

      $scope.choices.forEach(function(choice){      
        index = verifyIndexTelecom(contIndexTelecom,choice);
        if(index == 0){
          newdata = "telecom("+choice.telecom.value+").predeterminedIndex";
          fd.append(newdata,0);
        }
        newdata = "telecom("+choice.telecom.value+").telecom["+index+"].data"; 
        fd.append(newdata,choice.value);        
      });

      $scope.telecoms.forEach(function(telecom){
        newdata = "telecom("+telecom.value+").telecomTypeId";
        fd.append(newdata,telecom.value);     
        newdata = "telecom("+telecom.value+").telecomTypeName";
        fd.append(newdata,telecom.name);       
      });    

      if($scope.imgURI != undefined){
        fd.append( 'imageFile', dataURItoBlob($scope.imgURI));
      }    

        $.ajax({               
          url: apiUrlLocal+CREATE_CONTACT_PERSON_URL+"?contactId="+entityComp.addressId,
          data: fd, 
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data){
            var result = JSON.parse(data);
            if(result.forward == "Success")
            {
              
              console.log("Contact person create succesfull");
// $state.transitionTo('app.seeContactsPerson', {}, { reload: true });
              $state.go('app.seeContactsPerson');

              // console.log("---------------ok");
              // aaaaaaaaaaaaaaaaaaaaaaaaaa
              // $state.go('app.seeContactsPerson');
              // $state.go('app.contacts');
              
            }
            else
            {           
               PopupFactory.getPopup($scope,result);
            }             
          }
        });
       

    };
  
  // /ContactPerson/Import.do?contactId=1&dto(addressIdToImport)=11480&dto(addressType)=1&dto(name1)=juan&dto(name2)=perez
  // get object to BRIDGE SERVICE to edit
  
})

.controller('EditContactPersonCtrl', function(EDIT_CONTACT_PERSON_URL,PopupFactory,$ionicHistory,$ionicPopup,$filter,$state,$http,$cordovaImagePicker,$cordovaCamera,bridgeService,$scope,COLOR_VIEW, $stateParams,apiUrlLocal,$localstorage) {
  
  $scope.apiUrlLocal = apiUrlLocal; 
  $scope.colorFont = COLOR_VIEW;
  $scope.ntitle = $filter('translate')('EditContactPerson');
  $scope.ntitleCommunication = $filter('translate')('CommunicationInfo');  
  $scope.AdditionalInfo = $filter('translate')('AdditionalInfo');
  // var message = $filter('translate')('');
  
  // get object to BRIDGE SERVICE to edit
  var mainData = bridgeService.getContact();
  $scope.entity = mainData.entity;
  $scope.mainData = mainData;

  console.log("==CONTROLLER CONTACT== edit contact person, maindata:", $scope.mainData);

  var departmentArray = $scope.mainData.departmentArray;  
    $scope.departments = [];    
    departmentArray.forEach(function(department) {           
      $scope.departments.push({
        name: department.name,
        value: department.departmentId
      });       
      if($scope.entity.departmentId == department.departmentId) {             
         $scope.department = $scope.departments[$scope.departments.length-1];  
      } 
  });

  var personTypeArray = $scope.mainData.personTypeArray;  
    $scope.personTypes = [];    
    personTypeArray.forEach(function(personType) {           
      $scope.personTypes.push({
        name: personType.name,
        value:personType.personTypeId
      });       
      if($scope.entity.personTypeId == personType.personTypeId) {             
         $scope.personType = $scope.personTypes[$scope.personTypes.length-1];  
      } 
  });  

  var telecomTypeArray = $scope.mainData.telecomTypeArray;
  $scope.telecoms = []      
  telecomTypeArray.forEach(function(telecom) {           
      $scope.telecoms.push({
        name: telecom.telecomTypeName,
        value:telecom.telecomTypeId,
      });                  
  });  

  $scope.iframeWidth = $(window).width();
  $scope.choices = [];
  $scope.entity.telecoms.forEach(function(telecom){      
      telecom.telecomList.forEach(function(item){
       var newItemNo = $scope.choices.length+1;          
          $scope.telecoms.forEach(function(telecomearr){
            if(telecomearr.value == telecom.telecomTypeId)
              $scope.auxvar=telecomearr;
          });
      
          $scope.choices.push({'id':newItemNo, value:item.data, telecom: $scope.auxvar });
      });        
  });
  
  $scope.removeChoice = function(choice) {
    var index = $scope.choices.indexOf(choice);    
    $scope.choices.splice(index,1);
  };

  $scope.addNewChoice = function(value,telecom) {  
    if(value != undefined && telecom != undefined && value != ""){       
      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({'id':newItemNo, value:value, telecom:telecom});    
    }
  };  

  $scope.updateDepartment = function (nDepartment)
  {
    $scope.department = nDepartment;     
  };

  $scope.updatePersonType = function (nPersonType)
  {
    $scope.personType = nPersonType;     
  };

  $scope.pickerImage= function ()
  {
    var options = {
    maximumImagesCount: 1,
    width: 300,
    height: 300,
    quality: 75
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {          
          convertImgToBase64(results[0], function(base64Img){
              $scope.$apply(function(){
                $scope.imgURI=base64Img;
              })           
          });      
      }, function(error) {
        // error getting photos
      })
  };
  function convertImgToBase64(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
        ctx.drawImage(this,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg');
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
  };

  $scope.takePicture = function() {
    var options = { 
        quality : 75, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : Camera.PictureSourceType.CAMERA, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {      
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
        // An error occured. Show a message to the user
    });
  };

  verifyIndexTelecom = function(contIndexTelecom,choice){
      respCont = 0;
      enterIn = false;
      contIndexTelecom.forEach(function(cont){
        if(cont.id == choice.telecom.value)
        {
          cont.cont = cont.cont + 1;
          respCont= cont.cont;
          enterIn = true;
        }  
      });
      if(!enterIn)
      {
        contIndexTelecom.push({id:choice.telecom.value , cont:0});
      }
      return respCont;
    }

  dataURItoBlob = function(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    }

    $scope.saveContactPerson = function() {

      contIndexTelecom = [];
      var fd = new FormData(); 
      
      fd.append('dto(addressId)', mainData.entity.addressId);
      fd.append('dto(contactPersonId)', mainData.entity.contactPersonId);
      fd.append('dto(companyId)', mainData.entity.companyId);
      fd.append('dto(addressType)', mainData.entity.addressType);     
      fd.append('dto(privateVersion)', mainData.entity.privateVersion);
      fd.append('dto(version)', mainData.entity.version);      

      if ($scope.entity.name1 !=  undefined){
        fd.append( 'dto(name1)', $scope.entity.name1);  
      }
      else
      {
        fd.append( 'dto(name1)' , '');  
      }
      
      if ($scope.entity.name2 !=  undefined){
        fd.append( 'dto(name2)', $scope.entity.name2);
      }
      else
      {
        fd.append( 'dto(name2)' , '');  
      }

      if ($scope.entity.function !=  undefined){
        fd.append('dto(function)', $scope.entity.function);
      }

      if($scope.department != undefined){

        fd.append( 'dto(departmentId)', $scope.department.value);
      }

      if($scope.personType != undefined){
        fd.append( 'dto(personTypeId)', $scope.personType.value);
      }

      $scope.choices.forEach(function(choice){      
        index = verifyIndexTelecom(contIndexTelecom,choice);
        if(index == 0){
          newdata = "telecom("+choice.telecom.value+").predeterminedIndex";
          fd.append(newdata,0);
        }
        newdata = "telecom("+choice.telecom.value+").telecom["+index+"].data"; 
        fd.append(newdata,choice.value);        
      });

      $scope.telecoms.forEach(function(telecom){
        newdata = "telecom("+telecom.value+").telecomTypeId";
        fd.append(newdata,telecom.value);     
        newdata = "telecom("+telecom.value+").telecomTypeName";
        fd.append(newdata,telecom.name);       
      });    

      if($scope.imgURI != undefined){
        fd.append( 'imageFile', dataURItoBlob($scope.imgURI));
      }    

      
         $.ajax({
          url: apiUrlLocal+EDIT_CONTACT_PERSON_URL+"?contactId="+mainData.entity.addressId,
          data: fd, 
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data){
            var result = JSON.parse(data);
            if(result.forward == "Success")
            {        
              console.log("Contact person edit succesfull");          
                        
              if($ionicHistory.backView().index ==1)
                $state.go('app.contacts');
              else
                $state.go('app.seeContactsPerson');
            }
            else
            {           
               PopupFactory.getPopup($scope,result);
            }             
          }
        });  
   

    };

})


.controller('ContactsCtrl', function(contactsListActual,$window,$cacheFactory,$ionicHistory,allContact,PopupFactory,$localstorage,$filter,$ionicScrollDelegate,$window,$scope,COLOR_VIEW, Contact,$timeout,$ionicLoading,apiUrlLocal,$location, $state, $window,$ionicPopup) {

    $ionicHistory.clearHistory();   
    $scope.apiUrlLocal = apiUrlLocal;
    $scope.colorFont = COLOR_VIEW;
    $scope.pagesintotal; 
    $scope.page = 1; 

    $scope.accessRight = $localstorage.getObject('accessRight');  
    console.log('Access Right',$scope.accessRight);
    
    $scope.varCreate = $scope.accessRight.CONTACT.CREATE;
    
    $scope.showSearchBar = false;
    $scope.apiUrlLocal = apiUrlLocal;

    // var contactListCache = contactsListActual.getContactList();

    // if (contactListCache.list == undefined ) {

      $scope.newContacts = allContact.query({'pageParam(pageNumber)':$scope.page});
      $scope.contacts = [];
        
      $scope.asknext = false;

      console.log("FIRST CALL",$scope.newContacts);

      $scope.newContacts.$promise.then(function (results){
        
        // call factory 
        PopupFactory.getPopup($scope,results);
        
        console.log("THIS INFO",(results['mainData']));
  
        $scope.contacts = (results['mainData'])['list'];
        contactsListActual.saveContactList(results['mainData']);

        console.log('LIST OF THE FIRST CONTACTS',$scope.contacts);
        $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
        $scope.pagesintotal = parseInt((results['mainData'])['pageInfo']['totalPages']);
        console.log("page integer", $scope.page);
        console.log("pages in total", $scope.pagesintotal);

        if ($scope.contacts.length > 0 && $scope.pagesintotal>$scope.page) {
          $scope.asknext = true;  
        };
      })

    // }
    // else{
    //   console.log('--------sersdfsdf',contactListCache);
    //   $scope.contacts = contactListCache.list;
    //   $scope.page = contactListCache.pageInfo.pageNumber;
    //   $scope.pagesintotal = contactListCache.pageInfo.totalPages;
    //   if ($scope.contacts.length > 0 && $scope.pagesintotal>$scope.page) {
    //     $scope.asknext = true;  
    //   };
    // }

  $scope.hideSearch = function() {
    $scope.searchKey = "";
    $scope.showSearchBar = false;
  };    


$scope.doRefresh = function() {
    console.log("------------------1 do refresh principal");
    $scope.page=1;
    $scope.searchKey = "";
    $scope.showSearchBar = false;
    $scope.pag = 1;
    $scope.$broadcast('scroll.infiniteScrollComplete');

  $scope.newContacts = allContact.query({'pageParam(pageNumber)':$scope.page});

  $scope.newContacts.$promise.then(function (results){

    // call factory 
    PopupFactory.getPopup($scope,results);

    if (results['forward'] == "") {
      $scope.contacts = (results['mainData'])['list'];
      $scope.pagesintotal = parseInt((results['mainData'])['pageInfo']['totalPages']);
      $scope.$broadcast('scroll.refreshComplete'); 
        
      $scope.pag=parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalpag=parseInt((results['mainData'])['pageInfo']['totalPages']);

      // contactsListActual.saveContactList(results['mainData']);
      
      console.log('COMEBACK TO THE FIRST LIST',$scope.page);
      console.log('WITH THIS CONTACTS',$scope.contacts);
      console.log('PAGE #',$scope.page);
      console.log("pages in total on refresh", $scope.pagesintotal);
      
      if ($scope.contacts.length > 0 && $scope.pagesintotal>$scope.page) {
        $scope.asknext = true;
      };
      $ionicScrollDelegate.scrollTop();
    }
  });
};  

$scope.loadMore = function() {
    
  console.log("------------------1 loadMore principal");
  console.log('Loading more contacts');
  $scope.page = $scope.page + 1;
  $scope.newContacts = allContact.query({'pageParam(pageNumber)':$scope.page});
  $scope.newContacts.$promise.then(function(results){
    
    // call factory 
    PopupFactory.getPopup($scope,results);

    console.log("+++++new info",(results['mainData']));
    console.log("++++new page #", $scope.page);
    $scope.contacts = $scope.contacts.concat((results['mainData'])['list']);
    $scope.$broadcast('scroll.infiniteScrollComplete');
    console.log("++++new contacts list ", $scope.contacts);
    
    // var finalObject = results['mainData'];
    // finalObject.list = $scope.contacts;
    // console.log('----===',finalObject);
    // contactsListActual.saveContactList(finalObject);  


    if ($scope.pagesintotal<=$scope.page+1) {
        $scope.asknext = false;  
      };
      
  });
};


$scope.getContactUrl = function(item,type){  
  var accessRight = $localstorage.getObject('accessRight');
  accessRightContactPerson = $scope.accessRight.CONTACTPERSON.VIEW;  

  // IF CONTACT PERSON HAVE PERMISSION TO READ
  if (item.contactPersonAddressId != "" && accessRightContactPerson != "true") {
    return "#";
  }
  switch(type) {
    case 'contactPerson':
        return '#/app/contactPerson?contactId='+item.contactPersonAddressId+'&addressId='+item.contactPersonAddressId+'&contactPersonId='+item.addressId+'&name1='+item.name1+'&name2='+item.name2;  
        // return item.contactPersonAddressId ==='' ? '#/app/contactPerson?contactId=' +item.addressId +'&addressId='+ item.addressId + '&addressType=' + item.addressType : '#/app/contactPerson?contactId='+item.contactPersonAddressId+'&addressId='+item.contactPersonAddressId+'&contactPersonId='+item.addressId+'&addressType='+item.addressType2;  
        break;
    case 'organization':
        return item.contactPersonAddressId ==='' ? '#/app/organization?contactId=' +item.addressId +'&addressId='+ item.addressId + '&addressType=' + item.addressType : '#/app/organization?contactId='+item.contactPersonAddressId+'&addressId='+item.contactPersonAddressId+'&contactPersonId='+item.addressId+'&addressType='+item.addressType2;  
        break;
    case 'person':
        return item.contactPersonAddressId ==='' ? '#/app/person?contactId=' +item.addressId +'&addressId='+ item.addressId + '&addressType=' + item.addressType : '#/app/person?contactId='+item.contactPersonAddressId+'&addressId='+item.contactPersonAddressId+'&contactPersonId='+item.addressId+'&addressType='+item.addressType2;  
        break;        
    default:
        return "#";
  }    
};

$scope.searchcon = function(){
  $scope.showSearchBar = !$scope.showSearchBar;
}   

$scope.clearSearch = function () {
  
  $scope.searchKey = "";
  $scope.showSearchBar = !$scope.showSearchBar;

  $scope.page=1;
  $scope.searchKey = "";
  $scope.pag = 1;
  
  $scope.newContacts = allContact.query({'pageParam(pageNumber)':$scope.page});

  $scope.newContacts.$promise.then(function (results){

    // call factory 
    PopupFactory.getPopup($scope,results);

    if (results['forward'] == "") {
      $scope.contacts = (results['mainData'])['list'];
      $scope.pagesintotal = parseInt((results['mainData'])['pageInfo']['totalPages']);
      $scope.$broadcast('scroll.refreshComplete'); 
        
      $scope.pag=parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalpag=parseInt((results['mainData'])['pageInfo']['totalPages']);
      
      console.log('COMEBACK TO THE FIRST LIST',$scope.page);
      console.log('WITH THIS CONTACTS',$scope.contacts);
      console.log('PAGE #',$scope.page);
      console.log("pages in total on refresh", $scope.pagesintotal);
      
      if ($scope.contacts.length > 0 && $scope.pagesintotal>$scope.page) {
        $scope.asknext = true;
      };
    }
  });
}


        
            
$scope.search = function () {
  console.log("------------------1 search function");
    $scope.contacts = [];
    $scope.showSearchBar = !$scope.showSearchBar;
    $scope.buscados = allContact.query({'parameter(contactSearchName)':$scope.searchKey});
    $scope.asknext = false;

    $scope.buscados.$promise.then(function (results){
        
        // call factory 
        PopupFactory.getPopup($scope,results);    

        $scope.pag=parseInt((results['mainData'])['pageInfo']['pageNumber']);
        $scope.totalpag=parseInt((results['mainData'])['pageInfo']['totalPages']);
                
        $scope.contacts = (results['mainData'])['list'];
        console.log("search info", results['mainData']);
        console.log("list  of contacts, first search", $scope.contacts);
         
        // contactsListActual.saveContactList(results['mainData']); 

        if ($scope.contacts.length > 0 && $scope.totalpag>$scope.pag) {
          $scope.asknext = true;  
        }; 

        // if no exists items show message
        if ($scope.contacts.length == 0) {

          var message = $filter('translate')('NoItems');
          var messageRefresh = $filter('translate')('PulltoRefresh');
          // An alert dialog
          console.log("==CONTROLLER CONTACTS== alert if no exists items");
          var alertPopup = $ionicPopup.alert({
              title: message,
              template: messageRefresh
          });
        }
        $ionicScrollDelegate.scrollTop();
                
    });
      
    $scope.loadMore = function() {
      console.log("------------------1 loadMore dentro search");
      console.log("trying to load more of the search",$scope.pag);
      $scope.pag = $scope.pag +1;        
      $scope.buscados = allContact.query({'parameter(contactSearchName)':$scope.searchKey,'pageParam(pageNumber)':$scope.pag});
      $scope.buscados.$promise.then(function(results){

          // call factory 
          PopupFactory.getPopup($scope,results);

          $scope.totalpag=parseInt((results['mainData'])['pageInfo']['totalPages']);

          console.log("===== 000new info for search",(results['mainData']));
          $scope.contacts = $scope.contacts.concat((results['mainData'])['list']);
          $scope.$broadcast('scroll.infiniteScrollComplete');
          console.log("======0000new list of contacts for search",$scope.contacts);

          

          // var finalObject = results['mainData'];
          // finalObject.list = $scope.contacts;
          // console.log('----===',finalObject);
          // contactsListActual.saveContactList(finalObject);  
                
      });
            
      if ($scope.totalpag<$scope.pag+1) {
        $scope.asknext = false;  
      };              
    };
}




 $scope.createp = function() {
     console.log("go to create person");
      $state.go('app.newperson'); 
    };
                            
})



.controller('newpCtrl', function (FORWARD_NEW_PER_AND_ORG_URL,CREATE_PER_AND_ORG_URL,GET_CITIES_OF_COUNTRY_URL,$filter,$ionicPopup,$cordovaCamera,$cordovaImagePicker,PersonType,COLOR_VIEW,PopupFactory,$state,apiUrlLocal,$scope,$ionicModal,$http,transformRequestAsFormPost) {
  $scope.apiUrlLocal = apiUrlLocal;
  $scope.colorFont = COLOR_VIEW;
  $scope.ntitle = $filter('translate')('NewPerson');
  $scope.ntitleCommunication = $filter('translate')('CommunicationInfo');
  $scope.DataAccessSecurity = $filter('translate')('DataAccessSecurity');
  $scope.AdditionalInfo = $filter('translate')('AdditionalInfo');
  $scope.entity=[];  
  $scope.entity.imageUrl = "";

  var request = $http({
    method: "get",        
    url: apiUrlLocal+FORWARD_NEW_PER_AND_ORG_URL,
  });
  request.success(
    function(data, status, headers, config) {    
      console.log("asdfasfdsfdfas",data);
      // call factory 
      PopupFactory.getPopup($scope,data);    

       var countryArray = data.mainData.countryArray;  
        $scope.countries = [];    
        countryArray.forEach(function(country) {           
            $scope.countries.push({
              name: country.name,
              value:country.countryId
            });                     
        });

        var languageArray = data.mainData.languageArray;
        $scope.languages = [];    
        languageArray.forEach(function(language) {           
            $scope.languages.push({
              name: language.name,
              value:language.languageId
            });                     
        }); 

        var telecomTypeArray = data.mainData.telecomTypeArray;
        $scope.telecoms = []      
        telecomTypeArray.forEach(function(telecom) {           
            $scope.telecoms.push({
              name: telecom.telecomTypeName,
              value:telecom.telecomTypeId,
            });                  
        });      

        var groupsArray = data.mainData.dataAccessUserGroupArray;
        $scope.GroupsAvailable = [];
        groupsArray.forEach(function(group) {           
            $scope.GroupsAvailable.push({
              name: group.name,
              userGroupId: group.userGroupId,
              value : false
            });                  
        });                   

    });

  $scope.choices = [];
  $scope.iframeWidth = $(window).width();
 

  $scope.addNewChoice = function(value,telecom) { 
    if(value != undefined && telecom != undefined && value != ""){  
      var newItemNo = $scope.choices.length+1;
      $scope.choices.push({'id':newItemNo, value:value, telecom:telecom});    
    }
  };
    
  $scope.removeChoice = function(choice) {
    var index = $scope.choices.indexOf(choice);    
    $scope.choices.splice(index,1);
  };

  function convertImgToBase64(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
        ctx.drawImage(this,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg');
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
  }

  $scope.pickerImage= function ()
  {
    var options = {
    maximumImagesCount: 1,
    width: 300,
    height: 300,
    quality: 75
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {          
          convertImgToBase64(results[0], function(base64Img){
              $scope.$apply(function(){
                $scope.imgURI=base64Img;
              })           
          });      
      }, function(error) {
        // error getting photos
      })
  };
  
  $scope.takePicture = function() {
    var options = { 
        quality : 75, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : Camera.PictureSourceType.CAMERA, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {      
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
        // An error occured. Show a message to the user
    });
  }

    $scope.updateCountry = function (ncountry)
    {
      $scope.country = ncountry; 
      $scope.city =  undefined; 
      var cityRequest = $http({
        method: "post",        
        url: apiUrlLocal+GET_CITIES_OF_COUNTRY_URL,
        data: {
            'countryId' : ncountry.value
         }
      });
      cityRequest.success(
        function(data, status, headers, config) {      

          // call factory 
          PopupFactory.getPopup($scope,data);

          var cityArray = data.mainData.cityArray;
          $scope.cities = [];    
          cityArray.forEach(function(city) {           
              $scope.cities.push({
                name: city.cityName,
                value:city.cityId, 
                zip: city.zip,             
              });                     
          });    
      });
   
    }

    $scope.updateLanguage = function (nlanguage)
    {
      $scope.language = nlanguage;     
    }

    $scope.updateCity = function (ncity)
    {
      $scope.city = ncity;     
    }

  verifyIndexTelecom = function(contIndexTelecom,choice){
    respCont = 0;
    enterIn = false;
    contIndexTelecom.forEach(function(cont){
      if(cont.id == choice.telecom.value)
      {
        cont.cont = cont.cont + 1;
        respCont= cont.cont;
        enterIn = true;
      }  
    });
    if(!enterIn)
    {
      contIndexTelecom.push({id:choice.telecom.value , cont:0});
    }
    return respCont;
  }

  dataURItoBlob = function(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  $scope.savePerson = function() {
    contIndexTelecom = [];
    var fd = new FormData();    
    fd.append( 'dto(addressType)', PersonType);

    if ($scope.entity.name1 !=  undefined){
      fd.append( 'dto(name1)', $scope.entity.name1);  
    }
    else
    {
      fd.append( 'dto(name1)' , '');  
    }

    if ($scope.entity.name2 !=  undefined){
      fd.append( 'dto(name2)', $scope.entity.name2);
    }
    else
    {
      fd.append( 'dto(name2)' , '');  
    }

    fd.append( 'dto(name3)', '');    

    if($scope.entity.street != undefined){
      fd.append( 'dto(street)', $scope.entity.street);  
    }     

    if($scope.country != undefined){
      fd.append( 'countryId', $scope.country.value);
    }
    if($scope.language != undefined){
      fd.append( 'dto(languageId)', $scope.language.value);  
    }
    if($scope.city != undefined){
      fd.append( 'cityId', $scope.city.value);
      fd.append( 'city', $scope.city.name);
      fd.append( 'zip', $scope.city.zip);
    }    

    $scope.choices.forEach(function(choice){      
      index = verifyIndexTelecom(contIndexTelecom,choice);
      if(index == 0){
        newdata = "telecom("+choice.telecom.value+").predeterminedIndex";
        fd.append(newdata,0);
      }
      newdata = "telecom("+choice.telecom.value+").telecom["+index+"].data"; 
      fd.append(newdata,choice.value);        
    });

    $scope.telecoms.forEach(function(telecom){
      newdata = "telecom("+telecom.value+").telecomTypeId";
      fd.append(newdata,telecom.value);     
      newdata = "telecom("+telecom.value+").telecomTypeName";
      fd.append(newdata,telecom.name);       
    });    

    var accessUserGroupIds = "";
    $scope.GroupsAvailable.forEach(function(group){
        if(group.value == true){
          accessUserGroupIds = accessUserGroupIds + group.userGroupId + ",";
        }
    });

    if(accessUserGroupIds != ""){
      fd.append( 'dto(accessUserGroupIds)',accessUserGroupIds.substring(0, accessUserGroupIds.length - 1));
    }

    if($scope.imgURI != undefined){
      fd.append( 'imageFile', dataURItoBlob($scope.imgURI));
    } 
  
      $.ajax({
        url: apiUrlLocal+CREATE_PER_AND_ORG_URL,
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data){
          var result = JSON.parse(data);
          if(result.forward == "Success")
          {
            console.log("Person creation succesfull");          
            $state.go('app.contacts'); 
          }
          else
          {           
             PopupFactory.getPopup($scope,result);
          }             
        }
      });  

    
  };

})

.controller('editOrganizationCtrl', function(UPDATE_PER_AND_ORG_URL,GET_CITIES_OF_COUNTRY_URL,$ionicPopup,$filter,$state,$cordovaImagePicker,PopupFactory,$http,$cordovaCamera,bridgeService,$scope,COLOR_VIEW, $stateParams,apiUrlLocal,$localstorage) {
    $scope.apiUrlLocal = apiUrlLocal;
    $scope.colorFont = COLOR_VIEW;
    $scope.ntitle = $filter('translate')('EditOrganization');
    $scope.ntitleCommunication = $filter('translate')('CommunicationInfo');
    $scope.DataAccessSecurity = $filter('translate')('DataAccessSecurity');
    $scope.AdditionalInfo = $filter('translate')('AdditionalInfo');
    // get contact for edit
    var mainData = bridgeService.getContact();
    $scope.entity = mainData.entity;
    $scope.maindata = mainData;

    $scope.iframeWidth = $(window).width();

    console.log("==EDIT ORGANIZATION CONTROLLER==  get maindata:", $scope.maindata);

    var countryArray = $scope.maindata.countryArray;
    $scope.countries = [];    
    countryArray.forEach(function(country) {           
        $scope.countries.push({
          name: country.name,
          value:country.countryId
        });       
        if($scope.entity.countryId == country.countryId) {             
           $scope.country = $scope.countries[$scope.countries.length-1];  
        } 
    });    

    var languageArray = $scope.maindata.languageArray;
    $scope.languages = [];    
    languageArray.forEach(function(language) {           
        $scope.languages.push({
          name: language.name,
          value:language.languageId
        });       
        if($scope.entity.languageId == language.languageId) {             
           $scope.language = $scope.languages[$scope.languages.length-1];  
        } 
    });  

    var telecomTypeArray = $scope.maindata.telecomTypeArray;
    $scope.telecoms = []      
    telecomTypeArray.forEach(function(telecom) {           
      $scope.telecoms.push({
          name: telecom.telecomTypeName,
          value:telecom.telecomTypeId,
      });                  
    }); 

    var groupsArray = $scope.maindata.dataAccessUserGroupArray;
    $scope.GroupsAvailable = [];
    groupsArray.forEach(function(group) {  
        var array =  $scope.entity.accessUserGroupIds.split(',');
        var value = false;
        if(array.indexOf(group.userGroupId) != -1){
          value = true;
        }                
        $scope.GroupsAvailable.push({
          name: group.name,
          userGroupId: group.userGroupId,
          value : value
        });                  
    });   

    if($scope.entity.countryId != "" && $scope.entity.cityId == ""){
       var cityRequest = $http({
        method: "post",        
        url: apiUrlLocal+GET_CITIES_OF_COUNTRY_URL,
        data: {
            'countryId' : $scope.entity.countryId 
         }
      });
      cityRequest.success(
        function(data, status, headers, config) {      

          // call factory 
          PopupFactory.getPopup($scope,data);

          var cityArray = data.mainData.cityArray;
          $scope.cities = [];    
          cityArray.forEach(function(city) {           
              $scope.cities.push({
                name: city.cityName,
                value:city.cityId, 
                zip: city.zip,             
              });                     
          });    
      });
    }

    if($scope.entity.cityId != ""){
      var cityRequest = $http({
        method: "post",        
        url: apiUrlLocal+GET_CITIES_OF_COUNTRY_URL,
        data: {
            'countryId' : $scope.country.value
         }
      });
      cityRequest.success(
        function(data, status, headers, config) {      

          // call factory 
          PopupFactory.getPopup($scope,data);

          var cityArray = data.mainData.cityArray;
          $scope.cities = [];    
          cityArray.forEach(function(city) {           
              $scope.cities.push({
                name: city.cityName,
                value:city.cityId, 
                zip: city.zip,             
              });   
              if($scope.entity.cityId == city.cityId) {             
                 $scope.city = $scope.cities[$scope.cities.length-1];  
              }                  
          });    
      });
    }

    $scope.choices = [];  

    $scope.entity.telecoms.forEach(function(telecom){      
        telecom.telecomList.forEach(function(item){
           var newItemNo = $scope.choices.length+1;          
          $scope.telecoms.forEach(function(telecomearr){
            if(telecomearr.value == telecom.telecomTypeId)
              $scope.auxvar=telecomearr;
          });
      
          $scope.choices.push({'id':newItemNo, value:item.data, telecom: $scope.auxvar });
        });        
    });

    $scope.addNewChoice = function(value,telecom) { 
      if(value != undefined && telecom != undefined && value != ""){  
        var newItemNo = $scope.choices.length+1;
        $scope.choices.push({'id':newItemNo, value:value, telecom:telecom});    
      }
    };
      
    $scope.removeChoice = function(choice) {
      var index = $scope.choices.indexOf(choice);    
      $scope.choices.splice(index,1);
    };    

    function convertImgToBase64(url, callback, outputFormat){
      var img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function(){
          var canvas = document.createElement('CANVAS');
          var ctx = canvas.getContext('2d');
        canvas.height = this.height;
        canvas.width = this.width;
          ctx.drawImage(this,0,0);
          var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg');
          callback(dataURL);
          canvas = null; 
      };
      img.src = url;
    }

    $scope.pickerImage= function (){
      var options = {
      maximumImagesCount: 1,
      width: 300,
      height: 300,
      quality: 75
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {          
            convertImgToBase64(results[0], function(base64Img){
                $scope.$apply(function(){
                  $scope.imgURI=base64Img;
                })           
            });      
        }, function(error) {
          // error getting photos
        })
    };
    
    $scope.takePicture = function() {
      var options = { 
          quality : 75, 
          destinationType : Camera.DestinationType.DATA_URL, 
          sourceType : Camera.PictureSourceType.CAMERA, 
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {      
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
          // An error occured. Show a message to the user
      });
    }

    $scope.updateCountry = function (ncountry)
    {
      $scope.country = ncountry; 
      $scope.city =  undefined; 
      var cityRequest = $http({
        method: "post",        
        url: apiUrlLocal+GET_CITIES_OF_COUNTRY_URL,
        data: {
            'countryId' : ncountry.value
         }
      });
      cityRequest.success(
        function(data, status, headers, config) {      

          // call factory 
          PopupFactory.getPopup($scope,data);

          var cityArray = data.mainData.cityArray;
          $scope.cities = [];    
          cityArray.forEach(function(city) {           
              $scope.cities.push({
                name: city.cityName,
                value:city.cityId, 
                zip: city.zip,             
              });                     
          });    
      });
   
    }

    $scope.updateLanguage = function (nlanguage)
    {
      $scope.language = nlanguage;     
    }

    $scope.updateCity = function (ncity)
    {
      $scope.city = ncity;     
    }

    verifyIndexTelecom = function(contIndexTelecom,choice){
      respCont = 0;
      enterIn = false;
      contIndexTelecom.forEach(function(cont){
        if(cont.id == choice.telecom.value)
        {
          cont.cont = cont.cont + 1;
          respCont= cont.cont;
          enterIn = true;
        }  
      });
      if(!enterIn)
      {
        contIndexTelecom.push({id:choice.telecom.value , cont:0});
      }
      return respCont;
    }

    dataURItoBlob = function(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
      else
          byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    }

    $scope.saveOrganization = function() {
      contIndexTelecom = [];
      var fd = new FormData();    
      fd.append( 'dto(addressId)', $scope.entity.addressId);
      fd.append( 'dto(companyId)', $scope.entity.companyId);
      fd.append( 'dto(addressType)', $scope.entity.addressType);      
      fd.append( 'dto(version)', $scope.entity.version);      
      if ($scope.entity.name1 !=  undefined){
        fd.append( 'dto(name1)', $scope.entity.name1);  
      }
      else
      {
        fd.append( 'dto(name1)' , '');  
      }
      
      if ($scope.entity.name2 !=  undefined){
        fd.append( 'dto(name2)', $scope.entity.name2);
      }
      else
      {
        fd.append( 'dto(name2)' , '');  
      }

      if ($scope.entity.name3 !=  undefined){
        fd.append( 'dto(name3)', $scope.entity.name3);  
      }
      else
      {
        fd.append( 'dto(name3)' , '');
      }
      
      if($scope.entity.street != undefined){
        fd.append( 'dto(street)', $scope.entity.street);  
      } 
      if($scope.country != undefined){
        fd.append( 'countryId', $scope.country.value);
      }
      if($scope.language != undefined){console.log('----------------------1',$scope.language.value);
        fd.append( 'dto(languageId)', $scope.language.value);  
      }
      if($scope.city != undefined){
        fd.append( 'cityId', $scope.city.value);
        fd.append( 'city', $scope.city.name);
        fd.append( 'zip', $scope.city.zip);
      }    

      $scope.choices.forEach(function(choice){      
        index = verifyIndexTelecom(contIndexTelecom,choice);
        if(index == 0){
          newdata = "telecom("+choice.telecom.value+").predeterminedIndex";
          fd.append(newdata,0);
        }
        newdata = "telecom("+choice.telecom.value+").telecom["+index+"].data"; 
        fd.append(newdata,choice.value);        
      });

      $scope.telecoms.forEach(function(telecom){
        newdata = "telecom("+telecom.value+").telecomTypeId";
        fd.append(newdata,telecom.value);     
        newdata = "telecom("+telecom.value+").telecomTypeName";
        fd.append(newdata,telecom.name);       
      });    

      var accessUserGroupIds = "";
      $scope.GroupsAvailable.forEach(function(group){
          if(group.value == true){
            accessUserGroupIds = accessUserGroupIds + group.userGroupId + ",";
          }
      });

      if(accessUserGroupIds.length != 0){
        accessUserGroupIds = accessUserGroupIds.substring(0, accessUserGroupIds.length - 1);
      }

      fd.append( 'dto(accessUserGroupIds)',accessUserGroupIds);

      if($scope.imgURI != undefined){
        fd.append( 'imageFile', dataURItoBlob($scope.imgURI));
      }    
      
        $.ajax({
          url: apiUrlLocal+UPDATE_PER_AND_ORG_URL,
          data: fd,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data){
            var result = JSON.parse(data);
            if(result.forward == "Success")
            {
              console.log("Organization edit succesfull");          
              $state.go('app.contacts'); 
            }
            else
            {           
               PopupFactory.getPopup($scope,result);
            }             
          }
        });     
       
    };

})


.controller('neworganizationCtrl', function (FORWARD_NEW_PER_AND_ORG_URL,CREATE_PER_AND_ORG_URL,GET_CITIES_OF_COUNTRY_URL,$filter,OrgType,$ionicPopup,$cordovaImagePicker,$cordovaCamera,PopupFactory,transformRequestAsFormPost,apiUrlLocal,$scope,$ionicModal, AuthenticationService,$state,$http,$ionicLoading,$location, $state, $window,COLOR_VIEW) {
  $scope.colorFont = COLOR_VIEW;

  $scope.ntitle = $filter('translate')('NewOrganization');
  $scope.ntitleCommunication = $filter('translate')('CommunicationInfo');
  $scope.DataAccessSecurity = $filter('translate')('DataAccessSecurity');
  $scope.AdditionalInfo = $filter('translate')('AdditionalInfo');  

  $scope.entity=[];  
  $scope.entity.imageUrl = "";

  var request = $http({
    method: "get",        
    url: apiUrlLocal+FORWARD_NEW_PER_AND_ORG_URL,
  });
  request.success(
    function(data, status, headers, config) {    
      // call factory 
      PopupFactory.getPopup($scope,data);    

       var countryArray = data.mainData.countryArray;  
        $scope.countries = [];    
        countryArray.forEach(function(country) {           
            $scope.countries.push({
              name: country.name,
              value:country.countryId
            });                     
        });

        var languageArray = data.mainData.languageArray;
        $scope.languages = [];    
        languageArray.forEach(function(language) {           
            $scope.languages.push({
              name: language.name,
              value:language.languageId
            });                     
        }); 

        var telecomTypeArray = data.mainData.telecomTypeArray;
        $scope.telecoms = []      
        telecomTypeArray.forEach(function(telecom) {           
            $scope.telecoms.push({
              name: telecom.telecomTypeName,
              value:telecom.telecomTypeId,
            });                  
        });      

        var groupsArray = data.mainData.dataAccessUserGroupArray;
        $scope.GroupsAvailable = [];
        groupsArray.forEach(function(group) {           
            $scope.GroupsAvailable.push({
              name: group.name,
              userGroupId: group.userGroupId,
              value : false
            });                  
        });                   

    });

  $scope.choices = [];
  $scope.iframeWidth = $(window).width();
 

  $scope.addNewChoice = function(value,telecom) {  
    if(value != undefined && telecom != undefined && value != ""){ 
      var newItemNo = $scope.choices.length+1;      
      $scope.choices.push({'id':newItemNo, value:value, telecom:telecom});    
    }
  };
    
  $scope.removeChoice = function(choice) {
    var index = $scope.choices.indexOf(choice);    
    $scope.choices.splice(index,1);
  };

  function convertImgToBase64(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
        ctx.drawImage(this,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/jpeg');
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
  }

  $scope.pickerImage= function ()
  {
    var options = {
    maximumImagesCount: 1,
    width: 300,
    height: 300,
    quality: 75
    };

    $cordovaImagePicker.getPictures(options)
      .then(function (results) {          
          convertImgToBase64(results[0], function(base64Img){
              $scope.$apply(function(){
                $scope.imgURI=base64Img;
              })           
          });      
      }, function(error) {
        // error getting photos
      })
  };
  
  $scope.takePicture = function() {
    var options = { 
        quality : 75, 
        destinationType : Camera.DestinationType.DATA_URL, 
        sourceType : Camera.PictureSourceType.CAMERA, 
        allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {      
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
        // An error occured. Show a message to the user
    });
  }


 //  $scope.showPopup = function() {
 //  $scope.data = []; 
 //  $scope.data.push({'id':1, value:true, name:"1"},{'id':2, value:false, name:"2"},{'id':3, value:true, name:"3"},{'id':4, value:false, name:"4"});    
 //  // An elaborate, custom popup
 //  var myPopup = $ionicPopup.show({
 //    template: '<div data-ng-repeat="d in data"><ion-toggle  ng-model="d.value" toggle-class="toggle-calm">{{d.name}}</ion-toggle></div>',
 //    title: 'Data access security',
 //    subTitle: 'Allowed user groups',
 //    scope: $scope,
 //    buttons: [      
 //      {
 //        text: '<b>OK</b>',
 //        type: 'button-positive',
 //        onTap: function(e) {
 //          // if (!$scope.data.wifi) {
 //          //   //don't allow the user to close unless he enters wifi password
 //          //   e.preventDefault();
 //          // } else {
 //            return $scope.data;
 //          // }
 //        }
 //      }
 //    ]
 //  });
 //  myPopup.then(function(res) {
 //    console.log('Tapped!', res);      
 //  });  
 // };
 

    $scope.updateCountry = function (ncountry)
    {
      $scope.country = ncountry; 
      $scope.city =  undefined; 
      var cityRequest = $http({
        method: "post",        
        url: apiUrlLocal+GET_CITIES_OF_COUNTRY_URL,
        data: {
            'countryId' : ncountry.value
         }
      });
      cityRequest.success(
        function(data, status, headers, config) {      

          // call factory 
          PopupFactory.getPopup($scope,data);

          var cityArray = data.mainData.cityArray;
          $scope.cities = [];    
          cityArray.forEach(function(city) {           
              $scope.cities.push({
                name: city.cityName,
                value:city.cityId, 
                zip: city.zip,             
              });                     
          });    
      });
   
    }

    $scope.updateLanguage = function (nlanguage)
    {
      $scope.language = nlanguage;     
    }

    $scope.updateCity = function (ncity)
    {
      $scope.city = ncity;     
    }

  verifyIndexTelecom = function(contIndexTelecom,choice){
    respCont = 0;
    enterIn = false;
    contIndexTelecom.forEach(function(cont){
      if(cont.id == choice.telecom.value)
      {
        cont.cont = cont.cont + 1;
        respCont= cont.cont;
        enterIn = true;
      }  
    });
    if(!enterIn)
    {
      contIndexTelecom.push({id:choice.telecom.value , cont:0});
    }
    return respCont;
  }

  dataURItoBlob = function(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  $scope.saveOrganization = function() {
    contIndexTelecom = [];
    var fd = new FormData();    
    fd.append( 'dto(addressType)', OrgType);
    
    if ($scope.entity.name1 !=  undefined){
      fd.append( 'dto(name1)', $scope.entity.name1);  
    }
    else
    {
      fd.append( 'dto(name1)' , '');  
    }

    if ($scope.entity.name2 !=  undefined){
      fd.append( 'dto(name2)', $scope.entity.name2);
    }
    else
    {
      fd.append( 'dto(name2)' , '');  
    }

    if ($scope.entity.name3 !=  undefined){
      fd.append( 'dto(name3)', $scope.entity.name3);  
    }
    else
    {
      fd.append( 'dto(name3)' , '');
    }

    if($scope.entity.street != undefined){
      fd.append( 'dto(street)', $scope.entity.street);  
    } 
    
    if($scope.country != undefined){
      fd.append( 'countryId', $scope.country.value);
    }
    if($scope.language != undefined){
      fd.append( 'dto(languageId)', $scope.language.value);  
    }
    if($scope.city != undefined){
      fd.append( 'cityId', $scope.city.value);
      fd.append( 'city', $scope.city.name);
      fd.append( 'zip', $scope.city.zip);
    }    

    $scope.choices.forEach(function(choice){      
      index = verifyIndexTelecom(contIndexTelecom,choice);
      if(index == 0){
        newdata = "telecom("+choice.telecom.value+").predeterminedIndex";
        fd.append(newdata,0);
      }
      newdata = "telecom("+choice.telecom.value+").telecom["+index+"].data"; 
      fd.append(newdata,choice.value);        
    });

    $scope.telecoms.forEach(function(telecom){
      newdata = "telecom("+telecom.value+").telecomTypeId";
      fd.append(newdata,telecom.value);     
      newdata = "telecom("+telecom.value+").telecomTypeName";
      fd.append(newdata,telecom.name);       
    });    

    var accessUserGroupIds = "";
    $scope.GroupsAvailable.forEach(function(group){
        if(group.value == true){
          accessUserGroupIds = accessUserGroupIds + group.userGroupId + ",";
        }
    });

    if(accessUserGroupIds != ""){
      fd.append( 'dto(accessUserGroupIds)',accessUserGroupIds.substring(0, accessUserGroupIds.length - 1));
    }

    if($scope.imgURI != undefined){
      fd.append( 'imageFile', dataURItoBlob($scope.imgURI));
    }    
        
      $.ajax({
        url: apiUrlLocal+CREATE_PER_AND_ORG_URL,
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data){
          var result = JSON.parse(data);
          if(result.forward == "Success")
          {
            console.log("Organization creation succesfull");          
            $state.go('app.contacts'); 
          }
          else
          {           
             PopupFactory.getPopup($scope,result);
          }             
        }
      });     

     
  };
})


.controller('ContactPersonCtrl', function(contactPersonDetail,$state,PopupFactory,bridgeService,$scope,COLOR_VIEW,$localstorage,$stateParams, Contact,apiUrlLocal) {
  $scope.apiUrlLocal = apiUrlLocal;
  $scope.colorFont = COLOR_VIEW;

  $scope.accessRight = $localstorage.getObject('accessRight');  
  console.log('Access Right',$scope.accessRight);
  
  $scope.varUpdate = $scope.accessRight.CONTACTPERSON.UPDATE;  
         
  $scope.contact = contactPersonDetail.get({contactId: $stateParams.contactId, "dto(addressId)": $stateParams.addressId, "dto(contactPersonId)": $stateParams.contactPersonId, "dto(name1)":$stateParams.name1,"dto(name2)":$stateParams.name2});

  $scope.contact.$promise.then(function (results){
    // call factory 
    PopupFactory.getPopup($scope,results);

    $scope.contact = results;
    console.log("==CONTROLLER CONTACTS== result detail contact:", $scope.contact);

    $scope.telecomss=results.mainData.entity.telecoms;
    console.log("list of telecoms",$scope.telecomss);

    function compare(a,b) {     
      if (a.telecomTypePosition > b.telecomTypePosition) {
        return 1;
      }
      if (a.telecomTypePosition < b.telecomTypePosition) {
        return -1;
      }
      return 0;
    }

    $scope.telecomss.sort(compare);
    console.log('list of telecoms sort',$scope.telecomss);

    $scope.writeEmail = function(email)
    {      
        $state.go('app.newmail',{'to': email }); 
    }
    
    String.prototype.startsWith = function(prefix) {
      return this.indexOf(prefix) === 0;
    }

    $scope.go_to = function(link)
    {      
      if (!link.startsWith("http://")){
        window.open('http://'+link, '_system', 'location=yes'); return false;
      }
      else{
       window.open(link, '_system', 'location=yes'); return false; 
      }       
    }    

    $localstorage.setObject("EditContact",results.mainData);

    if (results.mainData.entity.countryId != "") {
      var countries = results.mainData.countryArray;
      countries.forEach(function(country) {
          if (country.countryId == results.mainData.entity.countryId) {
            $scope.countryName = country.name;
          }
      });
    }

    if (results.mainData.entity.titleId != "") {
      var titles = results.mainData.titleArray;
      titles.forEach(function(title) {
          if (title.titleId == results.mainData.entity.titleId) {
            $scope.titleperson = title.name;
          }
      });
    }


    // save contact for edit do not call service
    bridgeService.saveContact($scope.contact.mainData);

  });

})


.controller('OrganizationCtrl', function(allContact,$state,PopupFactory,bridgeService,$scope,COLOR_VIEW,$localstorage,$stateParams, Contact,apiUrlLocal) {
    $scope.apiUrlLocal = apiUrlLocal;
    $scope.colorFont = COLOR_VIEW;

  $scope.accessRight = $localstorage.getObject('accessRight');  
  console.log('Access Right',$scope.accessRight);
  
  $scope.varUpdate = $scope.accessRight.CONTACT.UPDATE;  
  $scope.varView = $scope.accessRight.CONTACTPERSON.VIEW;  


  console.log("param1", $stateParams.contactId);
  console.log("param2", $stateParams.addressId);
  console.log("param3", $stateParams.contactPersonId);
  console.log("param4", $stateParams.addressType);

  $scope.contact = allContact.get({contactId: $stateParams.contactId, "dto(addressId)": $stateParams.addressId, "dto(contactPersonId)": $stateParams.contactPersonId, "dto(addressType)": $stateParams.addressType});

  $scope.contact.$promise.then(function (results){

    // call factory 
    PopupFactory.getPopup($scope,results);

    $scope.contact = results;
    console.log("==CONTROLLER CONTACTS== result detail contact:", $scope.contact);

    $scope.telecomss=results.mainData.entity.telecoms;    

    function compare(a,b) {     
      if (a.telecomTypePosition > b.telecomTypePosition) {
        return 1;
      }
      if (a.telecomTypePosition < b.telecomTypePosition) {
        return -1;
      }
      return 0;
    }

    $scope.telecomss.sort(compare);
    console.log('list of telecoms sort',$scope.telecomss);

    $scope.writeEmail = function(email)
    {      
        $state.go('app.newmail',{'to': email}); 
    }
    
    String.prototype.startsWith = function(prefix) {
      return this.indexOf(prefix) === 0;
    }

    $scope.go_to = function(link)
    {      
      if (!link.startsWith("http://")){
        window.open('http://'+link, '_system', 'location=yes'); return false;
      }
      else{
       window.open(link, '_system', 'location=yes'); return false; 
      }


       
    }    

    $scope.seeContactsPerson = function (){
      $state.go('app.seeContactsPerson');
    }

    $localstorage.setObject("EditContact",results.mainData);

    if (results.mainData.entity.countryId != "") {
      var countries = results.mainData.countryArray;
      countries.forEach(function(country) {
          if (country.countryId == results.mainData.entity.countryId) {
            $scope.countryName = country.name;
          }
      });
    }   

    // save contact for edit do not call service
    bridgeService.saveContact($scope.contact.mainData);

  });

})

.controller('PersonCtrl', function($window,allContact,$state,PopupFactory,bridgeService,$scope,COLOR_VIEW,$localstorage,$stateParams, Contact,apiUrlLocal) {
    $scope.apiUrlLocal = apiUrlLocal;
    $scope.colorFont = COLOR_VIEW;

  $scope.accessRight = $localstorage.getObject('accessRight');  
  console.log('Access Right',$scope.accessRight);
  
  $scope.varUpdate = $scope.accessRight.CONTACT.UPDATE;  
  $scope.varView = $scope.accessRight.CONTACTPERSON.VIEW;

  console.log("param1", $stateParams.contactId);
  console.log("param2", $stateParams.addressId);
  console.log("param3", $stateParams.contactPersonId);
  console.log("param4", $stateParams.addressType);
  $scope.iframeWidth = $(window).width();

  $scope.contact = allContact.get({contactId: $stateParams.contactId, "dto(addressId)": $stateParams.addressId, "dto(contactPersonId)": $stateParams.contactPersonId, "dto(addressType)": $stateParams.addressType});

  $scope.contact.$promise.then(function (results){

    // call factory 
    PopupFactory.getPopup($scope,results);

    $scope.contact = results;
    console.log("==CONTROLLER CONTACTS== result detail contact:", $scope.contact);

    $scope.telecomss=results.mainData.entity.telecoms;
    console.log("list of telecoms",$scope.telecomss);

    function compare(a,b) {     
      if (a.telecomTypePosition > b.telecomTypePosition) {
        return 1;
      }
      if (a.telecomTypePosition < b.telecomTypePosition) {
        return -1;
      }
      return 0;
    }

    $scope.telecomss.sort(compare);
    console.log('list of telecoms sort',$scope.telecomss);

    $scope.seeContactsPerson = function (){
      $state.go('app.seeContactsPerson');
    }

    $scope.writeEmail = function(email)
    {      
        $state.go('app.newmail',{'to': email }); 
    }

    String.prototype.startsWith = function(prefix) {
      return this.indexOf(prefix) === 0;
    }

    $scope.go_to = function(link)
    {      
      console.log('000000000');
      if (!link.startsWith("http://")){
        console.log('iffffffff',link);
        window.open('http://'+link, '_system', 'location=yes'); return false;
      }
      else{
        console.log('elseeeeeee',link);
       window.open(link, '_blank', 'location=yes'); return false; 
      }       
    }  

    // $localstorage.setObject("EditContact",results.mainData);
// aaaaaaaaaaaaaa
    if (results.mainData.entity.countryId != "") {
      var countries = results.mainData.countryArray;
      countries.forEach(function(country) {
          if (country.countryId == results.mainData.entity.countryId) {
            $scope.countryName = country.name;
          }
      });
    }    

    if (results.mainData.entity.titleId != "") {
      var titles = results.mainData.titleArray;
      titles.forEach(function(title) {
          if (title.titleId == results.mainData.entity.titleId) {
            $scope.titleperson = title.name;
          }
      });
    }

    // save contact for edit do not call service
    bridgeService.saveContact($scope.contact.mainData);

  });

})

//
// CONTROLLER LIST CONTACT TO ADD APPOINTMENT
//
.controller('ctrlSeeContactsPerson', function($state,ContactPerson,bridgeService,$ionicPopup,$filter,$ionicScrollDelegate,PopupFactory,allContact,$scope,apiUrlLocal,$localstorage) {
  console.log('*******************************************************');
  console.log("==CONTROLLER CONTACT== see contact person");

  $scope.pagesintotal; 
  $scope.page = 1;
  $scope.showSearchBar = false;
  $scope.apiUrlLocal = apiUrlLocal;
  $scope.contacts = [];
  $scope.asknext = false;

  // *******
  // access right
  $scope.accessRight = $localstorage.getObject('accessRight');  
  console.log('Access Right',$scope.accessRight);
  $scope.varCreate = $scope.accessRight.CONTACTPERSON.CREATE;

  var mainData = bridgeService.getContact();
  console.log("maindata of contact or organization:",mainData);
// ********8


  // EXECUTE QUERY WITH (PAGE NUMBER)
  // ******
  $scope.newContacts = ContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});
  // *******
  // $scope.newContacts = allContact.query({'pageParam(pageNumber)':$scope.page});
  
  $scope.newContacts.$promise.then(function (results){
      
      // call factory to validate the response
      PopupFactory.getPopup($scope,results);
      
      console.log("1. results of request: ",results);

      $scope.contacts = (results['mainData'])['list'];

      // get page and page in total
      $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.pagesintotal = parseInt((results['mainData'])['pageInfo']['totalPages']);

      console.log("2. page number", $scope.page);
      console.log("3. page in total", $scope.pagesintotal);

      if ($scope.contacts.length > 0 && $scope.pagesintotal>$scope.page) {
        $scope.asknext = true;  
      };
  })

  $scope.hideSearch = function() {
    console.log('*******************************************************');
    console.log("4. hide search");
    $scope.searchKey = "";
    $scope.showSearchBar = false;
  };    

  $scope.doRefresh = function() {
    console.log('*******************************************************');
    console.log("5. do refresh");

    $scope.page=1;
    $scope.searchKey = "";
    $scope.showSearchBar = false;
    $scope.$broadcast('scroll.infiniteScrollComplete');

    // EXECUTE QUERY WITH (PAGE NUMBER)
    // ******
    $scope.newContacts = ContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});
    // ******
    // $scope.newContacts = allContact.query({'pageParam(pageNumber)':$scope.page});

    // PROMISE
    $scope.newContacts.$promise.then(function (results){

      // call factory to validate the response
      PopupFactory.getPopup($scope,results);
      
      console.log("6. results of request: ",results);

      $scope.contacts = (results['mainData'])['list']
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
      $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);

      console.log("7. page number", $scope.page);
      console.log("8. page in total", $scope.totalPages);

      if ( $scope.totalPages > $scope.page ) {
        $scope.asknext = true;
      };

      $scope.$broadcast('scroll.refreshComplete'); 
      $ionicScrollDelegate.scrollTop();
    });
  };  

  $scope.loadMore = function() {
    console.log('*******************************************************');
    console.log("9. load more contacts");
    
    $scope.page = $scope.page + 1;
    $scope.asknext = false;

    // EXECUTE QUERY WITH (PAGE NUMBER)
    // *******
    $scope.newContacts = ContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});
    // ******
    // $scope.newContacts = allContact.query({'pageParam(pageNumber)':$scope.page});
    // PROMISE
    $scope.newContacts.$promise.then(function(results){
    
      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("10. results of request: ",results);

      $scope.contacts = $scope.contacts.concat((results['mainData'])['list']);
      $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);

      console.log("11. page number", $scope.page);
      console.log("12. page in total", $scope.totalPages);

      $scope.$broadcast('scroll.infiniteScrollComplete');
      if ($scope.totalPages > $scope.page) {
        $scope.asknext = true;  
      };


    });
  };

  $scope.searchcon = function(){
    $scope.showSearchBar = !$scope.showSearchBar;
  }   

  $scope.search = function () {
    console.log('*******************************************************');
    console.log("13. function search");

    $scope.contacts = [];
    $scope.asknext = false;
    $scope.showSearchBar = !$scope.showSearchBar;

    // EXECUTE QUERY WITH (CONTACT SEARCH NAME)
    // *****
    $scope.buscados = ContactPerson.query({'contactId':mainData.entity.addressId,'parameter(lastName@_firstName@_searchName)':$scope.searchKey});
    // ********
    // $scope.buscados = allContact.query({'parameter(contactSearchName)':$scope.searchKey});
    
    // PROMISE
    $scope.buscados.$promise.then(function (results){
        
      // call factory to validate the response
      PopupFactory.getPopup($scope,results);  

      console.log("14. results of request: ",results);  

      $scope.contacts = (results['mainData'])['list'];
      $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);

      console.log("15. page number", $scope.page);
      console.log("16. page in total", $scope.totalPages);

      if ($scope.totalPages > $scope.page) {
        $scope.asknext = true;  
      }; 

      // if no exists items show message
      if ($scope.contacts.length == 0) {

        console.log("17. no exists items");

        var message = $filter('translate')('NoItems');
        var messageRefresh = $filter('translate')('PulltoRefresh');
        // An alert dialog
        
        var alertPopup = $ionicPopup.alert({
            title: message,
            template: messageRefresh
        });
      }
      $ionicScrollDelegate.scrollTop();
                
    });
      
    $scope.loadMore = function() {
      console.log('*******************************************************');
      console.log("18. load more into search");

      $scope.page = $scope.page +1;

      // EXECUTE QUERY WITH (contactSearchName, pageNumber)
      // *******
      
      $scope.buscados = ContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page,'parameter(lastName@_firstName@_searchName)':$scope.searchKey});
      
      // *********
      // $scope.buscados = allContact.query({'parameter(contactSearchName)':$scope.searchKey,'pageParam(pageNumber)':$scope.page});
      // PROMISE
      $scope.buscados.$promise.then(function(results){

        // call factory to validate the response
        PopupFactory.getPopup($scope,results);

        console.log("19. results of request: ",results);

        $scope.contacts = $scope.contacts.concat((results['mainData'])['list']);
        $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
        $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);

        console.log("20. page number", $scope.page);
        console.log("21. page in total", $scope.totalPages);

        $scope.$broadcast('scroll.infiniteScrollComplete');
                
      });
            
      if ($scope.totalPages <= $scope.page) {
        $scope.asknext = false;  
      };              
    };
  }

  $scope.getContactUrl = function(item,type){  
    var accessRight = $localstorage.getObject('accessRight');
    accessRightContactPerson = $scope.accessRight.CONTACTPERSON.VIEW;  

    // IF CONTACT PERSON HAVE PERMISSION TO READ
    var result = '#';
    if (item.contactPersonAddressId != "" && accessRightContactPerson != "true") {
      result = '#';
    }
    result = '#/app/contactPerson?contactId='+item.addressId+'&addressId='+item.addressId+'&contactPersonId='+item.contactPersonId+'&name1='+item.lastName+'&name2='+item.firstName;
          
    return result;
    
  };

  $scope.addContactPerson = function(){
    console.log('==CONTACT CONTROLLER== go to add contact person controller');
    $state.go('app.addContactPerson');
  }
                            
})

// .controller('ctrlSeeContactsPerson', function($stateParams,$window,$ionicPopup,$filter,apiUrlLocal,bridgeService,ContactPerson,$state,$localstorage,$ionicScrollDelegate,PopupFactory,$scope,COLOR_VIEW) {

//   $scope.accessRight = $localstorage.getObject('accessRight');  
//   console.log('Access Right',$scope.accessRight);

//   if($stateParams.updated == true){
//     console.log('----0-0-0-000000--------trueeeee');
//   }
//   else{
//     console.log('----0-0-0-000000--------falseeeee');
//   }

  
//   $scope.varCreate = $scope.accessRight.CONTACTPERSON.CREATE;

//   var mainData = bridgeService.getContact();
//   console.log("==CONTROLLER CONTACT== see contact person, maindata of contact or organization:",mainData);
  
//   $scope.colorFont = COLOR_VIEW;
//   $scope.totalPages; 
//   $scope.page = 1; 
//   $scope.asknext = false; 
//   $scope.newContacts = ContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});
//   $scope.helpToCallList = false;
//   $scope.contacts = [];
//   $scope.apiUrlLocal = apiUrlLocal;
    
//   $scope.newContacts.$promise.then(function (results){
        
//     // call factory 
//     PopupFactory.getPopup($scope,results);
    
//     console.log("1. promise results: ",(results['mainData']));

//     $scope.contacts = (results['mainData'])['list'];

//     $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
//     $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);

//     console.log("current page: ", $scope.page);
//     console.log("total pages: ", $scope.totalPages);

//     if ( $scope.totalPages > $scope.page) {
//       $scope.asknext = true;  
//     };
//     // if no exists items show message
//     if ($scope.contacts.length == 0) {

//       var message = $filter('translate')('NoItems');
//       var messageClose = $filter('translate')('Close');
//       // An alert dialog
//       console.log("==CONTROLLER CONTACTS== alert if no exists items");
//       var alertPopup = $ionicPopup.alert({
//           title: message,
//           buttons: [
//             { text: '<b>'+messageClose+'</b>',
//               type: 'button-positive',
//               onTap: function(e) {
//                 // $window.history.back();
//               }
//             },
//           ]
//       });
//     }
//     $ionicScrollDelegate.scrollTop();
//   })

//   $scope.hideSearch = function() {
//     $scope.searchKey = "";
//     $scope.showSearchBar = false;
//   };

//   $scope.doRefresh = function() {
//     $scope.searchKey = "";
//     $scope.page = 1;
//     $scope.helpToCallList = false;
//     $scope.showSearchBar = false;
//     $scope.newContacts = ContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});

//     $scope.newContacts.$promise.then(function (results){

//       // call factory 
//       PopupFactory.getPopup($scope,results);
//       console.log("2. promise results: ",(results['mainData']));

//       if (results['forward'] == "") {
//         $scope.contacts = (results['mainData'])['list'];
//         $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
//         $scope.$broadcast('scroll.refreshComplete'); 
          
//         $scope.pag=parseInt((results['mainData'])['pageInfo']['pageNumber']);
//         $scope.totalPages=parseInt((results['mainData'])['pageInfo']['totalPages']);
        
//         if ( $scope.totalPages > $scope.page ) {
//           $scope.asknext = true;
//         };
//         $ionicScrollDelegate.scrollTop();
//       }
//     });
//   };  

//   $scope.loadMore = function() {
    
//     $scope.page = $scope.page + 1;
//     $scope.asknext = false;
//     $scope.newContacts = ContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});
//     $scope.newContacts.$promise.then(function(results){
      
//       // call factory 
//       PopupFactory.getPopup($scope,results);
//       console.log("3. promise results: ",(results['mainData']));

//       $scope.contacts = $scope.contacts.concat((results['mainData'])['list']);
//       $scope.$broadcast('scroll.infiniteScrollComplete');
      
//       $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
//       $scope.totalPages=parseInt((results['mainData'])['pageInfo']['totalPages']);
      
//       if ( $scope.totalPages > $scope.page ) {
//         $scope.asknext = true;  
//       };
        
//     });
//   };

//   $scope.getContactUrl = function(item,type){  
//     var accessRight = $localstorage.getObject('accessRight');
//     accessRightContactPerson = $scope.accessRight.CONTACTPERSON.VIEW;  

//     // IF CONTACT PERSON HAVE PERMISSION TO READ
//     var result = '#';
//     if (item.contactPersonAddressId != "" && accessRightContactPerson != "true") {
//       result = '#';
//     }
//     // switch(type) {
//       // case 'contactPerson':
//       result = '#/app/contactPerson?contactId='+item.addressId+'&addressId='+item.addressId+'&contactPersonId='+item.contactPersonId+'&name1='+item.lastName+'&name2='+item.firstName;
          
//           // break;
//       // default:
//       return result;
//     // }    
//   };

//   $scope.addContactPerson = function(){
//     console.log('==CONTACT CONTROLLER== go to add contact person controller');
//     $state.go('app.addContactPerson');
//   }



//   $scope.searchcon = function(){
//     $scope.showSearchBar = !$scope.showSearchBar;
//   }

//   $scope.search = function () {
    
//     console.log("==CONTROLLER CONTACT== search contact person");
//     $scope.helpToCallList = true;
//     $scope.contacts = [];
//     $scope.showSearchBar = !$scope.showSearchBar;
//     console.log("-------search ---",$scope.searchKey);

//     $scope.buscados = ContactPerson.query({'contactId':mainData.entity.addressId,'parameter(lastName@_firstName@_searchName)':$scope.searchKey});
//     $scope.asknext = false;

//     $scope.buscados.$promise.then(function (results){
//         // call factory 
//       PopupFactory.getPopup($scope,results);    

//       $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
//       $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
              
//       $scope.contacts = (results['mainData'])['list'];
       
//       if ($scope.contacts.length > 0 && $scope.totalPages>$scope.page) {
//         $scope.asknext = true;  
//       }; 

//       // if no exists items show message
//       if ($scope.contacts.length == 0) {

//         var message = $filter('translate')('NoItems');
//         var messageRefresh = $filter('translate')('PulltoRefresh');
//         // An alert dialog
//         console.log("==CONTROLLER CONTACTS== alert if no exists items");
//         var alertPopup = $ionicPopup.alert({
//             title: message,
//             template: messageRefresh
//         });
//       }
//       $ionicScrollDelegate.scrollTop();
                
//     });
      
//     $scope.loadMore = function() {
//       console.log("------------------1 loadMore dentro search");
//       $scope.page = $scope.page +1;     
//       console.log("trying to load more of the search",$scope.page);
//       if ($scope.helpToCallList) {
//         console.log("search load more: value true",mainData.entity.addressId);
//         $scope.buscados = ContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page,'parameter(lastName@_firstName@_searchName)':$scope.searchKey});
//       }
//       else{
//         console.log("search load more: value false",mainData.entity.addressId);
//         $scope.buscados = ContactPerson.query({'contactId':mainData.entity.addressId,'pageParam(pageNumber)':$scope.page});
//       }

      
//       $scope.buscados.$promise.then(function(results){

//           // call factory 
//           PopupFactory.getPopup($scope,results);

//           $scope.totalPages=parseInt((results['mainData'])['pageInfo']['totalPages']);

//           $scope.contacts = $scope.contacts.concat((results['mainData'])['list']);
//           $scope.$broadcast('scroll.infiniteScrollComplete');
//           console.log("======0000new list of contacts for search",$scope.contacts);
//       });
            
//       if ($scope.totalPages<$scope.page+1) {
//         $scope.asknext = false;  
//       };              
//     };
//   }


// })
