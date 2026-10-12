#!/usr/bin/env node
// Conservative pre-publication tracked-file review. Never prints credential values.
// This is not a full-history scan, source-rights audit, or security certification.
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { extname } from 'node:path';

const paths = execFileSync('git', ['ls-files', '-z'], {
  encoding: 'buffer', maxBuffer: 32 * 1024 * 1024
}).toString('utf8').split('\0').filter(Boolean);

const findings = [];
const add = (file, category) => findings.push({ file, category });
const isEnv = name => /(^|\/)\.env(?:[./]|$)/.test(name) && !name.endsWith('.env.example');
const documentExt = new Set(['.pdf', '.docx', '.xlsx', '.pptx', '.keystore', '.pem', '.p12', '.pfx']);
const signatures = [
  ['Google-API-key-shaped value', /\bAIza[A-Za-z0-9_-]{35}\b/],
  ['GitHub-token-shaped value', /\b(?:gh[pousr]_[A-Za-z0-9_]{25,}|github_pat_[A-Za-z0-9_]{25,})\b/],
  ['AWS-key-shaped value', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/]
];
let large = 0;
for (const file of paths) {
  // Do not interpret this scanner's signature definitions as findings.
  if (file === 'scripts/check-public-release.mjs') continue;
  if (isEnv(file)) add(file, 'tracked real environment file');
  if (/(^|\/)(?:service.?account|private.?key|credential)[^/]*\.(?:json|pem|key|p12|pfx)$/i.test(file)) {
    add(file, 'credential-named file');
  }
  if (file.startsWith('Exam-Notes/')) add(file, 'unapproved exam/course material');
  if (file.startsWith('migrated_prompt_history/')) add(file, 'private prompt history');
  if (documentExt.has(extname(file).toLowerCase())) {
    add(file, 'document rights and metadata require review');
    continue;
  }
  try {
    if (statSync(file).size > 6_000_000) { large++; continue; }
    const buffer = readFileSync(file);
    if (buffer.includes(0)) continue;
    const source = buffer.toString('utf8');
    for (const [kind, pattern] of signatures) {
      if (pattern.test(source)) add(file, kind);
    }
    if (/(?:isLegacyBootstrapAdmin|SUPER_ADMIN_EMAIL)/.test(source) &&
      /(?:request\.auth\.token\.email|SUPER_ADMIN_EMAIL)/.test(source)) {
      add(file, 'fixed-email administrator privilege');
    }
  } catch {
    add(file, 'unreadable tracked file');
  }
}
const unique = [...new Map(findings.map(x => [x.file + x.category, x])).values()];
for (const item of unique.slice(0, 24)) {
  process.stderr.write('BLOCKED ' + item.category + ' in ' + item.file + '\n');
}
if (unique.length > 24) {
  process.stderr.write('BLOCKED ' + (unique.length - 24) + ' additional tracked-file findings\n');
}
if (large) process.stderr.write('NOTICE: ' + large + ' large tracked files were not scanned\n');
if (unique.length) {
  process.stderr.write('Pre-publication check failed: ' + unique.length + ' findings.\n');
  process.exitCode = 1;
} else {
  process.stdout.write('Tracked-source preflight passed; history, binaries, rights and deployed config still require review.\n');
}