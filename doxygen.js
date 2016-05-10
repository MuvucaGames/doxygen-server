const fs = require('fs');
const path = require('path');
const doxygenBinPath = path.join(process.cwd(), 'doxygen/bin/doxygen');

const spawn = require('child_process').spawn;


module.exports = function(callback){
    console.log("doxing");
    fs.chmodSync(doxygenBinPath, 0777);
    const doxy = spawn(doxygenBinPath);

    doxy.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    doxy.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    doxy.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      callback();
    });
}
