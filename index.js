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
const exec = require('child_process').exec;

const siteGit = 'git@github.com:MuvucaGames/muvucagames.github.io.git'
var game_dir = path.join(process.cwd(), 'MuvucaGame01/');
var site_dir = path.join(process.cwd(), 'site/');

app.set('port', (process.env.PORT || 5000));


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/postpush', function(req, res) {
    console.log("Recieved PUSH");
    console.log("Deleting old folder");
    rimraf(game_dir, function(){
        console.log("Recreating folder");
        if (!fs.existsSync(game_dir))
            fs.mkdirSync(game_dir);
        console.log("Cloning repo");
        clone("https://github.com/MuvucaGames/MuvucaGame01.git", game_dir, function(err){
            if(err){
                console.error(err);
                return;
            }
            console.log("Clone game sucessful");
            clone("https://github.com/MuvucaGames/muvucagames.github.io.git", site_dir, function(err){
                console.log("Clone site sucessful");
                if(err){
                    console.error(err);
                    return;
                }
                doxygen(function(){
                    console.log("----------Doxy Created--------------------");
                });
            });
        });
    });

    res.send('ok');
});


app.get('/', function(request, response) {
  response.send("Server funcionando");
});

app.use('/static', serveIndex(__dirname, {'icons': true}))

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
