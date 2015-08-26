angular.module('starter.constantsWebmail',[])  

// new mail
.constant('COMPOSE_EMAIL_URL','/bmapp/Mail/Reply/Send.do')

// // new mail
// .constant('COMPOSE_EMAIL_URL','/bmapp/Mail/ComposeEmail.do')

// forward new mail
.constant('FORWARD_CREATE_MAIL_URL','/bmapp/Mail/Forward/ComposeEmail.do')

// forward reply mail
.constant('FORWARD_REPLY_MAIL_URL','/bmapp/Mail/Reply.do')

//path webmail
.constant('PATH_WEBMAIL', '/bmapp/Webmail/REST.do')

//path webmail
.constant('PATH_WEBMAIL_READ_FOLDERS', '/bmapp/Mail/ReadFolders.do')

//	TYPE BODY
.constant('BODY_TYPE_HTML','1')

//	TYPE BODY
.constant('BODY_TYPE_TEXT','2')

//	FOLDER INBOX
.constant('FOLDER_INBOX_ID','inboxId')
.constant('FOLDER_INBOX_NAME','inboxName')
.constant('FOLDER_INBOX_TYPE','inbox')

//	FOLDER SENT
.constant('FOLDER_SENT_ID','sentId')
.constant('FOLDER_SENT_NAME','sendName')
.constant('FOLDER_SENT_TYPE','sent')

//	FOLDER DRAFT
.constant('FOLDER_DRAFT_ID','draftId')
.constant('FOLDER_DRAFT_NAME','draftName')
.constant('FOLDER_DRAFT_TYPE','draft')

//	FOLDER TRASH
.constant('FOLDER_TRASH_ID','trashId')
.constant('FOLDER_TRASH_NAME','trashName')
.constant('FOLDER_TRASH_TYPE','trash')

//	FOLDER OUTBOX
.constant('FOLDER_OUTBOX_ID','outboxId')
.constant('FOLDER_OUTBOX_NAME','outboxName')
.constant('FOLDER_OUTBOX_TYPE','outbox')

// DEFAULT TYPE OF CUSTOM FOLDER
.constant('FOLDER_DEFAULT_TYPE','default');
