# docs/design-philosophy.md

> **Purpose:** a concise, human-facing philosophy for the repository. This file is intentionally *philosophy-only* — it says *why* we design the way we do. Machine-readable tokens and enforcement live elsewhere (`design-tokens.yml`, `tailwind.config.js`, `components/ui`).

## Design Philosophy — Playful, Trustworthy, Warm

We aim for a product that feels **playful yet trustworthy**: friendly and approachable without sacrificing credibility. The visual voice should be warm, human, and comfortably modern.

### Core principles

* **Soft over Sharp** — round corners and gentle curves; avoid harsh edges.
* **Warm over Cool** — prefer warm beiges and oranges; limit neutral cool grays.
* **Playful over Sterile** — introduce color variety, subtle motion, and friendly microcopy while keeping clarity.
* **Clear over Clever** — prioritize readability and obvious affordances.
* **Personal over Corporate** — small touches (rounded radii, mellow shadows, warm backgrounds) to create human connection.

### Key tokens (for reference)

* Primary color: *Orange* — used for CTAs, highlights.
* Background: *Warm beige* — page surfaces and app backdrop.
* Text: *Dark, soft black* — high readability.
* Accents: green (success), pink & yellow (step/illustrative accents).

> **Where to apply this doc:** humans (product/design/dev) should read this for intent and tone. For enforcement and actual values, use the canonical token files in the repo: `design-tokens.yml`, `tailwind.config.js`, and the `components/ui/*` wrappers.
