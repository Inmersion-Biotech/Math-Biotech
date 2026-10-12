# Security policy

## Scope

This repository contains learning software in active development. Automated tests or badges do **not** constitute a penetration test, compliance audit or security certification.

## Reporting vulnerabilities

**Do not put credentials, exploit details or sensitive user data in public GitHub issues.** Use GitHub's private vulnerability-reporting interface if available for the repository. Otherwise request a private contact method from an organization maintainer without disclosing the vulnerability details publicly.

Include a concise impact description, reproduction conditions and affected version, but never provide active secrets in an untrusted channel. Fix timelines depend on severity and maintainer availability; no formal SLA is promised.

## Security expectations

- Never commit `.env` files, service-account JSON, private keys, tokens, user exports or passwords.
- All authorization must be enforced server-side and in Firestore Security Rules.
- Do not trust UI-only role checks, a fixed email address, or unvalidated client-provided roles.
- Review dependency alerts and apply supported patches.
- Treat all uploaded files and external or AI-generated content as untrusted.
- Keep secrets in access-controlled environment stores, not in a browser bundle or localStorage.

## Publication restrictions

A public visibility switch exposes the Git history, not only the current working tree. The release checklist must be cleared before publishing.