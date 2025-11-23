# Avantos Prefill Challenge

This repo hosts a React + TypeScript + Vite solution that:

- pulls the blueprint DAG from the mock API
- renders a node graph of forms
- allows configuring prefill mappings with pluggable data-source providers
- persists local overrides so changes survive reloads
- ships with Vitest + React Testing Library coverage for the key flows

## Prerequisites

- **Node 18+** (recommended). The mock environment currently uses Node 14, but Vitest requires at least Node 18.
- **npm 8+**

## Getting Started

```bash
npm install
# start dev server on http://localhost:5173
npm run dev
```

### Running Tests

```bash
npm run test
# or keep Vitest in watch mode
npm run test:watch
```

### Linting & Build

```bash
npm run lint
npm run build
```

## Mock API

The UI expects the mock server from [mosaic-avantos/frontendchallengeserver](https://github.com/mosaic-avantos/frontendchallengeserver) (or your local variant) to run on `http://localhost:3000`. Only the `GET /api/v1/demo/actions/blueprints/demo/graph` endpoint is required; PATCH calls are simulated locally via the overrides context.
