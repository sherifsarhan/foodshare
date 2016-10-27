/**
 * Created by Sherif on 10/26/2016.
 */
var firebase = require("firebase");
var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var app = express();
// var gcloud = require('google-cloud');
var multer = require("multer");
var uploader = multer({ storage: multer.memoryStorage});
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

firebase.initializeApp({
    serviceAccount:"privkey.json",
    databaseURL: "https://foodshare-1474316972332.firebaseio.com/"
});

/**
 * Google cloud storage part
 */
// var CLOUD_BUCKET="foodshare-1474316972332.appspot.com"; //From storage console, list of buckets
// var gcs = gcloud.storage({
//     projectID: "151948214475",
//     keyFilename: 'privkey.json'
// });
//
// function getPublicUrl (filename) {
//     return 'https://storage.googleapis.com/' + CLOUD_BUCKET + '/' + filename;
// }
//
// var bucket = gcs.bucket(CLOUD_BUCKET);
// //From https://cloud.google.com/nodejs/getting-started/using-cloud-storage
// function sendUploadToGCS (req, res, next) {
//     if (!req.file) {
//         return next();
//     }
//
//     var gcsname = Date.now() + req.file.originalname;
//     var file = bucket.file(gcsname);
//
//
//     var stream = file.createWriteStream({
//         metadata: {
//             contentType: req.file.mimetype
//         }
//     });
//
//     stream.on('error', function (err) {
//         req.file.cloudStorageError = err;
//         next(err);
//     });
//
//     stream.on('finish', function () {
//         req.file.cloudStorageObject = gcsname;
//         req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
//         var options = {
//             entity: 'allUsers',
//             role: gcs.acl.READER_ROLE
//         };
//         file.acl.add(options, function(a,e){next();});//Make file world-readable; this is async so need to wait to return OK until its done
//     });
//
//     stream.end(req.file.buffer);
// }

app.post('/uploadPic', function (req, res) {
    console.log("Uploading pic to express");
    var foodPic = req.body.data;
    foodPic.mv('/foodpics/testpic.jpg', function (err) {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.send('File uploaded!');
        }
    });
});

var fireRef = firebase.database().ref('foodshare');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile('public/map.html', {root: __dirname});
});

//Add a new foodshare
app.post('/foodAdd', function (req,res) {
    console.log("Adding food");
    fireRef.push({
        food: req.body.food,
        lat : parseFloat(req.body.lat),
        lng : parseFloat(req.body.lng),
        uid : req.body.uid,
        tag : req.body.tag
    });
    res.send("OK!");
});

// //Upload a food picture
// app.post('/uploadPic', uploader.single("img"), sendUploadToGCS, function(req, res, next) {
//     var data = {"text" : req.body.todoText};
//     if(req.file)
//         data.img = getPublicUrl(req.file.cloudStorageObject);
//     fireRef.push(data, function () {
//         res.send("OK!");
//     }).catch(function(){
//         res.status(403);
//         res.send();
//     });
// });

//Edit a foodshare
app.put('/foodEdit', function (req,res) {
    console.log("Editing food: " + req.body.key);
    //updates the foodshare's name in the database but doesn't update the infowindow yet until the page refreshes
    fireRef.child(req.body.key).set({
        'food': req.body.food,
        'lat' : parseFloat(req.body.lat),
        'lng' : parseFloat(req.body.lng),
        'uid' : req.body.uid
        });
    res.send("OK!");
});

//delete a foodshare
app.delete('/foodDelete', function (req, res) {
    console.log("Removing food: "+ req.body.key);
    fireRef.child(req.body.key).remove();
    res.send("OK!");
});

var server_port = process.env.PORT || 5000;
console.log(server_port);
var server = app.listen(server_port);

