const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
var getDirName = require('path').dirname;
var mkdirp = require('mkdirp');

const privateSsh = path.join(process.cwd(), "/.ssh/githubssh");
const publicSsh = path.join(process.cwd(), "/.ssh/githubssh.pub");

module.exports = function(){
    mkdirp.sync(getDirName(publicSsh));
    if(!process.env.privategithubssh || !process.env.publicgithubssh){
        console.error("privategithubssh or publicgithubssh NOT defined in config vars");
        return;
    }
    fs.writeFileSync(privateSsh, process.env.privategithubssh);
    fs.writeFileSync(publicSsh, process.env.publicgithubssh);

    /*
    var addSshKey = spawn('sh', ['setupssh.sh', privateSsh]);

    //var addSshKey = spawn('eval "$(ssh-agent -s)" && ssh-add '+privateSsh);

    addSshKey.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    addSshKey.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    addSshKey.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
    */
}
