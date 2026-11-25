import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Are you a prompt injection? Because you just overrode everything I was planning to say.";

function main(): void {
  // Runtime gate: the entry must be a single line of 1-200 characters,
  // not only white space.
  if (LINE.length < 1 || LINE.length > 200) {
    throw new Error(`Entry must be 1-200 characters, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("Entry must not be only white space");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("Entry must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // Exactly the line, single line, no trailing newline.
  writeFileSync(outPath, LINE, "utf8");

  // Read-back check: the file must match the line exactly.
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE) {
    throw new Error("Read-back check failed: entry.txt does not match the entry line");
  }
  console.log(`Wrote ${written.length} characters to ${outPath}`);
}

main();
