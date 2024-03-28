const core = require('@actions/core')
const fs = require('fs')
const mustache = require('mustache')
const { spawnSync } = require('child_process')

const {
  runCommand,
  getDirectories,
  getDbtArgs,
  getCopyCommand,
  runCommandSync
} = require('./utils')
const { tmpDocDir, commands, indexHtmlFilePath } = require('./constants')

async function run() {
  try {
    const projectsDir = core.getInput('projects_dir')
    const envFilePaths = core.getInput('env_file_path')
    const docsOutputDir = core.getInput('docs_dir')

    const dbtProfile = core.getInput('dbt_profile')
    const dbtVars = core.getInput('dbt_vars')
    const dbtTarget = core.getInput('dbt_target')

    const projects = getDirectories(projectsDir)
    const dbtArgs = getDbtArgs(dbtProfile, dbtVars, dbtTarget)

    const cwd = runCommandSync('pwd').stdout
    core.info(`cwd: ${cwd}`)

    if (envFilePaths) {
      await runCommand(`source ${cwd}/${envFilePaths}`)
    }

    const projectList = []

    for (const project of projects) {
      const projectFullPath = `${cwd}/${projectsDir}/${project}`
      const tmpPath = `${cwd}/${tmpDocDir}/${project}`
      core.info(`changing dir to ${projectFullPath}`)
      process.chdir(projectFullPath)
      for (const command of commands) {
        await runCommand(`${command} ${dbtArgs}`)
      }
      fs.mkdirSync(tmpPath, { recursive: true })

      await runCommand(getCopyCommand(projectFullPath, tmpPath))

      projectList.push(`<li><a href="${project}">${project}</a></li>`)
    }
    process.chdir(cwd)

    await runCommand(`mv ${cwd}/${tmpDocDir} ${docsOutputDir}`)

    const mainIndexHtml = mustache.render(
      runCommandSync(`cat ${indexHtmlFilePath}`).stdout,
      {
        projectListItems: projectList
      }
    )

    fs.writeFileSync(`${docsOutputDir}/index.html`, mainIndexHtml)

    core.info(`dbt docs generated successfully and written to ${docsOutputDir}`)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

module.exports = {
  run
}
