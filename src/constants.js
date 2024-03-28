const commands = ['dbt deps', 'dbt compile', 'dbt docs generate']

const tmpDocDir = 'tmp_docs'

const fileFormats = ['.json', '*.html', '.gpickle']

const indexHtmlFilePath =
  '/home/runner/work/_actions/praneeth527/dbt-docs-generator/*/dist/index.html'

module.exports = {
  commands,
  tmpDocDir,
  fileFormats,
  indexHtmlFilePath
}
