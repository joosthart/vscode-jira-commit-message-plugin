# JIRA Commit Message for VSCode/Cursor

![JIRA Commit Message Icon](images/icon.png)

This extension helps you by automatically appending JIRA task ID to your commit messages. It's a port of the popular [JetBrains JIRA Commit Message plugin](https://github.com/nemwiz/jira-commit-message-intellij-plugin).

## Features

* Automatically extracts JIRA issue IDs from your branch name
* Populates the Git commit message input field with the JIRA ID
* Supports conventional commits format
* Customizable message formatting options

This extension works only with Git version control system.

## Usage

When you check out a branch containing a JIRA issue ID (e.g., `feature/PROJECT-123-new-feature`), the extension will automatically populate the commit message input box with the JIRA ID (e.g., `PROJECT-123`).

You can also manually trigger the JIRA ID insertion by clicking the extension's icon in the Source Control view.

## Configuration Options

You can configure the extension under VSCode settings:

### Automatic Mode

When `jiraCommitMessage.autoDetectProjectKey` is enabled (default), the extension will infer your project key from the branch name. For example:

| Your branch name | Commit message produced by the extension |
| --- | --- |
| feat/this-PRODUCT-123-is-cool | PRODUCT-123 |
| fix/LEGOS-541 | LEGOS-541 |
| MARCOM_881-feature | MARCOM_881 |

### Manual Mode

If you want more control over which project keys are recognized, disable `jiraCommitMessage.autoDetectProjectKey` and specify your project keys in `jiraCommitMessage.jiraProjectKeys`.

The project key must be specified in **uppercase** as per Atlassian convention.

### Conventional Commits Support

To follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format, enable `jiraCommitMessage.isConventionalCommit`. 

When configured, the extension will automatically detect if your branch name starts with any of the conventional commit prefixes (feat, fix, docs, etc.) and add it to the commit message. For example:

| Your branch name | Commit message produced by the extension |
| --- | --- |
| feat/this-PRODUCT-123-is-cool | feat(PRODUCT-123): |
| fix/LEGOS-541 | fix(LEGOS-541): |
| docs-MARCOM_881-feature | docs(MARCOM_881): |

### Additional Configuration

* **messageWrapperType**: Control the brackets enclosing your commit message
  * `none`: PRODUCT-123
  * `parentheses`: (PRODUCT-123)
  * `brackets`: [PRODUCT-123]
  * `curly_brackets`: {PRODUCT-123}
  * `backslash`: \PRODUCT-123\

* **messagePrefixType**: Control the prefix added at the beginning of your commit message
  * `none`: PRODUCT-123
  * `hash`: #PRODUCT-123
  * `colon`: :PRODUCT-123
  * `dash`: -PRODUCT-123

* **messageInfixType**: Control the infix appended at the end of your commit message
  * `none`: PRODUCT-123
  * `colon`: PRODUCT-123:
  * `colon_space`: PRODUCT-123: 
  * `dash_space`: PRODUCT-123 - 

* **prependJiraIssueOnActionClick**: If enabled, the JIRA issue will be prepended to the existing commit message when you click the extension's icon, rather than replacing it.

## Credits

This extension is a port of the [JIRA Commit Message plugin for JetBrains IDEs](https://github.com/nemwiz/jira-commit-message-intellij-plugin) by nemwiz. 