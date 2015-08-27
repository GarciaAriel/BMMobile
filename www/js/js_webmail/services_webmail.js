angular.module('starter.webmailservices', [])

/**
 * SERVICES LIST MAILS IN WEBMAIL
 */
.factory('Mail', function ($resource,apiUrlLocal,PATH_WEBMAIL) {
  
  var url = apiUrlLocal+PATH_WEBMAIL;
  console.log('==SERVICE WEBMAIL== URL',url);
  return $resource(url,{},{'query':{method:'GET', isArray:false}});
})

.factory('Webmal_read_forlders', function ($resource,apiUrlLocal,PATH_WEBMAIL_READ_FOLDERS) {
  
  var url = apiUrlLocal+PATH_WEBMAIL_READ_FOLDERS;
  console.log('==SERVICE WEBMAIL== read forlders',url);
  return $resource(url,{},{'query':{method:'GET', isArray:false}});
})

.factory('forward_reply_mail', function ($resource,apiUrlLocal,FORWARD_REPLY_MAIL_URL) {
  
  var url = apiUrlLocal+FORWARD_REPLY_MAIL_URL;
  console.log('==SERVICE WEBMAIL== forward reply mail',url);
  return $resource(url,{},{'query':{method:'GET', isArray:false}});
})

.factory("$fileFactory", function($q) {

    var File = function() { };

    File.prototype = {

        getParentDirectory: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                fileSystem.getParent(function(result) {
                    deferred.resolve(result);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntriesAtRoot: function() {
            var deferred = $q.defer();
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                var directoryReader = fileSystem.root.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        },

        getEntries: function(path) {
            var deferred = $q.defer();
            window.resolveLocalFileSystemURI(path, function(fileSystem) {
                var directoryReader = fileSystem.createReader();
                directoryReader.readEntries(function(entries) {
                    deferred.resolve(entries);
                }, function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    };

    return File;

})

.service('serviceExecute', function(FOLDER_INBOX_TYPE,FOLDER_SENT_TYPE,FOLDER_DRAFT_TYPE,FOLDER_TRASH_TYPE,FOLDER_OUTBOX_TYPE) {

  var reply = function(typeFolder) {
    var result = true;
    switch (typeFolder) {
      case FOLDER_INBOX_TYPE:
        result = true;
        break;
      case FOLDER_SENT_TYPE:
        result = false;
        break;
      case FOLDER_DRAFT_TYPE:
        result = true; // aaaa
        break;
      case FOLDER_TRASH_TYPE:
        result = true;
        break;
      case FOLDER_OUTBOX_TYPE:
        result = false;
        break;
    }     
    return result;
  };
  var replyAll = function(typeFolder){
    var result = true;
    switch (typeFolder) {
      case FOLDER_INBOX_TYPE:
        result = true;
        break;
      case FOLDER_SENT_TYPE:
        result = false;
        break;
      case FOLDER_DRAFT_TYPE:
        result = false;
        break;
      case FOLDER_TRASH_TYPE:
        result = true;
        break;
      case FOLDER_OUTBOX_TYPE:
        result = false;
        break;
    }     
    return result;
  };
  var forward = function(typeFolder){
      var result = true;
    switch (typeFolder) {
      case FOLDER_INBOX_TYPE:
        result = true;
        break;
      case FOLDER_SENT_TYPE:
        result = true;
        break;
      case FOLDER_DRAFT_TYPE:
        result = false;
        break;
      case FOLDER_TRASH_TYPE:
        result = true;
        break;
      case FOLDER_OUTBOX_TYPE:
        result = true;
        break;
    }     
    return result;
  };
  return {
    reply: reply,
    replyAll: replyAll,
    forward: forward
  };
})

.service('serviceEmailData', function() {
  var data = {};
  var saveData = function(newData) {
      data = newData;
  };
  var getData = function(){
      return data;
  };
  return {
    saveData: saveData,
    getData: getData
  };
});