// The One-Line Cat Joke That Lands
// make.fun bounty: u-aldy998-the-one-line-cat-joke-that-lands-a7b18262
//
// The entry is a single joke about cats, one line under 200 characters,
// stored as a constant in this program. Running the program writes the
// joke into the harness output directory as entry.txt, then reads the
// copy back and checks it against the original byte for byte, so the
// two graded runs always produce identical output. No network is used
// and nothing is read from outside this repository: the joke is the
// deliverable.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke: one line, under 200 characters, setup and turn in one breath.
const JOKE =
  "My cat's 3 a.m. zoomies sound like a horse running upstairs, and I live in a one-story house.";

// The gate allows 1 to 200 characters of UTF-8 text, not only whitespace.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// The harness sets MAKEFUN_OUTPUT_DIR; without it, write to /output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputPath = join(outputDir, "entry.txt");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

// Count characters as code points, so the check matches the gate.
function charCount(text: string): number {
  return [...text].length;
}

// Check the joke before writing it: the length the gate allows, not
// only whitespace, no leading or trailing whitespace, and a single
// line, so a broken joke is refused instead of being submitted.
function checkJoke(joke: string): void {
  const length = charCount(joke);
  if (length < MIN_CHARS || length > MAX_CHARS) {
    fail(
      `joke must be ${MIN_CHARS} to ${MAX_CHARS} characters, ` +
        `got ${length}`,
    );
  }
  if (joke.trim().length === 0) {
    fail("joke must not be only whitespace");
  }
  if (joke !== joke.trim()) {
    fail("joke must not start or end with whitespace");
  }
  if (joke.includes("\n") || joke.includes("\r")) {
    fail("joke must be a single line");
  }
}

checkJoke(JOKE);
console.log(`Joke (${charCount(JOKE)} characters): ${JOKE}`);

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, JOKE, "utf8");

// Read the copy back and prove it matches the original byte for byte.
const written = readFileSync(outputPath, "utf8");
if (written !== JOKE) {
  fail(
    `copy mismatch: ${outputPath} is ${charCount(written)} characters, ` +
      `expected ${charCount(JOKE)}`,
  );
}

console.log(
  `Wrote ${Buffer.byteLength(written, "utf8")} bytes to ${outputPath} (byte-identical copy)`,
);
