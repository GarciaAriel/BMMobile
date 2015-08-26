angular.module('starter.scheduleControllerAddParticipants', ['starter.scheduleservices','ionic-datepicker'])

// 
// CONTROLLER ADD PARTICIPANTS
//
.controller('addParticipants', function(ADD_PARTICIPANT,forwardAddParticipantService,$stateParams,seeParticipantsService,$ionicHistory,PopupFactory,$filter,$ionicScrollDelegate,$scope,apiUrlLocal,$state,$ionicPopup) {
  console.log('*******************************************************');
  console.log("==CONTROLLER PRODUCTS==");

  $scope.apiUrlLocal = apiUrlLocal;
  $scope.totalPages;
  $scope.page = 1;
  $scope.showSearchBar = false;
  $scope.participants = [];
  $scope.asknext = false;

  // EXECUTE QUERY WITH ()
  $scope.listOfParticipants = forwardAddParticipantService.query({'appointmentId':$stateParams.appointmentId});
  
  $scope.listOfParticipants.$promise.then(function (results){
        
    // call factory to validate the response
    PopupFactory.getPopup($scope,results);
        
    console.log("results of request: ",results);
    
    $scope.participants = (results['mainData'])['list'];
    for (var index in $scope.participants) {
      $scope.participants[index].model = false;
    }
    $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
    $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
    console.log("page number: "+$scope.page+" total pages: "+$scope.totalPages);
    
    if ( $scope.totalPages > $scope.page ) {
      $scope.asknext = true;  
    };
  })

  $scope.addParticipant = function(){
    console.log('add participant participant');
    $state.go();
  }

  $scope.doRefresh = function() {
    console.log('*******************************************************');
    console.log("do refresh principal");
    $scope.page=1;
    $scope.searchKey = "";
    $scope.showSearchBar = false;
    $scope.asknext = false;
    $scope.$broadcast('scroll.infiniteScrollComplete');

    // EXECUTE QUERY WITH ()
    $scope.listOfParticipants = forwardAddParticipantService.query({'appointmentId':$stateParams.appointmentId,'pageParam(pageNumber)':$scope.page});

    // primise
    $scope.listOfParticipants.$promise.then(function (results){

      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);

      $scope.participants = results['mainData']['list'];
      for (var index in $scope.participants) {
        $scope.participants[index].model = false;
      }
      $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
      $scope.$broadcast('scroll.refreshComplete'); 

      console.log("page number: "+$scope.page+" total pages: "+$scope.totalPages);
      
      if ( $scope.totalPages > $scope.page ) {
        $scope.asknext = true;
      };
      $ionicScrollDelegate.scrollTop();
    });
  };  

  $scope.loadMore = function() {
    console.log('*******************************************************');
    console.log("loadMore principal");
  
    $scope.page = $scope.page + 1;
    
    // EXECUTE QUERY WITH ()
    $scope.listOfParticipants = forwardAddParticipantService.query({'appointmentId':$stateParams.appointmentId,'pageParam(pageNumber)':$scope.page});

    // promise
    $scope.listOfParticipants.$promise.then(function(results){
    
      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);

      var aux = $scope.participants;
      var auxNewParticipants = results['mainData']['list'];
      for (var index in auxNewParticipants) {
        auxNewParticipants[index].model = false;
      }
      $scope.participants = aux.concat(auxNewParticipants);
      $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      
      console.log("page number: "+$scope.page+" total pages: "+$scope.totalPages);
      
      if ($scope.totalPages < $scope.page+1) {
        $scope.asknext = false;  
      };

    });
  };


  $scope.getProductUrl = function(item){
    return '#/app/productDetail?productId='+item.productId+'&productName='+item.productName;  
  };

  $scope.saveNewParticipants = function(){
    console.log('*******************************************************');
    console.log('add new participants on appointment');
    console.log('all participants',$scope.participants);
    
    var fd = new FormData();
    fd.append('Import_value', true);
    fd.append('appointmentId', $stateParams.appointmentId);
    fd.append('dto(appointmentId)', $stateParams.appointmentId);

    for (var index in $scope.participants) {
      if ($scope.participants[index].model == true) {
        fd.append('aditionals', $scope.participants[index].userId);
      }
    }
       
    $.ajax({
      url: apiUrlLocal+ADD_PARTICIPANT,
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data){

        var result = JSON.parse(data);
        if(result.forward == "Success"){
          console.log("Add participants succesfull");
          $ionicHistory.goBack();
          // $state.go('app.schedulerView');
        }
        else{        
          // call factory to validate the response
          PopupFactory.getPopup($scope,result);
        }             
      }
    });
  }
  
});