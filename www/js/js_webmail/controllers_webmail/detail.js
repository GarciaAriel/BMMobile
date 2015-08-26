angular.module('starter.webmailControllerDetail', ['starter.webmailservices','starter.constantsWebmail'])

// DETAILS MAIL
.controller('MailDetailCtrl', function(serviceExecute,$localstorage,$ionicHistory,$timeout,$state,serviceEmailData,PopupFactory,$filter,$scope,$cordovaFileTransfer,$http,$sce,$ionicPopup,$ionicLoading,$stateParams,Mail,apiUrlLocal,PATH_WEBMAIL,BODY_TYPE_HTML,BODY_TYPE_HTML) {
  console.log('*******************************************************');
  console.log("==WEBMAIL CONTROLLER DETAILS MAIL== start");

  // access right
  var accessRight = $localstorage.getObject('accessRight');
  accessRightMailExecute = $scope.accessRight.MAIL.EXECUTE;
  $scope.replyExecute = false;
  $scope.replyAllExecute = false;
  $scope.forwardExecute = false;  
  if (accessRightMailExecute == "true") {
    $scope.replyExecute = serviceExecute.reply($stateParams.typeFolder);
    $scope.replyAllExecute = serviceExecute.replyAll($stateParams.typeFolder);
    $scope.forwardExecute = serviceExecute.forward($stateParams.typeFolder);  
  }
  
  // get list of email for slide
  var dataService = serviceEmailData.getData();
  $scope.emailList = dataService.list;
  $scope.pageInfo = dataService.pageInfo;
  console.log('email list service and pageInfo: ',dataService);

    //  CALL SERVICES WITH (PAGE NUMBER AND FOLDER ID)
    $scope.detail = Mail.query({'dto(mailId)': $stateParams.mailId,'folderId': $stateParams.folderId});
    $scope.item = {};
    $scope.iframeWidth = $(window).width();
   
    // PROMISE
    $scope.detail.$promise.then(function (results){

      // call factory 
      PopupFactory.getPopup($scope,results);

        console.log("query detail success OK data: ",results);
        $scope.item = (results['mainData'])['entity'];
        
        //SPLIT STRING TO ARRAY CC
        $scope.arrayCC = [];
        var cc = results['mainData']['entity']['cc'];
        $scope.arrayCC.push(cc);
        
        //SPLIT STRING TO ARRAY BCC
        $scope.arrayBCC = [];
        var bcc = results['mainData']['entity']['bcc'];
        $scope.arrayBCC.push(bcc);  
        
        // this callback will be called asynchronously
        // CALL HTML BODY
        if (results['mainData']['entity']['bodyType'] == BODY_TYPE_HTML) {
            
            var newurl = results['mainData']['entity']['htmlBodyUrl'];
            $scope.uuuurrrl = results['mainData']['entity']['htmlBodyUrl'];
            $http.get(apiUrlLocal+newurl).

            success(function(data, status, headers, config) {

              // call factory 
              PopupFactory.getPopup($scope,data);
              console.log("results of request: ",data);

              var newHtml = data.split("<img").join(" <img class='img-class' ");

              var regex = /href="([\S]+)"/g;
              var newHtml = newHtml.replace(regex, "onClick=\"window.open('$1', '_system', 'location=yes')\"");
              console.log('--------appppppp new html',newHtml);
              
              $scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml(newHtml);
              
            }).
            error(function(data, status, headers, config) {
              // or server returns response with an error status.
            });
        }
        else{
          // zzzzzzzzzzzzzzz detail
          angular.element(document).ready(function () {
            console.log('page loading completed');
            var element = document.getElementById("page_content");
            element.style.height = element.scrollHeight + "px";
          });
        }
        

        $scope.iframeHeight = $(window).height();
        $scope.iframeWidth = $(window).width();
    });

    $scope.onSwipeRight = function(item){
      console.log('*******************************************************');
      console.log('----------------START----------------');
      console.log('slide right, item:',item);
      var i = 0;
      for(i; i < $scope.emailList.length; i++){
        if ($scope.emailList[i].mailId == item.mailId) {
          break;
        }
      }
      if (i != 0) {
        var res = $scope.emailList[i-1];
      $state.go('app.details-mail',{'mailId':res.mailId,'folderId':res.folderId,'imageFrom':res.fromImageUrl,'fromImageId':res.fromImageId}); 
      }
      console.log('----------------END----------------');
    }

    $scope.onSwipeLeft = function(item){
      console.log('*******************************************************');
      console.log('----------------START----------------');
      console.log('slide left, item:',item);
      var i = 0;
      for(i; i < $scope.emailList.length; i++){
        if ($scope.emailList[i].mailId == item.mailId) {
          break;
        }
      }

      if (i < $scope.emailList.length-1) {
        var res = $scope.emailList[i+1];
        $state.go('app.details-mail',{'mailId':res.mailId,'folderId':res.folderId,'imageFrom':res.fromImageUrl,'fromImageId':res.fromImageId});   
      }
      else
      {
        if ($scope.emailList.length < $scope.pageInfo.listSize) {
          var folderId = $scope.emailList[0].folderId;
          var pageNumber = parseInt($scope.pageInfo.pageNumber) + 1;
          //  CALL SERVICES WITH (PAGE NUMBER AND FOLDER ID)
          $scope.newMails = Mail.query({'pageParam(pageNumber)':pageNumber,'folderId':folderId});

          // PROMISE
          $scope.newMails.$promise.then(function(results){
            // call factory 
            PopupFactory.getPopup($scope,results);

            console.log("results of request: ",results);
            var res = (results['mainData']['list'])[0];
            $scope.emailList = $scope.emailList.concat((results['mainData'])['list']);
            
            // RECOVER LIST MAIL FOR VIEW
            var dataForView = {'list': $scope.emailList,'pageInfo': results['mainData']['pageInfo']}
            serviceEmailData.saveData(dataForView);
            $state.go('app.details-mail',{'mailId':res.mailId,'folderId':res.folderId,'imageFrom':res.fromImageUrl,'fromImageId':res.fromImageId});
          });
        }
      }
      console.log('----------------END----------------');
    }

    // DOWNLOAD FILE
    $scope.download = function(attach) {
        $ionicLoading.show({
          template: '<i class="ion-loading-d"></i>'
        });
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
            fs.root.getDirectory(
                "bm App",
                {
                    create: true
                },
                function(dirEntry) {
                    console.log("==CONTROLLER WEBMAIL== download attach CREATE folder");
                    dirEntry.getFile(
                        attach.fileName, 
                        {
                            create: true, 
                            exclusive: false
                        }, 
                        function gotFileEntry(fe) {
                            console.log("==CONTROLLER WEBMAIL== download attach url");
                            var p = fe.toURL();
                            fe.remove();
                            ft = new FileTransfer();
                            ft.download(
                                encodeURI(apiUrlLocal+attach.downloadUrl),
                                p,
                                function(entry) {
                                    $ionicLoading.hide();
                                    $scope.imgFile = entry.toURL();

                                    var message = $filter('translate')('Downloaded');
                                    var messageCheck = $filter('translate')('CheckFolder');
                                    
                                    var alertPopup = $ionicPopup.alert({
                                      title: message,
                                      template: messageCheck
                                    });
                                },
                                function(error) {
                                    $ionicLoading.hide();
                                    alert("Download Error Source -> " + error.source);
                                },
                                false,
                                null
                            );
                        }, 
                        function() {
                            $ionicLoading.hide();
                            console.log("Get file failed");
                        }
                    );
                }
            );
        },
        function() {
            // $ionicLoading.hide();
            console.log("Request for filesystem failed");
        });
    }

    $scope.group = {name: "grupo1"};
    $scope.group2 = {name: "grupo2"};
    $scope.group3 = {name: "grupo3"};

    // ACORDEON HELP
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };

    // ACORDEON HELP
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };

    $scope.reply = function(){
      console.log('reply',$scope.item.mailId);
      $state.go('app.newmail',{'replyOperation':'REPLY','mailId':$scope.item.mailId});
    }

    $scope.replyAll = function(){
      console.log('replyAll',$scope.item.mailId);
      $state.go('app.newmail',{'replyOperation':'REPLYALL','mailId':$scope.item.mailId});
    }

    $scope.forward = function(){
      console.log('forward',$scope.item.mailId);
      $state.go('app.newmail',{'replyOperation':'FORWARD','mailId':$scope.item.mailId});
    }

});