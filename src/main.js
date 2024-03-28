const core = require('@actions/core')
const fs = require('fs')
const mustache = require('mustache')
const { spawnSync } = require('child_process')

const {
  runCommand,
  getDirectories,
  getDbtArgs,
  getCopyCommand
} = require('./utils')
const { tmpDocDir, commands } = require('./constants')

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

    const cwd = spawnSync('pwd', { shell: true }).stdout.toString().trim()
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

    await runCommand(`mv ${cwd}/${tmpDocDir} ${cwd}/${docsOutputDir}`)

    const mainIndexHtml = mustache.render(
      fs.readFileSync('index.html').toString(),
      {
        projectListItems: projectList
      }
    )
    core.info(`mainIndexHtml: ${mainIndexHtml}`)

    core.info(`creating the docs output dir if not exists: ${docsOutputDir}`)
    fs.mkdirSync(docsOutputDir, { recursive: true })

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
