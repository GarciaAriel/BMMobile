angular.module('starter.scheduleControllerShowParticipants', ['starter.scheduleservices','ionic-datepicker'])

// 
// CONTROLLER SEE PARTICIPANTS
//
.controller('seeParticipants', function($localstorage,deleteParticipantService,$stateParams,seeParticipantsService,$ionicHistory,PopupFactory,$filter,$ionicScrollDelegate,$scope,apiUrlLocal,$state,$ionicPopup) {
  console.log('*******************************************************');
  console.log("==CONTROLLER PRODUCTS==");

  // $ionicHistory.clearHistory();   
  $scope.apiUrlLocal = apiUrlLocal;
  $scope.totalPages;
  $scope.page = 1;
  $scope.showSearchBar = false;
  $scope.participants = [];
  $scope.asknext = false;

  $scope.accessRight = $localstorage.getObject('accessRight');
  $scope.addParticipants = $scope.accessRight.APPOINTMENTPARTICIPANT.CREATE;
  $scope.deleteParticipants = $scope.accessRight.APPOINTMENTPARTICIPANT.DELETE;
  // elgarjo
  

  // EXECUTE QUERY WITH ()
  $scope.listOfParticipants = seeParticipantsService.query({'appointmentId':$stateParams.appointmentId,'pageParam(pageNumber)':$scope.page});
  
  $scope.listOfParticipants.$promise.then(function (results){
        
    // call factory to validate the response
    PopupFactory.getPopup($scope,results);
        
    console.log("results of request: ",results);
    
    $scope.participants = (results['mainData'])['list'];
    $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
    $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
    console.log("page number: "+$scope.page+" total pages: "+$scope.totalPages);
    
    if ( $scope.totalPages > $scope.page ) {
      $scope.asknext = true;  
    };
  })

  $scope.addParticipant = function(){
    console.log('add participant participant');
    $state.go('app.addParticipants',{'appointmentId':$stateParams.appointmentId});
  }

  $scope.deleteParticipant = function(participant){
    console.log('*******************************************************');
    console.log('delete participant');
    
    var message = $filter('translate')('DeleteParticipant');

    var confirmPopup = $ionicPopup.confirm({
      title: message
    });
    confirmPopup.then(function(res) {
      if(res) {
        // EXECUTE QUERY WITH ()
        $scope.resultDeleteParticipant = deleteParticipantService.query({'dto(op)':'delete',
                  'appointmentId': participant.appointmentId,
                  'dto(scheduledUserId)': participant.scheduledUserId,
                  'dto(participantName)': participant.userName,
                  'dto(title)': participant.title });
        
        $scope.resultDeleteParticipant.$promise.then(function (results){
              
          // call factory to validate the response
          PopupFactory.getPopup($scope,results);
              
          console.log("results of request: ",results);
          console.log('participant was removed');
          
          console.log('----------participant',participant);
             
          $scope.participants = $.grep($scope.participants, function(e){ 
            return e.scheduledUserId != participant.scheduledUserId; 
          });
          console.log('----------new list participant',$scope.participants);
          // $ionicHistory.goBack();
          // $state.reload();
        })
      } else {
        console.log('You are not sure');
      }
    });
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
    $scope.listOfParticipants = seeParticipantsService.query({'appointmentId':$stateParams.appointmentId,'pageParam(pageNumber)':$scope.page});

    // primise
    $scope.listOfParticipants.$promise.then(function (results){

      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);

      $scope.participants = results['mainData']['list'];
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
    $scope.listOfParticipants = seeParticipantsService.query({'appointmentId':$stateParams.appointmentId,'pageParam(pageNumber)':$scope.page});

    // promise
    $scope.listOfParticipants.$promise.then(function(results){
    
      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);
    
      $scope.participants = $scope.participants.concat((results['mainData'])['list']);
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

});
