const { spawn } = require('child_process')
const core = require('@actions/core')
const fs = require('fs')

async function runCommand(command) {
  return new Promise(resolve => {
    const childProcess = spawn(command, { shell: true })

    childProcess.stdout.on('data', data => {
      core.debug(`stdout: ${data}`)
    })

    childProcess.stderr.on('data', data => {
      core.debug(`stderr: ${data}`)
    })

    childProcess.on('close', code => {
      core.debug(`child process exited with code: ${code}, command: ${command}`)
      resolve()
    })
  })
}

function getDbtArgs(dbtProfile, dbtVars, dbtTarget) {
  let dbtArgs = ''
  if (dbtVars) {
    dbtArgs += `--vars '${dbtVars}'`
  }
  if (dbtProfile) {
    dbtArgs += `--profile '${dbtProfile}'`
  }
  if (dbtTarget) {
    dbtArgs += `--target '${dbtTarget}'`
  }
  return dbtArgs
}

function getDirectories(projectsDir) {
  return fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

function getCopyCommand(src, dest) {
  return `cp ${src}/target/*.json ${src}/target/*.html ${src}/target/graph.gpickle ${dest}`
}

module.exports = {
  runCommand,
  getCopyCommand,
  getDirectories,
  getDbtArgs
}
