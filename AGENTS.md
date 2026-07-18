# Repository Guidelines

## Repository Scope

- This repository is one standalone Next.js application rooted here.
- This file applies to the entire repository. Do not create a nested `AGENTS.md` unless a future independent application needs separate rules.
- Keep changes within the explicit task and preserve unrelated work.

## Canonical Guidance

- `.ai/` is the canonical repository instruction source.
- Read `.ai/README.md` before any repository work, then load only the topic files it routes for the task.
- Current configuration and generated contracts describe current repository behavior. Stale prose does not override them.
- Report contradictions and documentation drift. Do not silently choose between conflicting canonical instructions.

## File Selection

- `.ai/README.md` owns topic selection. Do not load every `.ai` file by default.

## Working Protocol

- Follow the scoped protocol in `.ai/README.md` and inspect `git status --short` before editing.
- Do not weaken architecture, dependency, type, test, security, or accessibility checks.
- Do not stage or commit unless explicitly requested.
- Obtain explicit approval before dependency, lockfile, environment, generated-code, or production-build changes.

## Commands

- `.ai/7-tech-stack-tooling-ci.md` owns command classifications and exact tooling facts.
- Do not run a writing command unless the task and its required approval authorize it.

## Generated Files

- Follow `.ai/7-tech-stack-tooling-ci.md`; do not hand-edit generated or tool-owned state.

## Verification

- Follow `.ai/README.md` and `.ai/7-tech-stack-tooling-ci.md`. Never claim a command passed without current successful output.

## Completion Report

- Report changed files, verification outcomes, unresolved decisions, failures, and limitations.
