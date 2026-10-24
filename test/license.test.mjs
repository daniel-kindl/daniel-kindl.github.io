// The license files and package.json must agree: MIT for the code, CC BY 4.0 for the posts.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const root = join(import.meta.dirname, '..');
const read = (file) => readFileSync(join(root, file), 'utf8');
const pkg = JSON.parse(read('package.json'));

test('package.json declares the MIT license and stays private', () => {
  assert.equal(pkg.license, 'MIT');
  assert.equal(pkg.private, true);
});

test('LICENSE is the MIT text for Daniel Kindl and agrees with package.json', () => {
  const text = read('LICENSE');
  assert.match(text, /^MIT License\n/, 'LICENSE must start with the MIT License title');
  assert.match(text, /^Copyright \(c\) \d{4} Daniel Kindl$/m);
  assert.match(
    text,
    /Permission is hereby granted, free of charge, to any person obtaining a copy/,
  );
  assert.match(text, /THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND/);
  assert.equal(pkg.license, 'MIT', 'package.json license must match the LICENSE text');
});

test('LICENSE-CONTENT.md gives the posts CC BY 4.0 and names the exceptions', () => {
  const text = read('LICENSE-CONTENT.md');
  assert.ok(text.includes('src/content/writing'), 'it must name the folder of the posts');
  assert.ok(text.includes('CC BY 4.0'));
  assert.ok(text.includes('https://creativecommons.org/licenses/by/4.0/legalcode'));
  assert.ok(text.includes('Daniel Kindl'), 'it must name the person to credit');
  assert.match(text, /all rights reserved/i, 'it must say what stays all rights reserved');
  assert.ok(text.includes('SIL OFL 1.1'), 'it must say the fonts keep their own license');
});

test('the CC BY 4.0 license covers only posts: src/content/writing holds only .mdx files', () => {
  const files = readdirSync(join(root, 'src/content/writing'), { recursive: true });
  const other = files.filter((file) => !file.endsWith('.mdx'));
  assert.deepEqual(other, [], 'LICENSE-CONTENT.md must name any non-post file in this folder');
});
