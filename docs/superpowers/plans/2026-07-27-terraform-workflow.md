# Terraform Workflow Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Target repo:** `okkema/ui` (current workspace)

**Goal:** Add a GitHub Actions workflow that runs `okkema/actions/terraform` to apply the Terraform configuration.

**Architecture:** A workflow triggered manually (workflow_dispatch) that uses `okkema/actions/terraform@main`. The `github_repository` variable is passed via `TF_VAR_github_repository` env var, which Terraform reads automatically.

**Tech Stack:** GitHub Actions, Terraform Cloud

---

## File Structure

- Create: `.github/workflows/terraform.yml`

## Task 1: Create terraform workflow

- [ ] **Step 1: Create `.github/workflows/terraform.yml`**

```yaml
name: Terraform

on:
  workflow_dispatch:

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: okkema/actions/terraform@main
        with:
          terraform-token: ${{ secrets.TF_API_TOKEN }}
        env:
          TF_VAR_github_repository: okkema/ui
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la .github/workflows/terraform.yml`
Expected: file exists

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/terraform.yml
git commit -m "ci: add terraform workflow"
```
