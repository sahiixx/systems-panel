# systems-panel

![Node](https://img.shields.io/badge/node-20+-green)

A node project built with astro, react. This description is generated from repository structure; replace it with a purpose statement when convenient.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Model Routing](#model-routing)
- [Project Layout](#project-layout)
- [Development](#development)
- [Related Repositories](#related-repositories)

## Overview

A node project built with astro, react. This description is generated from repository structure; replace it with a purpose statement when convenient.

| | |
|---|---|
| **Stack** | node |
| **Frameworks** | astro, react |
| **Tests** | none detected |
| **Commits** | 2 |
| **Last activity** | 2026-08-10 |
| **Visibility** | public |

## Quick Start

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

## Model Routing

Agent work in this repo routes through Azure AI Foundry. See [`AGENTS.md`](./AGENTS.md)
for the full contract.

| Purpose | Deployment | Endpoint |
|---|---|---|
| Default / general | `gpt-5.6-sol` | `/openai/v1/chat/completions` |
| Deep reasoning | `claude-opus-5` | `/openai/v1/responses` **only** |
| Embeddings | `text-embedding-3-small` | `/openai/v1/embeddings` |

```bash
export AZURE_FOUNDRY_API_KEY=...        # never commit this
export AZURE_FOUNDRY_BASE_URL=https://<resource>.openai.azure.com/openai/v1
```

> **Gotcha:** Claude deployments on Azure return `404 api_not_supported` on
> `/chat/completions`. They answer **only** via the Responses API.

## Project Layout

```
AGENTS.md
astro.config.mjs
package-lock.json
package.json
public/
scripts/
src/
tailwind.config.mjs
tsconfig.json
wrangler.toml
```

## Development

```bash
# lint / format before committing
npm run lint

# run the CI check locally
gh workflow run hermes-azure-check.yml
```

Secrets live in environment variables and CI secrets — never in tracked files.

## Related Repositories

Part of a 84-repository workspace sharing one agentic contract:

- **[agentic-harness](https://github.com/sahiixx/agentic-harness)** — patterns, contracts, and reference implementations
- `AGENTS.md` in every repo pins identical model routing

---

<sub>README maintained by the agentic harness · last regenerated 2026-08-10</sub>
