angular.module('starter.webmailControllerFolders', ['starter.webmailservices','starter.constantsWebmail'])

/**
 * CONTROLLER FOLDERS
 */
.controller('MailsCtrl', function(PopupFactory,$state,$scope,Webmal_read_forlders,
  PATH_WEBMAIL_READ_FOLDERS,FOLDER_INBOX_ID,FOLDER_INBOX_NAME,FOLDER_SENT_ID,FOLDER_SENT_NAME,
  FOLDER_DRAFT_ID,FOLDER_DRAFT_NAME,FOLDER_TRASH_ID,FOLDER_TRASH_NAME,FOLDER_OUTBOX_ID,
  FOLDER_OUTBOX_NAME,FOLDER_INBOX_TYPE,FOLDER_SENT_TYPE,FOLDER_DRAFT_TYPE,FOLDER_TRASH_TYPE,
  FOLDER_OUTBOX_TYPE,FOLDER_DEFAULT_TYPE,COLOR_VIEW) {

  console.log('*******************************************************');
  console.log("==CONTROLLER WEBMAIL== get query list FOLDERS");

  // COLOR DEFAULT
  $scope.colorFont = COLOR_VIEW;
  $scope.folders = [];
  
  // EXECUTE QUERY WITH ()
  $scope.newFolders = Webmal_read_forlders.query();
  
  // PROMISE
  $scope.newFolders.$promise.then(function (results){

    // call factory 
    PopupFactory.getPopup($scope,results);

    console.log("results of request: ",results);

    var data = ((results['mainData'])['systemFolders']);

    // CONVERT DATA OF FOLDERS DEFAULT IN OBJECT
    var object_folder_inbox = {folderId: data[FOLDER_INBOX_ID],folderName:'Inbox',type:FOLDER_INBOX_TYPE};
    var object_folder_sent = {folderId: data[FOLDER_SENT_ID],folderName:'SentItems',type:FOLDER_SENT_TYPE};
    var object_folder_draft = {folderId: data[FOLDER_DRAFT_ID],folderName:'DraftItems',type:FOLDER_DRAFT_TYPE};
    var object_folder_trash = {folderId: data[FOLDER_TRASH_ID],folderName:'Trash',type:FOLDER_TRASH_TYPE};
    var object_folder_outbox = {folderId: data[FOLDER_OUTBOX_ID],folderName:'Outbox',type:FOLDER_OUTBOX_TYPE};
    
    //  PUSH OBJECT
    $scope.folders.push(object_folder_inbox);
    $scope.folders.push(object_folder_sent);
    $scope.folders.push(object_folder_draft);
    $scope.folders.push(object_folder_trash);
    $scope.folders.push(object_folder_outbox);

    //  PUSH CUSTOM FOLDERS
    var custom_folders = ((results['mainData'])['customFolderArray']);    
    custom_folders.forEach(function(folder) {
      var custom_folder = folder;
      custom_folder["type"] = FOLDER_DEFAULT_TYPE;
      $scope.folders.push(custom_folder);
    });

  });

  $scope.doRefresh = function() {
    console.log('*******************************************************');
    console.log("do refresh FOLDERS");
    $scope.folders = [];
    
    // EXECUTE QUERY WITH ()
    $scope.newFolders = Webmal_read_forlders.query();

    // PROMISE
    $scope.newFolders.$promise.then(function (results){

      // call factory to validate the response
      PopupFactory.getPopup($scope,results);

      console.log("results of request: ",results);
      var data = ((results['mainData'])['systemFolders']);

      // CONVERT DATA OF FOLDERS DEFAULT IN OBJECT
      var object_folder_inbox = {folderId: data[FOLDER_INBOX_ID],folderName:data[FOLDER_INBOX_NAME],type:FOLDER_INBOX_TYPE};
      var object_folder_sent = {folderId: data[FOLDER_SENT_ID],folderName:data[FOLDER_SENT_NAME],type:FOLDER_SENT_TYPE};
      var object_folder_draft = {folderId: data[FOLDER_DRAFT_ID],folderName:data[FOLDER_DRAFT_NAME],type:FOLDER_DRAFT_TYPE};
      var object_folder_trash = {folderId: data[FOLDER_TRASH_ID],folderName:data[FOLDER_TRASH_NAME],type:FOLDER_TRASH_TYPE};
      var object_folder_outbox = {folderId: data[FOLDER_OUTBOX_ID],folderName:data[FOLDER_OUTBOX_NAME],type:FOLDER_OUTBOX_TYPE};
      
      //  PUSH OBJECT
      $scope.folders.push(object_folder_inbox);
      $scope.folders.push(object_folder_sent);
      $scope.folders.push(object_folder_draft);
      $scope.folders.push(object_folder_trash);
      $scope.folders.push(object_folder_outbox);

      //  PUSH CUSTOM FOLDERS
      var custom_folders = ((results['mainData'])['customFolderArray']);    
      custom_folders.forEach(function(folder) {
        var custom_folder = folder;
        custom_folder["type"] = FOLDER_DEFAULT_TYPE;
        $scope.folders.push(custom_folder);
      });

      $scope.$broadcast('scroll.refreshComplete');  

    });
    
  }

  //  RETURN CLASS ICON OF FOLDER
  $scope.getClassImage = function(item){
    var response;
    var value = item.type;

    switch (value) {
        case FOLDER_INBOX_TYPE:
            response = "icon ion-filing";
            break;
        case FOLDER_SENT_TYPE:
            response = "icon ion-paper-airplane";;
            break;
        case FOLDER_DRAFT_TYPE:
            response = "icon ion-briefcase";;
            break;    
        case FOLDER_TRASH_TYPE:
            response = "icon ion-trash-b";;
            break;    
        case FOLDER_OUTBOX_TYPE:
            response = "icon ion-ios7-box";;
            break;            
        default:
            response = "icon ion-folder"
    }
    return response;
  }
});
