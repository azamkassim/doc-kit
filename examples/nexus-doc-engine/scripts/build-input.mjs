import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const demoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourcePath = path.join(demoRoot, 'sample', 'nexus-demo.json');
const generatedDir = path.join(demoRoot, 'generated');
const markdownPath = path.join(generatedDir, 'nexus-demo.md');
const indexPath = path.join(generatedDir, 'index.md');
const provenancePath = path.join(generatedDir, 'provenance.json');

const sourceBytes = await readFile(sourcePath);
const source = JSON.parse(sourceBytes.toString('utf8'));
const sourceSha256 = createHash('sha256').update(sourceBytes).digest('hex');

const record = source.record;
const formatRm = amount =>
  new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0,
  }).format(amount);

const evidenceRows = record.evidence
  .map(
    item =>
      `| ${item.type} | ${item.label} | ${item.status} |`
  )
  .join('\n');

const markdown = `# ${record.title}

> Synthetic, non-sensitive demonstration data only.

## Provenance

- Source classification: \`${source.classification}\`
- Source file: \`sample/nexus-demo.json\`
- Source SHA-256: \`${sourceSha256}\`
- Snapshot timestamp: \`${source.snapshot_at}\`
- Schema version: \`${source.schema_version}\`
- Adapter version: \`nexus-doc-adapter.v1\`

## Customer

- Name: **${record.customer.name}**
- Demo customer ID: \`${record.customer.customer_id}\`

## Facility

- Type: **${record.facility.type}**
- Amount: **${formatRm(record.facility.amount_rm)}**
- Tenure: **${record.facility.tenure_months} months**
- Purpose: ${record.facility.purpose}

## Evidence

| Classification | Item | Status |
| --- | --- | --- |
${evidenceRows}

## Decision context

${record.decision_context.recommendation}

Human decision required: **${record.decision_context.human_decision_required ? 'Yes' : 'No'}**
`;

const indexMarkdown = `# NEXUS Doc Engine Demo

* [Synthetic Contract Review](nexus-demo.md)
`;

const provenance = {
  schema_version: 'nexus-provenance.v1',
  source: {
    path: 'sample/nexus-demo.json',
    sha256: sourceSha256,
    classification: source.classification,
    snapshot_at: source.snapshot_at,
  },
  generator: {
    adapter: 'nexus-doc-adapter.v1',
    output_markdown: 'generated/nexus-demo.md',
    index: 'generated/index.md',
  },
};

await mkdir(generatedDir, { recursive: true });
await Promise.all([
  writeFile(markdownPath, markdown, 'utf8'),
  writeFile(indexPath, indexMarkdown, 'utf8'),
  writeFile(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`, 'utf8'),
]);

console.log('NEXUS demo input generated.');
console.log(`Source SHA-256: ${sourceSha256}`);
console.log(`Markdown: ${markdownPath}`);
console.log(`Provenance: ${provenancePath}`);
