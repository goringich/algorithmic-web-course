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

## Merge gate

Before V2 becomes the deployed commercial surface:

1. keep Git history intact;
2. run a path-level authorship/provenance report for any legacy file proposed for reuse;
3. either obtain the required rights or rewrite the component/content independently;
4. inventory third-party packages and their licenses;
5. do not add a repository-wide open-source license that purports to license historical contributors' code without authority to do so.

The safest commercial deployment path is V2-only until this gate is complete.
