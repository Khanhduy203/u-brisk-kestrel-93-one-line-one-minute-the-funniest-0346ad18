"use strict";

const fs = require("fs");
const path = require("path");

const ENTRY =
  "I delegated the deadline to a subagent, who delegated it to another subagent, who just asked me what the deadline was.";

function checkEntry(text) {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("entry must be a non-empty string");
  }
  if (text.length > 200) {
    throw new Error("entry must be at most 200 characters, got " + text.length);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must contain non-whitespace characters");
  }
}

function main() {
  checkEntry(ENTRY);
  const envDir = process.env.MAKEFUN_OUTPUT_DIR;
  const outDir =
    envDir && envDir.length > 0
      ? envDir
      : path.join(__dirname, "output");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "entry.txt");
  fs.writeFileSync(outFile, ENTRY, "utf8");
  const written = fs.readFileSync(outFile);
  if (written.length !== Buffer.byteLength(ENTRY, "utf8")) {
    throw new Error(
      "written file byte length " +
        written.length +
        " does not match entry byte length " +
        Buffer.byteLength(ENTRY, "utf8")
    );
  }
  if (!written.equals(Buffer.from(ENTRY, "utf8"))) {
    throw new Error("written file content does not match entry");
  }
}

main();
