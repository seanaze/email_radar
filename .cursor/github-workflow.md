---
description: Instructions for using the GitHub CLI to create issues, commits, and pull requests.
globs: 
alwaysApply: false
---

# GitHub CLI Workflow Guide

This guide provides a walkthrough for a common development workflow using the GitHub CLI, from viewing issues to creating pull requests.

## Managing Issues

### Viewing Issues

List all open issues in the repository:

```bash
gh issue list | cat
```

To filter by a specific label:

```bash
gh issue list --label "bug" | cat
```

### Creating an Issue

1. **Create a temporary issue body file.**
   Create a file named `_docs/temp-issue-body.md` and add the issue description there. This allows for proper Markdown formatting. Issue descriptions should be detailed, specific, and context-rich.

2. **Run the `gh issue create` command.**
   Use the following command to create an issue, providing a title and labels. See the "Available Labels" section for guidance.

   ```bash
   gh issue create --title "Your Issue Title" --body-file "_docs/temp-issue-body.md" --label "bug,high-priority"
   ```

3. **Delete the temporary file.**
   After creating the issue, delete `_docs/temp-issue-body.md`.

## Making Commits & Resolving Issues

1. **Create a temporary commit message file.**
   Create a file named `_docs/temp-commit-message.md` and add your commit message there. To link the commit to an issue and automatically close it upon merge, include a keyword like `closes #42` in this file.

2. **Run the `git commit` command.**
   Use the `-F` flag to use the file content as the commit message.

   ```bash
   git commit -F _docs/temp-commit-message.md
   ```

3. **Delete the temporary file.**
   After creating the commit, delete `_docs/temp-commit-message.md`.

## Creating Pull Requests

1. **Create a temporary pull request body file.**
   Create a file named `_docs/temp-pr-body.md` and add the description there. **IMPORTANT: If your PR resolves issues, include closing keywords in this file or the PR title.**

2. **Run the `gh pr create` command.**
   Use the `--body-file` flag to use the file content as the PR body.

   ```bash
   gh pr create --title "Pull Request Title" --body-file "_docs/temp-pr-body.md"
   ```

3. **Delete the temporary file.**
   After creating the pull request, delete `_docs/temp-pr-body.md`.

## Available Labels

Here is a list of available labels for issues. **All issues must have exactly one priority label and at least one standard label.**

### Priority Labels

- `high-priority`: High priority - needs to be addressed immediately.
- `medium-priority`: Medium priority - should be addressed in the near future.
- `low-priority`: Low priority - can be addressed when time permits.

### Standard Labels

- `bug`: Something isn't working
- `documentation`: Improvements or additions to documentation
- `enhancement`: New feature or request
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `refactor`: Code refactoring 