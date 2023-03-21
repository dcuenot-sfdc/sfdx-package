const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

async function main() {
  try {
    // `who-to-greet` input defined in action metadata file
    //const nameToGreet = core.getInput('who-to-greet');
    //console.log(`Hello ${nameToGreet}!`);
    //const time = (new Date()).toTimeString();
    //core.setOutput("time", time);


    console.log('Plop plop ');
    const [{stdout: a}, {stdout: b}, {stdout: c}] = await Promise.all([
      exec.getExecOutput('env'),
      exec.getExecOutput('pwd'),
      exec.getExecOutput('sf version')
    ])
    console.log(a);
    console.log(b);
    console.log(c);
    console.log('YOLOOOO');
    generateLogin();
    
    
    // Get the JSON webhook payload for the event that triggered the workflow
    //const payload = JSON.stringify(github.context.payload, undefined, 2)
    //console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
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

main()