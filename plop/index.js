const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

try {
  // `who-to-greet` input defined in action metadata file
  //const nameToGreet = core.getInput('who-to-greet');
  //console.log(`Hello ${nameToGreet}!`);
  //const time = (new Date()).toTimeString();
  //core.setOutput("time", time);


  console.log('Plop plop ')
  exec.exec('echo $PATH');
  exec.exec('echo $GITHUB_PATH');
  exec.exec('~/sfdx/bin/sf version')
  console.log('YOLOOOO')
  generateLogin();
  
  
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

function generateLogin() {
  exec.exec("sf org create scratch --target-dev-hub devhub --definition-file config/project-scratch-def.json --set-default --no-track-source --duration-days 1 --async --json", function (error, stdout, stderr) {
    if (error) console.log(stderr);
    exec.exec("sfdx force:user:display --json", function (error1, stdout1, stderr1) {
      const { result } = JSON.parse(stdout1);
      core.setOutput(
        "login-url",
        `${result.loginUrl}/?un=${result.username}&pw=${result.password}`
      );
    });
  });
}