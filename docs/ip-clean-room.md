# AlgoHar V2 — IP and clean-room boundary

This document is an engineering control, not legal advice.

## Historical project

The repository contains a student project with multiple historical contributors. Repository ownership and GitHub admin rights do not by themselves establish exclusive ownership of every historical contribution.

## V2 rule

Commercial V2 is isolated under `v2/`. New V2 implementation must not copy historical source, UI assets, lesson text or visualizer logic from legacy folders unless provenance and reuse rights are explicitly established.

Allowed without legacy provenance:

- general algorithm ideas, methods and mathematical concepts;
- independently written explanations;
- independently implemented algorithm traces;
- dependencies used under their own compatible licenses.

Requires provenance review before reuse:

- legacy React components;
- old visualizer code;
- old text/course materials;
- custom images/icons/illustrations;
- database content authored by former teammates.

## Machine-enforced V2 boundary

`npm run verify:clean-room` is a required V2 quality gate. It is intentionally narrow and fail-closed:

- V2 module references may not resolve outside `v2/`;
- stylesheet-relative asset references may not escape `v2/`;
- V2 may not contain symlinks that bypass the directory boundary;
- source may not reference the historical `FrontEnd/`, `BackEnd/` or `DataBase/` paths;
- every direct npm dependency must expose machine-readable license metadata after install.

The check is necessary but not sufficient. It prevents accidental runtime/source coupling to the historical implementation, but it cannot prove authorship or reuse rights for content that was manually copied into V2. Any proposed legacy reuse still requires a path-level provenance decision before merge.

## Merge gate

Before V2 becomes the deployed commercial surface:

1. keep Git history intact;
2. keep `npm run verify:clean-room` green in CI;
3. run a path-level authorship/provenance report for any legacy file proposed for reuse;
4. either obtain the required rights or rewrite the component/content independently;
5. inventory third-party packages and their licenses;
6. do not add a repository-wide open-source license that purports to license historical contributors' code without authority to do so.

The safest commercial deployment path is V2-only until this gate is complete.
