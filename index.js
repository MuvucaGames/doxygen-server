const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
var express = require('express');
var clone = require('git-clone');
var bodyParser = require('body-parser');
var app = express();
var doxygen = require('./doxygen');
var serveIndex = require('serve-index')
const spawn = require('child_process').spawn;
const spawn = require('child_process').exec;

var temp_dir = path.join(process.cwd(), 'temp/');


var createSsh = require('create-ssh');
createSsh();

app.set('port', (process.env.PORT || 5000));


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/postpush', function(req, res) {
    console.log("Recieved PUSH");
    console.log("Deleting old folder");
    rimraf(temp_dir, function(){
        console.log("Recreating folder");
        if (!fs.existsSync(temp_dir))
            fs.mkdirSync(temp_dir);
        console.log("Cloning repo");
        clone("https://github.com/MuvucaGames/MuvucaGame01.git", temp_dir, function(err){

            if(err){
                console.log(err);
                return;
            }
            console.log("Clone sucessful");

            doxygen(function(){
                console.log("DOCS created");
            });
        })
    })

    res.send('ok');
});


app.get('/', function(request, response) {
  response.send("Server funcionando");
});

app.use('/static', serveIndex(__dirname, {'icons': true}))

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
