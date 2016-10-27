/**
 * Created by Sherif on 10/26/2016.
 */
// const path = require('path');
// const express = require('express');
//
// module.exports = {
//     app: function () {
//         const app = express();
//         const indexPath = path.join(__dirname, '/../map.html');
//         const publicPath = express.static(path.join(__dirname, '/public'));
//
//         app.use('/public', publicPath);
//         app.get('/', function (_, res) { res.sendFile(indexPath) });
//
//         return app
//     }
// };

var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello World');
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);

});