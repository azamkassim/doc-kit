# NEXUS Doc Engine proof of concept

This example is an isolated, synthetic proof of concept for using doc-kit as a
documentation and provenance pipeline. It does not contain customer, banking,
credential, or internal production data.

## What it proves

```text
synthetic canonical JSON
        |
        v
adapter -> Markdown + provenance manifest
        |
        v
@doc-kit/cli
        |
        +--> HTML documentation
        +--> Orama local search index
        +--> llms.txt
```

The adapter keeps provenance beside the generated documentation so a reader or
downstream agent can trace each build back to the exact source payload.

## Run

From the repository root:

```sh
pnpm install
node examples/nexus-doc-engine/scripts/run-demo.mjs
```

Generated inputs are written to:

```text
examples/nexus-doc-engine/generated/
```

doc-kit output is written to:

```text
examples/nexus-doc-engine/out/
```

To inspect only the adapter output without invoking doc-kit:

```sh
node examples/nexus-doc-engine/scripts/build-input.mjs
```

## Safety boundary

Use only synthetic or explicitly approved non-sensitive material in this
example. Production banking data should remain local/offline unless an
authorized architecture and data-handling approval explicitly permits
otherwise.

## Next step after validation

Replace the synthetic JSON reader with narrow adapters for approved source
types, while retaining the same provenance fields:

- source file or canonical object identifier
- SHA-256 source digest
- source classification
- snapshot timestamp
- adapter version
- generated document path

Keep upstream `main` clean. Build NEXUS-specific work on this branch or on
branches created from it.
