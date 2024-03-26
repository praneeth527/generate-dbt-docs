const commands = ['dbt deps', 'dbt compile', 'dbt docs generate']

const tmpDocDir = 'tmp_docs'

const fileFormats = ['.json', '*.html', '.gpickle']

module.exports = {
  commands,
  tmpDocDir,
  fileFormats
}
