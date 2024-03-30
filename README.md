# <img src="https://global.discourse-cdn.com/business7/uploads/getdbt/original/1X/a7a7ca1fe379aaf90952b0e13118a817babcd14f.png" alt="generate-dbt-docs" width="50" height="50"> generate-dbt-docs

This action is used to generate
[dbt docs](https://docs.getdbt.com/docs/collaborate/documentation) for single or
multiple projects

## Usage

See [action.yml](action.yml) for the `inputs` this action supports (or
[below](#inputs-📥)).

This action generates the dbt docs for the single or multiple projects which are
present under a directory in the repo using github workflows.

### Example

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: 'Step 01 - Checkout current branch'
        id: step01
        uses: actions/checkout@v3

      - name: 'Step 02 - Install dbt'
        id: step02
        run: |
          pip3 install -r projects/requirements.txt
          dbt --version

      - name: 'Step 03 - Generate dbt docs'
        id: step03
        uses: praneeth527/generate-dbt-docs@v1
        with:
          projects_dir: projects
          docs_dir: ${{ github.workspace }}/docs
```

## Inputs 📥

| Input           | Required? | Default | Description                                                    |
| --------------- | --------- | ------- | -------------------------------------------------------------- |
| `projects_dir`  | `true`    | -       | path of the dbt projects folder in the repo                    |
| `docs_dir`      | `true`    | `docs`  | output directory path where dbt generated docs will be written |
| `env_file_path` | `false`   | -       | env variables file to source before running dbt commands       |
| `dbt_profile`   | `false`   | -       | dbt profile to be passed to the dbt command                    |
| `dbt_vars`      | `false`   | -       | dbt vars to be passed to the dbt command                       |
| `dbt_target`    | `false`   | -       | dbt target to be passed to the dbt command                     |

### env_file_path contents example

```shell
export DBT_PROFILE_DIR=profiles
export ENV_VAR1=VAR1_VALUE
export ENV_VAR2=VAR2_VALUE
export ENV_VAR3=VAR3_VALUE
```

## Outputs 📤

There are no outputs returned by the action as of now.

## Demo

Check this repo for the demo of this action usage
https://github.com/praneeth527/dbt-docs-demo

---

The dbt logo is a trademark of https://getdbt.com/ and is used here under
license.
