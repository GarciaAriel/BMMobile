angular.module('starter.webmailControllerListEmail', ['starter.webmailservices','starter.constantsWebmail'])

// MAIL LISTS IN FORDER (REFRESH / LOADMORE)
.controller('MailsListCtrl',function(serviceEmailData,$ionicScrollDelegate,PopupFactory,$filter,$ionicPopup,$scope,COLOR_VIEW,apiUrlLocal, Mail,$timeout,$ionicLoading,$resource,$stateParams){
  
  console.log('*******************************************************');
  console.log('==CONTROLLER WEBMAIL== lis email in folder');  

  $scope.colorFont = COLOR_VIEW;
  $scope.page = 1; 
  $scope.totalPages; 
  $scope.apiUrlLocal = apiUrlLocal;
  $scope.mailList = [];
  $scope.folderName = $stateParams.folderName;
  $scope.asknext = false;
  $scope.showSearchBar = false;
  $scope.typeFolder = $stateParams.type;
  
  console.log("folder name",$scope.folderName);
  
  // EXECUTE QUERY WITH ()
  $scope.newMailList = Mail.query({'pageParam(pageNumber)':$scope.page,'folderId':$stateParams.folderId});
  
  // PROMISE
  $scope.newMailList.$promise.then(function (results){

    // call factory to validate the response
    PopupFactory.getPopup($scope,results);

    console.log("results of request: ",results);

    //  SAVE PAGE NUMBER AND TOTAL PAGES
    $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
    $scope.totalPages = parseInt(results['mainData']['pageInfo']['totalPages']);

    // RECOVER LIST MAIL FOR VIEW
    $scope.mailList = (results['mainData'])['list'];
    var dataForView = {'list': $scope.mailList,'pageInfo': results['mainData']['pageInfo']}
    serviceEmailData.saveData(dataForView);

    // REFRESH = TRUE IF LIST > 0 AND TOTAL PAGES > PAGE ACTUAL
    if ($scope.totalPages > $scope.page) {
        $scope.asknext = true;  
    };

    // if no exists items show message
    if ($scope.mailList.length == 0) {
      console.log("alert if no exists items");
      // An alert dialog
      var message = $filter('translate')('NoItems');
      var messageSelect = $filter('translate')('SelectAnother');

      var alertPopup = $ionicPopup.alert({
          title: message,
          template: messageSelect
      });
    }
      
  });

  $scope.getDateMilli = function(milliseconds){
    var day_Send = new Date(+milliseconds);
    
    var dd = day_Send.getDate();
    var mm = day_Send.getMonth();
    var yy = day_Send.getFullYear();
    
    var date = new Date();
    
    if ( (dd == date.getDate()) && (mm == (date.getMonth())) && (yy == date.getFullYear()) ) {
      // date: in the same day
      var hhh = day_Send.getHours();
      var mmmm = (day_Send.getMinutes()).toString();
      var mmm = (mmmm).length < 2 ? "0"+mmmm : mmmm;
      
      return (hhh+":"+mmm);  
    }
    else {
      // date: week
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      // var firstDate = new Date(date.getFullYear(),date.getMonth()+1,date.getDate());
      // var secondDate = new Date(yy,mm,dd);

      var diffDays = Math.round(Math.abs((date.getTime() - day_Send.getTime())/(oneDay)));
      // return diffDays;
      if ( diffDays <= 6  ) {

        var Monday = $filter('translate')('Monday');
        var Tuesday = $filter('translate')('Tuesday');
        var Wednesday = $filter('translate')('Wednesday');
        var Thursday = $filter('translate')('Thursday');
        var Friday = $filter('translate')('Friday');
        var Saturday = $filter('translate')('Saturday');
        var Sunday = $filter('translate')('Sunday');

                
        var weekdays = new Array(7);
        weekdays[4] = Thursday;
        weekdays[5] = Friday;
        weekdays[6] = Saturday;
        weekdays[0] = Sunday;
        weekdays[1] = Monday;
        weekdays[2] = Tuesday;
        weekdays[3] = Wednesday;

        var day = day_Send.getDay();
        
        return weekdays[day];
      }
      else{// "28/05/2015 23:25"
        // date: older
        var d = (dd.toString()).length < 2 ? "0"+dd : dd;
        var mes = parseInt(mm) + 1;
        var ms = (mes.toString()).length < 2 ? "0"+mes : mes;
        
        var ddddd = d+"-"+ms+"-"+(yy.toString()).substring(2, 4);
        return ddddd;
      }
    }
  }
  
  $scope.doRefresh = function() {
    console.log('*******************************************************');
    console.log('do refresh list emails');
    $scope.searchKey = "";
    $scope.page = 1; 
    $scope.asknext = false;

    // EXECUTE QUERY WITH (PAGE NUMBER)  
    $scope.newMailList = Mail.query({'pageParam(pageNumber)':$scope.page,'folderId':$stateParams.folderId});

    // PROMISE
    $scope.newMailList.$promise.then(function (results){

      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);

      //  MAIL LIST
      $scope.mailList = (results['mainData'])['list'];
      $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
    
      // RECOVER LIST MAIL FOR VIEW
      var dataForView = {'list': $scope.mailList,'pageInfo': results['mainData']['pageInfo']}
      serviceEmailData.saveData(dataForView);
      
      $scope.$broadcast('scroll.refreshComplete');  
      
      if ($scope.totalPages > $scope.page) {
        $scope.asknext = true;  
      };  
    });
  }

  $scope.loadMore = function() {
    console.log('*******************************************************');
    console.log('load more');
    $scope.page = $scope.page + 1;
    
    //  CALL SERVICES WITH (PAGE NUMBER AND FOLDER ID)
    $scope.newMails = Mail.query({'pageParam(pageNumber)':$scope.page,'folderId':$stateParams.folderId});

    // PROMISE
    $scope.newMails.$promise.then(function(results){
      // call factory 
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);
      $scope.mailList = $scope.mailList.concat((results['mainData'])['list']);
      $scope.page = parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
      $scope.$broadcast('scroll.infiniteScrollComplete');

      // RECOVER LIST MAIL FOR VIEW
      var dataForView = {'list': $scope.mailList,'pageInfo': results['mainData']['pageInfo']}
      serviceEmailData.saveData(dataForView);
      
      // REFRESH = FALSE IF TOTAL PAGES <= PAGE ACTUAL ++
      if ($scope.totalPages<$scope.page+1) {
        $scope.asknext = false;  
      };
    });  
  }

  // function search mail
  $scope.search = function () {
    console.log('*******************************************************');
    console.log("search function with: ",$scope.searchKey);
    $scope.mailList = [];
    $scope.showSearchBar = !$scope.showSearchBar;
    $scope.asknext = false;
    $scope.page = 1;

    //  CALL SERVICES WITH (PAGE NUMBER AND FOLDER ID)
    $scope.newMails = Mail.query({'pageParam(pageNumber)':$scope.page,'folderId':$stateParams.folderId,'parameter(mailSubject@_mailFrom@_mailPersonalFrom)':$scope.searchKey});
    
    // PROMISE
    $scope.newMails.$promise.then(function (results){
          
      // call factory to validate the response
      PopupFactory.getPopup($scope,results);    

      console.log("results of request: ",results);

      $scope.mailList = (results['mainData'])['list'];
      $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
      $scope.totalPages = parseInt((results['mainData'])['pageInfo']['totalPages']);
      
      console.log("page number: "+$scope.page+" total pages: "+$scope.totalPages);
      
      // RECOVER LIST MAIL FOR VIEW
      var dataForView = {'list': $scope.mailList,'pageInfo': results['mainData']['pageInfo']}
      serviceEmailData.saveData(dataForView);
      
      if ( $scope.totalPages > $scope.page) {
        $scope.asknext = true;
      };

      // if no exists items show message
      if ($scope.mailList.length == 0) {
        console.log("alert if no exists items");

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
      console.log("loadMore dentro search");
      $scope.page = $scope.page +1;
      $scope.asknext = false;

      //  CALL SERVICES WITH (PAGE NUMBER AND FOLDER ID)
      $scope.newMails = Mail.query({'pageParam(pageNumber)':$scope.page,'folderId':$stateParams.folderId,'parameter(mailSubject@_mailFrom@_mailPersonalFrom)':$scope.searchKey});
  
      // promise
      $scope.newMails.$promise.then(function(results){

        // call factory to validate the response
        PopupFactory.getPopup($scope,results);

        console.log("results of request: ",results);

        $scope.page=parseInt((results['mainData'])['pageInfo']['pageNumber']);
        $scope.totalPages=parseInt((results['mainData'])['pageInfo']['totalPages']);
        $scope.mailList = $scope.mailList.concat((results['mainData'])['list']);
        $scope.$broadcast('scroll.infiniteScrollComplete');

        // RECOVER LIST MAIL FOR VIEW
        var dataForView = {'list': $scope.mailList,'pageInfo': results['mainData']['pageInfo']}
        serviceEmailData.saveData(dataForView);
      });
              
      if ($scope.totalPages > $scope.page) {
        $scope.asknext = true;  
      };              
    };
  }

  // show or hide search
  $scope.searchcon = function(){
    $scope.showSearchBar = !$scope.showSearchBar;
  }

  // clear search
  $scope.hideSearch = function() {
    $scope.searchKey = "";
    $scope.showSearchBar = false;
  };

});