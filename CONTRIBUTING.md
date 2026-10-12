# Contributing to Inmersion Biotech

Thank you for helping improve scientific learning software. We value accurate explanations, reproducible calculations, accessible interfaces and responsible handling of living systems.

## Before you contribute

1. Open an issue describing the change, except for small fixes.
2. Use a focused feature branch; do not include generated build artifacts, private learning data or secrets.
3. Keep scientific claims evidence-aware: label simulations, assumptions, units and uncertainty. Do not represent software models as experimental observations.
4. Update or add tests for behavioral changes and provide a clear verification procedure.
5. If touching authentication, Firestore rules or API permissions, include a migration plan and negative authorization tests.

## Local development

- Node.js 22 LTS and npm are recommended.
- Install: `npm ci`.
- Create a private local file from `.env.example` only if required; **never commit real values**.
- Run the project-specific verification listed in the README.

## Pull requests

Describe **what changed**, **why**, **how it was verified**, **screenshots for UI changes**, and **privacy/security implications**. Keep changes reviewable.

By contributing, you confirm you are permitted to submit the code and materials under **Apache-2.0 for original project-authored code**. Third-party code, course material, media and datasets require separate rights clearance; do not submit them without permission.

Security issues should follow [SECURITY.md](SECURITY.md), not public issues.