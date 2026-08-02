const WORDS_PER_MINUTE = 200;

/**
 * Entry bodies are raw MDX, so a naive whitespace split counts markup as prose:
 * a table separator row is one "word" per pipe and an import line is five.
 */
const NON_PROSE = [
  /```[\s\S]*?```/g, // fenced code blocks
  /~~~[\s\S]*?~~~/g,
  /^[ \t]*(?:import|export)[ \t].*$/gm, // MDX module syntax
  /<\/?[A-Za-z][^>]*>/g, // JSX and HTML tags
  /^[ \t]*\|[-:| \t]+\|[ \t]*$/gm, // table separator rows
];

/** Line-leading markdown syntax, which tokenizes as a word of its own. */
const LINE_MARKERS = /^[ \t]{0,3}(?:#{1,6}|>|[-*+]|\d+\.)[ \t]+/gm;

export function getReadingTime(body: string): number {
  const prose = NON_PROSE.reduce((text, pattern) => text.replace(pattern, ' '), body)
    .replace(LINE_MARKERS, '')
    .replace(/\|/g, ' ');

  const wordCount = prose.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
