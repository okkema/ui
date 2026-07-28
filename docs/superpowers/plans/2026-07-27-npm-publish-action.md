# npm-publish Action Enhancement Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Target repo:** `okkema/actions` (NOT the current `okkema/ui` repo)

**Goal:** Add `version`, `commit`, `access`, and `node-version-file` inputs to `okkema/actions/npm-publish` so consumers can auto-sync npm publish with git commits, publish public scoped packages, and use `.nvmrc` for Node.js version.

**Architecture:** Extend the existing composite action with four optional inputs. When `version` is provided, the action updates `package.json` before publishing. When `commit` is true, it commits the version change back to the repo after publishing. When `access` is `public`, it passes `--access public` to npm publish (required for initial scoped package publishes). When `node-version-file` is provided, it reads the Node.js version from that file (e.g. `.nvmrc`).

**Tech Stack:** GitHub Actions, composite actions, npm

---

## File Structure

- Modify: `actions/npm-publish/action.yml` (in `okkema/actions` repo)

## Task 1: Add version and commit inputs

**Current file:** `actions/npm-publish/action.yml`

```yaml
name: 'Setup Node and Publish to npm'
description: 'Sets up Node.js and publishes a package to npm'

inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'
  registry-url:
    description: 'npm registry URL'
    required: false
    default: 'https://registry.npmjs.org'
  npm-token:
    description: 'npm authentication token'
    required: true
  scope:
    description: 'npm scope (e.g. @myorg)'
    required: false
    default: ''

runs:
  using: 'composite'
  steps:
    - name: Checkout
      uses: actions/checkout@v7

    - name: Setup Node.js
      uses: actions/setup-node@v7
      with:
        node-version: ${{ inputs.node-version }}
        node-version-file: ${{ inputs.node-version-file }}
        registry-url: ${{ inputs.registry-url }}

    - name: Install dependencies
      run: npm ci || npm install
      shell: bash

    - name: Publish to npm
      run: npm publish${{ inputs.scope && format(' --scope {0}', inputs.scope) || '' }}${{ inputs.access && format(' --access {0}', inputs.access) || '' }}
      shell: bash
      env:
        NODE_AUTH_TOKEN: ${{ inputs.npm-token }}
```

- [ ] **Step 1: Add `version`, `commit`, `access`, and `node-version-file` inputs**

Add four new inputs after the existing `scope` input:

```yaml
  version:
    description: 'Package version to set before publishing (e.g. v1.2.3 or 1.2.3)'
    required: false
    default: ''
  commit:
    description: 'Commit version change back to the repo after publishing'
    required: false
    default: 'false'
  access:
    description: 'npm access level (public or restricted). Required for initial scoped package publishes.'
    required: false
    default: ''
  node-version-file:
    description: 'Path to Node.js version file (e.g. .nvmrc). Overrides node-version when provided.'
    required: false
    default: ''
```

- [ ] **Step 2: Add version bump step**

Add after "Install dependencies" and before "Publish to npm":

```yaml
    - name: Set version
      if: inputs.version != ''
      run: npm version "${{ inputs.version }}" --no-git-tag-version
      shell: bash
```

- [ ] **Step 3: Add commit step**

Add as the last step:

```yaml
    - name: Commit version
      if: inputs.commit == 'true' && inputs.version != ''
      run: |
        git config user.name "github-actions[bot]"
        git config user.email "github-actions[bot]@users.noreply.github.com"
        git add package.json
        git diff --staged --quiet || git commit -m "chore: release ${{ inputs.version }}"
        git push
      shell: bash
```

- [ ] **Step 4: Verify the final action.yml**

The complete file should be:

```yaml
name: 'Setup Node and Publish to npm'
description: 'Sets up Node.js and publishes a package to npm'

inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'
  registry-url:
    description: 'npm registry URL'
    required: false
    default: 'https://registry.npmjs.org'
  npm-token:
    description: 'npm authentication token'
    required: true
  scope:
    description: 'npm scope (e.g. @myorg)'
    required: false
    default: ''
  version:
    description: 'Package version to set before publishing (e.g. v1.2.3 or 1.2.3)'
    required: false
    default: ''
  commit:
    description: 'Commit version change back to the repo after publishing'
    required: false
    default: 'false'
  access:
    description: 'npm access level (public or restricted). Required for initial scoped package publishes.'
    required: false
    default: ''
  node-version-file:
    description: 'Path to Node.js version file (e.g. .nvmrc). Overrides node-version when provided.'
    required: false
    default: ''

runs:
  using: 'composite'
  steps:
    - name: Checkout
      uses: actions/checkout@v7

    - name: Setup Node.js
      uses: actions/setup-node@v7
      with:
        node-version: ${{ inputs.node-version }}
        node-version-file: ${{ inputs.node-version-file }}
        registry-url: ${{ inputs.registry-url }}

    - name: Install dependencies
      run: npm ci || npm install
      shell: bash

    - name: Set version
      if: inputs.version != ''
      run: npm version "${{ inputs.version }}" --no-git-tag-version
      shell: bash

    - name: Publish to npm
      run: npm publish${{ inputs.scope && format(' --scope {0}', inputs.scope) || '' }}${{ inputs.access && format(' --access {0}', inputs.access) || '' }}
      shell: bash
      env:
        NODE_AUTH_TOKEN: ${{ inputs.npm-token }}

    - name: Commit version
      if: inputs.commit == 'true' && inputs.version != ''
      run: |
        git config user.name "github-actions[bot]"
        git config user.email "github-actions[bot]@users.noreply.github.com"
        git add package.json
        git diff --staged --quiet || git commit -m "chore: release ${{ inputs.version }}"
        git push
      shell: bash
```

- [ ] **Step 5: Commit**

```bash
git add actions/npm-publish/action.yml
git commit -m "feat(npm-publish): add version, commit, access, and node-version-file inputs"
```
