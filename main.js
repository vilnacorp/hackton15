/**
 * Created by danny on 30/04/15.
 */

var express = require('express');
var app = express();

var backend = require('./backend/main');


app.use("/backend", backend.backend);

app.use(express.static(__dirname + '/public'));


app.listen(8080);