import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appSource = readFileSync(resolve(scriptDir, "../dist/app.js"), "utf8");
const pythonCommand = process.argv[2] || (process.platform === "win32" ? "python" : "python3");

const challengePattern = /id: "([^"]+)"[\s\S]*?coreSolution: String\.raw`([\s\S]*?)`,\s+acmSolution: String\.raw`([\s\S]*?)`,\s+tests: String\.raw`([\s\S]*?)`,\s+sampleInput: "((?:[^"\\]|\\.)*)",\s+expectedOutput: "((?:[^"\\]|\\.)*)"/g;
const challenges = [...appSource.matchAll(challengePattern)];

if (challenges.length !== 5) {
  console.error(`Expected 5 challenges, found ${challenges.length}.`);
  process.exit(1);
}

let failed = false;

for (const match of challenges) {
  const [, id, coreSolution, acmSolution, tests, encodedInput, encodedOutput] = match;
  const sampleInput = JSON.parse(`"${encodedInput}"`) + "\n";
  const expectedOutput = JSON.parse(`"${encodedOutput}"`).trim().replace(/\r\n/g, "\n");

  const coreRun = spawnSync(pythonCommand, ["-c", `${coreSolution}\n\n${tests}`], {
    encoding: "utf8",
    env: { ...process.env, PYTHONIOENCODING: "utf-8" },
  });

  if (coreRun.status !== 0) {
    failed = true;
    console.error(`✗ ${id} core tests failed\n${coreRun.error?.message || coreRun.stderr || "Unknown error"}`);
    continue;
  }

  const acmRun = spawnSync(pythonCommand, ["-c", acmSolution], {
    input: sampleInput,
    encoding: "utf8",
    env: { ...process.env, PYTHONIOENCODING: "utf-8" },
  });
  const actualOutput = acmRun.stdout.trim().replace(/\r\n/g, "\n");

  if (acmRun.status !== 0 || actualOutput !== expectedOutput) {
    failed = true;
    console.error(`✗ ${id} ACM test failed`);
    console.error(acmRun.stderr || `Expected:\n${expectedOutput}\nActual:\n${actualOutput}`);
    continue;
  }

  console.log(`✓ ${id}: core + ACM`);
}

if (failed) process.exit(1);
console.log("All challenge references passed.");
