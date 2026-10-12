<div align="center">

# MATH × BIOTECH

**Explore patterns of change, structure and living systems.**

*An interactive mathematics and scientific modeling laboratory.*

### [Launch the interactive lab ↗](https://inmersion-biotech.github.io/Math-Biotech/site/)

[![CI](https://github.com/Inmersion-Biotech/Math-Biotech/actions/workflows/ci.yml/badge.svg)](https://github.com/Inmersion-Biotech/Math-Biotech/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6)
![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20PWA%20%7C%20Android-136F63)
[![Code License: Apache-2.0](https://img.shields.io/badge/Code%20License-Apache--2.0-0066cc)](LICENSE_SCOPE.md)

**[Explore](#the-learning-laboratory) · [Architecture](#architecture) · [Quick start](#quick-start) · [Security](SECURITY.md) · [Contributing](CONTRIBUTING.md)**

</div>

---

## The learning laboratory

| Learn | Experiment | Understand |
|:---|:---|:---|
| Algebra, functions, limits, calculus and equations | Numerical calculations, interactive graphs and 3D scenes | Models of growth, change and biological systems |
| Structured lessons and examinations | Explore assumptions through visualization | Compare predictions and interpret results |

Eight pathways: **Matrix · Sequences · Functions · Limits · Derivatives · Integrals · Differential equations · Exams**.

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Scientific tools | KaTeX and mathematical utilities |
| Interactive visuals | Three.js, React Three Fiber, Framer Motion |
| Platform | Installable PWA and Capacitor Android |
| Optional API | Node.js, Express, TypeScript |
| Verification | TypeScript, Vitest, GitHub Actions |

## Quick start

Requires Node.js 22 LTS (or another compatible version) and npm.

1. Run `npm ci`.
2. Run `npm run dev`.
3. Before proposing changes run `npm run verify`.
4. Production build: `npm run build`; preview with `npm run preview`.

Backend development is described in [server/README.md](server/README.md). Android builds require an installed Android development environment.

## Responsible scientific computing

- Visual models and calculations are learning tools, not laboratory measurements.
- Avoid private learner data, passwords and tokens in source files or logs.
- The optional AI module still has a browser bring-your-own-key mechanism. Do **not** consider browser storage a secure production credential vault; hosted access requires a reviewed backend boundary.

Read [SECURITY.md](SECURITY.md), [CONTENT_POLICY.md](CONTENT_POLICY.md) and [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

## Contributions and licensing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Eligible project-authored software code in this preparation branch is licensed under [Apache-2.0](LICENSE), with [documented exclusions](LICENSE_SCOPE.md). Changes are pending review and have not yet been merged into public `main`. See [LICENSE-DECISION.md](LICENSE-DECISION.md).

---

<div align="center"><sub>INMERSION BIOTECH · SCIENCE THROUGH OBSERVATION</sub></div>