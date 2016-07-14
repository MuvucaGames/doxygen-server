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
const execSync = require('child_process').execSync;
var ghpages = require('gh-pages');
var ncp = require('ncp').ncp;
ncp.limit = 16;

var game_dir = path.join(process.cwd(), 'MuvucaGame01/');
var docs_html_dir = path.join(process.cwd(), 'docs/html/');
var site_dir = path.join(process.cwd(), 'site/');
var site_docs_dir = path.join(site_dir, 'taleoftwohearts/docs/');
const pretext= "--------";

app.set('port', (process.env.PORT || 5000));


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/postpush', function(req, res) {
    console.log(pretext, "Recieved PUSH");
    console.log(pretext, "Deleting game folder");
    rimraf(game_dir, function(){
        console.log(pretext, "Deleting site folder");
        rimraf(site_dir, function(){
            console.log(pretext, "Recreating folders");
            if (!fs.existsSync(game_dir))
                fs.mkdirSync(game_dir);
            if (!fs.existsSync(site_dir)){
                fs.mkdirSync(site_dir);
            }
            console.log(pretext, "Cloning repos");
            clone("https://github.com/MuvucaGames/MuvucaGame01.git", game_dir, function(err){
                if(err)
                    return console.error(err);
                console.log(pretext, "Clone game sucessful");
                clone("https://github.com/MuvucaGames/muvucagames.github.io.git", site_dir, function(err){
                    console.log(pretext, "Clone site sucessful");
                    if(err)
                        return console.error(err);
                    cleanDirs(function(){
                        doxygen(function(){
                            console.log(pretext, "Doxy Created--------------------");

                            rimraf(site_docs_dir, function(){
                                if (!fs.existsSync(site_docs_dir))
                                    fs.mkdirSync(site_docs_dir);
                                setTimeout(function() {
                                    ncp(docs_html_dir, site_docs_dir, function (err) {
                                        if (err)
                                            return console.error(err);
                                        console.log(pretext, 'copied docs to site dir');
                                        setTimeout(function(){
                                            uploadsite();
                                        }, 2000);
                                    });
                                }, 2000);
                            });
                        });
                    });
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


function uploadsite(){
    console.log(pretext, "uploading sequence");
    var repox = 'https://' + process.env.githubtoken + '@github.com/MuvucaGames/muvucagames.github.io.git';
    //execSync('sh setupgit.sh', [site_dir, repox, 'master']);
    execSync('sh setupgit.sh');
    console.log(pretext, "publishing");
    ghpages.publish(site_dir, {
        branch: 'master',
        repo: repox,
        dotfiles: true
    }, function(e){
        console.log(pretext, "DONE", e);
    });

}

function cleanDirs(cb){
    rimraf(path.join(site_dir, ".git"), function(err){
        rimraf(docs_html_dir, function(err){
            if(err) return console.error(err);
            else
                cb();
        }
    }
}
