const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

async function run() {
  try {
    let githubToken = core.getInput('github-token');
    let octokit = new github.GitHub(githubToken);

    let owner = 'HeroicEric';
    let repo = 'backport-action';

    console.log(JSON.stringify(github.context, undefined, 2));

    let pr = github.context.payload.pull_request;

    // await exec.exec('git', ['log']);

    // git remote set-url origin https://x-access-token:$GITHUB_TOKEN@github.com/$GITHUB_REPOSITORY.git
    // git config --global user.email "action@github.com"
    // git config --global user.name "GitHub Action"
    // let origin = `https://github.com/HeroicEric/backport-action.git`;

    await exec.exec('git', ['config', '--global', 'user.email', '"action@github.com"']);
    await exec.exec('git', ['config', '--global', 'user.name', '"GitHub Action"']);
    // await exec.exec('git', ['checkout', '-b', 'foo']);

    await exec.exec('git', ['checkout', '-b', 'foo']);
    await exec.exec(`git -c http.extraheader="AUTHORIZATION: basic ${githubToken}" push origin foo`);

    let refs = await octokit.git.listRefs({
      owner,
      repo
    });

    console.log(JSON.stringify(refs, undefined, 2));

    let targetMeBranch = await octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/targetme'
    });

    console.log(JSON.stringify(targetMeBranch, undefined, 2));

    // await octokit.pulls.create({
    //   owner,
    //   repo,
    //   title: 'WoWoWoWoWoW',
    //   head: pr.head.ref,
    //   base: 'targetme'
    // });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

// try {
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
// } catch (error) {
//   core.setFailed(error.message);
// }
