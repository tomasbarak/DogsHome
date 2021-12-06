//Route to listen to github webhooks
const { dirname } =     require('path');
const appDir =          dirname(require.main.filename);
const { exec } =        require("child_process");
const logColor = require('../../config/logColors');

function listen(app){
    app.post('/webhooks/github/', function(req, res){
        if(req.headers['x-github-event'] == 'push'){

            console.log(logColor.warn, 'Trying to merge changes from github');

            exec(`cd ${appDir} && git reset --hard && git pull && npm i && sudo pm2 flush app && sudo pm2 restart app`, (error, stdout, stderr) => {
                if (!error) {
                    console.log(logColor.success, 'Successfully updated the app. Commit id: ' + req.body.head_commit.id);
                }else{
                    console.log(logColor.error, 'Error while updating the app. Commit id: ' + req.body.head_commit.id);
                    console.log(logColor.error, error);
                }
            })
        }
    })
}
module.exports = {listen};