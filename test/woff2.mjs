// Reads the name table of a WOFF2 font with no dependency. WOFF2 stores the name table with no
// transform inside one Brotli stream, so node:zlib is enough. Spec: https://www.w3.org/TR/WOFF2/
import { readFileSync } from 'node:fs';
import { brotliDecompressSync } from 'node:zlib';

// The fonts are files in this repository. A stream that expands past this size is not a font.
const MAX_TABLE_BYTES = 8 * 1024 * 1024;

// Table tags in the order of the WOFF2 known-tag index (spec section 5.1).
const KNOWN_TAGS = (
  'cmap head hhea hmtx maxp name OS/2 post cvt_ fpgm glyf loca prep CFF_ VORG EBDT EBLC gasp ' +
  'hdmx kern LTSH PCLT VDMX vhea vmtx BASE GDEF GPOS GSUB EBSC JSTF MATH CBDT CBLC COLR CPAL ' +
  'SVG_ sbix acnt avar bdat bloc bsln cvar fdsc feat fmtx fvar gvar hsty just lcar mort morx ' +
  'opbd prop trak Zapf Silf Glat Gloc Feat Sill'
)
  .split(' ')
  .map((tag) => tag.replace('_', ' '));

export function readBase128(buf, pos) {
  let value = 0;
  for (let i = 0; i < 5; i++) {
    const byte = buf[pos.at++];
    if (i === 0 && byte === 0x80) throw new Error('UIntBase128 has a leading zero byte');
    value = value * 128 + (byte & 0x7f);
    if ((byte & 0x80) === 0) return value;
  }
  throw new Error('UIntBase128 is longer than 5 bytes');
}

function isTransformed(tag, version) {
  return tag === 'glyf' || tag === 'loca' ? version !== 3 : version !== 0;
}

function tableData(buf, wantedTag) {
  if (buf.toString('latin1', 0, 4) !== 'wOF2') throw new Error('not a WOFF2 file');
  const numTables = buf.readUInt16BE(12);
  const compressedSize = buf.readUInt32BE(20);
  const pos = { at: 48 };
  let offset = 0;
  let found;
  for (let i = 0; i < numTables; i++) {
    const flags = buf[pos.at++];
    let tag = KNOWN_TAGS[flags & 0x3f];
    if ((flags & 0x3f) === 63) {
      tag = buf.toString('latin1', pos.at, pos.at + 4);
      pos.at += 4;
    }
    const origLength = readBase128(buf, pos);
    const length = isTransformed(tag, flags >> 6) ? readBase128(buf, pos) : origLength;
    if (tag === wantedTag) found = { offset, length };
    offset += length;
  }
  if (!found) throw new Error(`no ${wantedTag} table`);
  const data = brotliDecompressSync(buf.subarray(pos.at, pos.at + compressedSize), {
    maxOutputLength: MAX_TABLE_BYTES,
  });
  return data.subarray(found.offset, found.offset + found.length);
}

function decode(bytes, platformID) {
  if (platformID === 1) return bytes.toString('latin1');
  let text = '';
  for (let i = 0; i + 1 < bytes.length; i += 2) text += String.fromCharCode(bytes.readUInt16BE(i));
  return text;
}

/** Returns the name records of a WOFF2 font as `{ nameID, platformID, text }`. */
export function readNameRecords(path) {
  const name = tableData(readFileSync(path), 'name');
  const count = name.readUInt16BE(2);
  const stringOffset = name.readUInt16BE(4);
  const records = [];
  for (let i = 0; i < count; i++) {
    const at = 6 + i * 12;
    const platformID = name.readUInt16BE(at);
    const nameID = name.readUInt16BE(at + 6);
    const length = name.readUInt16BE(at + 8);
    const start = stringOffset + name.readUInt16BE(at + 10);
    records.push({
      nameID,
      platformID,
      text: decode(name.subarray(start, start + length), platformID),
    });
  }
  return records;
}

/** Returns the typographic family name (name ID 16) or else the family name (name ID 1). */
export function familyName(path) {
  const records = readNameRecords(path);
  const pick = (id) => records.find((r) => r.nameID === id && r.platformID === 3)?.text;
  return pick(16) ?? pick(1);
}
