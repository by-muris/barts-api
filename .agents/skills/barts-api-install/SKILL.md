---
name: barts-api-install
description: Install and configure @by-muris/barts-api in a TypeScript Express application. Use for package installation, peer dependencies, TypeScript decorator setup, or local-package setup.
---

# Install Barts API

Install Barts and every runtime peer dependency in the consuming application:

```bash
npm install @by-muris/barts-api express class-transformer class-validator class-validator-jsonschema reflect-metadata
npm install --save-dev @types/express
```

Enable DTO decorators in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Import `reflect-metadata` once, before decorated DTOs or controllers load. The application owns these peers so decorator and schema metadata use one shared instance.

For a local copy of this repository, see [`example/`](../../../example): it consumes the package through `file:..` and runs with `npm run dev`.
