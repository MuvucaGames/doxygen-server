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
    console.log(pretext, "Deleting old folder");
    rimraf(game_dir, function(){
        console.log(pretext, "Recreating folder");
        if (!fs.existsSync(game_dir))
            fs.mkdirSync(game_dir);
        console.log(pretext, "Cloning repo");
        clone("https://github.com/MuvucaGames/MuvucaGame01.git", game_dir, function(err){
            if(err){
                return console.error(err);
            }
            console.log(pretext, "Clone game sucessful");
            clone("https://github.com/MuvucaGames/muvucagames.github.io.git", site_dir, function(err){
                console.log(pretext, "Clone site sucessful");
                if(err){
                    return console.error(err);
                }
                rimraf(docs_html_dir, function(){
                    doxygen(function(){
                        console.log(pretext, "Doxy Created--------------------");
                        rimraf(site_docs_dir, function(){
                            if (!fs.existsSync(site_docs_dir))
                                fs.mkdirSync(site_docs_dir);
                            ncp(docs_html_dir, site_docs_dir, function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                                console.log(pretext, 'copied docs to site dir');


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
    const GithubPages = require('github-pages');
    const parseConfig = require('github-pages').parseConfig;
    const config = parseConfig({
        repo: 'MuvucaGames/muvucagames.github.io',
        token: process.env.githubtoken,
        remoteRef: 'heads/master',
        commitMessage: 'DOCS created by server',
        commitAuthor: 'muvucasever <muvucasever@muvucaagames.com.br>',
        apiVersion: '3.0.0',
        apiProtocol: 'https',
        apiHost: 'api.github.com',
        apiPath: '',
        apiTimeout: 5000
    }, site_dir);

    const pages = new GithubPages(config);
    pages.publish().then((res)=> {
        console.log(pretext,'published');
        console.log(JSON.stringify(res, null, 2));
    }).catch((err)=> {
        console.error('error while publishing');
        console.error(JSON.stringify(err, null, 2));
    });
}
