# Initial Publish Workflow Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Target repo:** `okkema/ui` (current workspace)

**Prerequisite:** `okkema/actions/npm-publish` must be updated first (see `2026-07-27-npm-publish-action.md`).

**Goal:** Create a GitHub Actions workflow that publishes `@okkema/ui` to npm when a GitHub Release is created, keeping the release tag and npm version in sync.

**Architecture:** A single workflow triggered on release publication. Uses `okkema/actions/npm-publish@main` with version sync, commit-back, and public access for the initial scoped package publish.

**Tech Stack:** GitHub Actions, npm, `@okkema/actions`

---

## File Structure

- Create: `.github/workflows/publish.yml`
- Existing: `.nvmrc` (already contains `v20.15.0`, no changes needed)

## Task 1: Create publish workflow

- [ ] **Step 1: Create `.github/workflows/publish.yml`**

```yaml
name: Publish

on:
  release:
    types: [published]

permissions:
  contents: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: okkema/actions/npm-publish@main
        with:
          npm-token: ${{ secrets.NPM_TOKEN }}
          version: ${{ github.event.release.tag_name }}
          commit: 'true'
          access: 'public'
          node-version-file: '.nvmrc'
```

- [ ] **Step 2: Verify `.nvmrc` exists**

Run: `cat .nvmrc`
Expected: outputs a Node.js version (e.g. `v20.15.0`)

- [ ] **Step 3: Verify workflow file exists**

Run: `ls -la .github/workflows/publish.yml`
Expected: file exists

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/publish.yml
git commit -m "ci: add publish workflow for npm releases"
```
