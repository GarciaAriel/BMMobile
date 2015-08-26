#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var foldersToProcess = [
"jquery/build"

];

var foldersToDelete = [
"bootstrap/docs",
"uderscore/test",
"moment/scripts",
"jquery/src",
"jquery/test",
"jquery/speed",
"moment/benchmarks",

];

var filesToDelete = [
"release.js",
"release-notes.js"
];

var iosPlatformsDir = "platforms/ios/www/lib/";
var androidPlatformsDir = "platforms/android/assets/www/lib/";

filesToDelete.forEach(function(file) {
    var filePathIOS = iosPlatformsDir + file;
    var filePathAndroid = androidPlatformsDir + file;
    if(fs.existsSync(filePathIOS)){
        fs.unlinkSync(filePathIOS);
    };
    if(fs.existsSync(filePathAndroid)){
        fs.unlinkSync(filePathAndroid);
    };
});

foldersToProcess.forEach(function(folder) {
    processFiles(iosPlatformsDir + folder);
    processFiles(androidPlatformsDir + folder);
});

foldersToDelete.forEach(function(folder) {
    deleteFolderRecursive(iosPlatformsDir + folder);
    deleteFolderRecursive(androidPlatformsDir + folder);
});

function deleteFolderRecursive(path){
    if( fs.existsSync(path) ) {
       fs.readdirSync(path).forEach(function(file,index){
           var curPath = path + "/" + file;
             if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
             } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
       fs.rmdirSync(path);
   }
}

function processFiles(dir) {
    fs.readdir(dir, function(err, list) {
        if(err) {
            console.log('processFiles err: ' + err);
            return;
        }
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if(!stat.isDirectory()) {
                    switch(path.basename(file)) {
                        case ".DS_Store":
                        fs.unlink(file, function(error) {
                            console.log("Removed file " + file);
                        });
                        break;
                        case "Thumbs.db":
                        fs.unlink(file, function(error) {
                            console.log("Removed file " + file);
                        });
                        break;
                        default:
                        console.log("Skipping file " + file);
                        break;
                    }
                }
            });
        });
    });
}
