var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var path = require('path');
var http = require('http');

var app = express();
var server = http.createServer(app);
var ws = require('./src/ws')(server);



app.use(bodyParser());

var staticPath = path.join(__dirname, '..', '..', '..', 'static');
var viewsPath = path.join(__dirname, 'views');

console.log('Staticpath', staticPath);
console.log('Port', process.env.WEBSERVER_PORT);

app.use('/static', serveStatic(staticPath));
app.set('views', viewsPath);
app.set('view engine', 'jade');

app.get('/', function (req, res) {
    res.render('app.jade');
});

server.listen(process.env.WEBSERVER_PORT);
