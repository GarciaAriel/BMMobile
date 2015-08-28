angular.module('starter.webmailControllerNew', ['starter.webmailservices','starter.constantsWebmail'])

// NEW EMAIL 
.controller('NewMail',function(Mail,forward_reply_mail,$sce,BODY_TYPE_TEXT,BODY_TYPE_HTML,FORWARD_REPLY_MAIL_URL,$ionicPlatform,$fileFactory,$cordovaImagePicker,$state,PopupFactory,COMPOSE_EMAIL_URL,FORWARD_CREATE_MAIL_URL,apiUrlLocal,$http,$stateParams,$scope,COLOR_VIEW){
  console.log('*******************************************************');
  console.log('compose new email');
    
  // initial data
  $scope.data = {to: "", cc: "", bcc: "",mailSubject: "",body: "",body2: "",bodyType:"0"};
  $scope.colorFont = COLOR_VIEW;
  $scope.iframeWidth = $(window).width()*0.17;

  // param "to" show in the view  (only in contact telecomunication)
  if ($stateParams.to) {
    $scope.data.to = $stateParams.to;
  }

  if ($stateParams.replyOperation == undefined && $scope.typeFolder == undefined) {
    var request = $http({
      method: "get",    
      url: apiUrlLocal+FORWARD_CREATE_MAIL_URL
    });
    request.success(
      function(data, status, headers, config) {          
        
        // call factory to validate the response
        PopupFactory.getPopup($scope,data);
        
        console.log("results of request: ",data);

        var aMailAccountArray = data.mainData.mailAccountArray;
        $scope.mailAccountArray = [];
        aMailAccountArray.forEach(function(aMail) {
          $scope.mailAccountArray.push({
            name: aMail.email,
            value: aMail.mailAccountId
          });       
          if( aMail.isDefaultAccount == 'true') {
            $scope.mailAccount = $scope.mailAccountArray[$scope.mailAccountArray.length-1];  
          }
        });
      }
    );  
  }

  // draft items send mail
  $scope.typeFolder = $stateParams.folderName;
  if ($scope.typeFolder != undefined && $scope.typeFolder == "DraftItems") {
    console.log('aaq mailid',$stateParams.mailId);
    console.log('aaq folderId',$stateParams.folderId);

    //  CALL SERVICES WITH (PAGE NUMBER AND FOLDER ID)
    $scope.detail = Mail.query({'dto(mailId)': $stateParams.mailId,'folderId': $stateParams.folderId});
    
    // PROMISE
    $scope.detail.$promise.then(function (results){

      // call factory 
      PopupFactory.getPopup($scope,results);

      console.log("aaq query detail success OK data: ",results);
      $scope.data = (results['mainData'])['entity'];

      // aaaaaaaaaaaaaaaaa
      // $scope.data.to var mailAccount = $scope.mailAccount != undefined ? $scope.mailAccount.value : "";
      // $scope.data = {to: "", cc: "", bcc: "",mailSubject: "",body: "",body2: "",bodyType:"0"};

      var aMailAccountArray = results['mainData']['mailAccountArray'];// data.mainData.mailAccountArray;
      $scope.mailAccountArray = [];
      aMailAccountArray.forEach(function(aMail) {
        $scope.mailAccountArray.push({
          name: aMail.email,
          value: aMail.mailAccountId
        });       
        if( aMail.mailAccountId == $scope.data.mailAccountId) {
          $scope.mailAccount = $scope.mailAccountArray[$scope.mailAccountArray.length-1];  
        }
      });

      // CALL HTML BODY
      if (results['mainData']['entity']['bodyType'] == BODY_TYPE_HTML) {
          
          var newurl = results['mainData']['entity']['htmlBodyUrl'];
          $scope.uuuurrrl = results['mainData']['entity']['htmlBodyUrl'];
          $http.get(apiUrlLocal+newurl).

          success(function(data, status, headers, config) {

            // call factory 
            PopupFactory.getPopup($scope,data);
            console.log("aaq results of request: ",data);

            var newHtml = data.split("<img").join(" <img class='img-class' ");

            newHtml = newHtml.split('"/bm/').join('"'+apiUrlLocal+"/");

            var regex = /href="([\S]+)"/g;
            newHtml = newHtml.replace(regex, "onClick=\"window.open('$1', '_system', 'location=yes')\"");

            console.log("aaq final html: ",newHtml);
            $scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml(newHtml);
            
          }).
          error(function(data, status, headers, config) {
          });
      }
      else{
        // var message = $scope.item.body;
        // console.log("---====== 123444body type text:",message);
        // $scope.bodyTypeText = $sce.trustAsHtml(message);
        //
        console.log('---inicio body',$scope.data.body);
        $scope.data.body2 = $scope.data.body;

        angular.element(document).ready(function () {
          console.log('aaq page loading completed');
          var element = document.getElementById("page_content2");
          element.style.height = element.scrollHeight + "px";
        });
      }
        
      
    });
  }
  
  // only for reply mail
  var boolBodyReply = false;

  // query to get list of emails only in new mail
  
  
  
  if ($stateParams.mailId && $stateParams.replyOperation) {
    boolBodyReply = true;

    
    //  CALL SERVICES WITH (mailid and replyOperation)
    $scope.detail = forward_reply_mail.query({'dto(mailId)': $stateParams.mailId,'replyOperation':$stateParams.replyOperation});
    
    // PROMISE
    $scope.detail.$promise.then(function (data){

      // call factory to validate the response
      PopupFactory.getPopup($scope,data);
      console.log("results of request reply: ",data);
      
      $scope.data = data.mainData.entity;
      // $scope.data.body2 = "";

      var aMailAccountArray = data.mainData.mailAccountArray;
      $scope.mailAccountArray = [];
      aMailAccountArray.forEach(function(aMail) {
        $scope.mailAccountArray.push({
          name: aMail.email,
          value: aMail.mailAccountId
        });       
        if( aMail.mailAccountId == $scope.data.mailAccountId) {
          $scope.mailAccount = $scope.mailAccountArray[$scope.mailAccountArray.length-1];  
        }
      });

      // CALL HTML BODY
        if (data.mainData.entity.bodyType == BODY_TYPE_HTML) {
            
            var newurl = data.mainData.entity.htmlBodyUrl;
            $http.get(apiUrlLocal+newurl).

            success(function(data, status, headers, config) {

              // call factory 
              PopupFactory.getPopup($scope,data);
              console.log("results of request: ",data);

              //
              var newHtml = data.split("<img").join(" <img class='img-class' ");

              newHtml = newHtml.split('"/bm/').join('"'+apiUrlLocal+"/");

              var regex = /href="([\S]+)"/g;

              newHtml = newHtml.replace(regex, "onClick=\"window.open('$1', '_system', 'location=yes')\"");

              $scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml(newHtml);
              
            }).
            error(function(data, status, headers, config) {
              // or server returns response with an error status.
            });
        }
        else{
          if ($scope.typeFolder == 'DraftItems') {
            $scope.data.body2 = $scope.data.body;
            $scope.data.body = "";
            angular.element(document).ready(function () {
              console.log('page loading completed');
              var element = document.getElementById("page_content2");
              element.style.height = element.scrollHeight + "px";
            });  
          }
          else{
            var message = $scope.data.body;
            console.log("body type text:",message);
            $scope.bodyTypeText = $sce.trustAsHtml(message);
            $scope.data.body = "";  
          }
          
        }

    });
  }

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

  // prueba image picker
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

  // help function to update email
  $scope.updateEmail = function(nEmail){
    $scope.mailAccount = nEmail;
  };

  // to save cc and bcc acordion
  $scope.mySwitch = false;
  $scope.seeCc = function(){
    $scope.mySwitch = !$scope.mySwitch;
  }


  $scope.sendMail = function() {
    console.log('*******************************************************');
    console.log('data to send new email: ', $scope.data);
    console.log('mail user: ', $scope.mailAccount);

    var fd = new FormData();    
    fd.append('dto(mailId)',$scope.data.mailId);
    fd.append( 'save', 'save');
    fd.append( 'dto(to)', $scope.data.to);
    fd.append( 'dto(mailSubject)', $scope.data.mailSubject);

    console.log('------body',$scope.data.body);
    console.log('------body2',$scope.data.body2);
    if ($scope.data.body != undefined && $scope.data.body2 != undefined) {
      fd.append( 'dto(body)', $scope.data.body+$scope.data.body2);  
    }
    else{
      if ($scope.data.body2 != undefined) {
        fd.append( 'dto(body)', $scope.data.body2);           
      }
      else{
        fd.append( 'dto(body)', $scope.data.body);
      }
    }
    
    

    var mailAccount = $scope.mailAccount != undefined ? $scope.mailAccount.value : "";
    fd.append( 'dto(mailAccountId)', mailAccount);

    // only for reply mail
    if (boolBodyReply) {
      fd.append( 'dto(mailState)', $scope.data.mailState);
      fd.append( 'dto(replyMode)', $stateParams.replyOperation);
    
      var bodyType = $scope.data.bodyType == BODY_TYPE_HTML ?  BODY_TYPE_HTML: BODY_TYPE_TEXT;
      fd.append('dto(bodyType)', bodyType);
    }

    if($scope.imgURI != undefined){
      fd.append('dto(attachmentCounter)',1);
      fd.append('dto(file1)',dataURItoBlob($scope.imgURI));
    }

    if ($scope.mySwitch) {
      fd.append( 'dto(cc)', $scope.data.cc);
      fd.append( 'dto(bcc)', $scope.data.bcc);
    }
    else{
      fd.append( 'dto(cc)', "");
      fd.append( 'dto(bcc)', ""); 
    }
      
    $.ajax({
      url: apiUrlLocal+COMPOSE_EMAIL_URL,
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data){

        // call factory to validate the response
        PopupFactory.getPopup($scope,data);

        var result = JSON.parse(data);
        if(result.forward == "Success")
        {
          console.log("Email sent succesfull");          
          $state.go('app.mailboxes'); 
        }
        else
        {        
          PopupFactory.getPopup($scope,result);
        }             
      }
    });
  }

  $scope.attachFile = function(){
    
  }

});