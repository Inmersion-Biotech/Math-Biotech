# Dependency security review — 2026-10-12

Command: `npm audit --omit=dev` using the current lockfile.

**Production dependency findings:** **0 critical, 2 high, 1 moderate, 2 low** (5 total).

High packages reported: `brace-expansion` and `source-map-js`. The audit reports an available remediation for both; apply a controlled lockfile update and rerun `npm run verify` before merging.

This result reflects the current package lockfile only and does not include an assessment of the backend's independent dependency tree. No upgrade was applied automatically.