#!/usr/bin/env node

import { existsSync } from "node:fs";
import { Ku } from "./index.ts";
import * as readline from "node:readline";
import { parseArgs } from "node:util";
import { createReadStream, createWriteStream } from "node:fs";

function err(msg: string) {
  console.error(msg);
  process.exit(1);
}

function getInputStream(path?: string) {
  if (!path) return process.stdin;
  if (path === "-") return process.stdin;
  if (!existsSync(path)) err("Failed to get input stream");
  return createReadStream(path);
}
function getOutputStream(path?: string) {
  if (!path) return process.stdout;
  if (path === "-") return process.stdout;
  return createWriteStream(path);
}

async function main() {
  const parsedArgs = parseArgs({
    args: process.argv.slice(2),
    options: {
      help: { type: "boolean", short: "h" },
      input: { type: "string", short: "i" },
      output: { type: "string", short: "o" },
      to: { type: "string" },
      count: { type: "boolean" },
    },
  });
  if (parsedArgs.values.help) {
    console.log(`npx @kemdict/kesi <options>

Convert lines from standard input into KIP or POJ.

Options:
  --input <file>, -i <file>: take input from <file> instead of stdin
  --output <file>, -o <file>: write to <file> instead of stdout
  --to <kip|poj>: convert input to KIP or POJ
  --count: count the number of syllables`);
    process.exit(0);
  }
  if (parsedArgs.values.to) {
    if (parsedArgs.values.count) {
      err("Please only specify either --to <kip|poj> or --count");
    }
    // silently accept "tl" as an alternative of "kip"
    if (!["kip", "poj", "tl"].includes(parsedArgs.values.to!)) {
      err('--to needs to be either "kip" or "poj"');
    }
    const to = parsedArgs.values.to as "kip" | "poj" | "tl";
    const inputStream = getInputStream(parsedArgs.values.input);
    const outputStream = getOutputStream(parsedArgs.values.output);
    const rl = readline.createInterface(inputStream);
    for await (const line of rl) {
      if (to === "poj") {
        outputStream.write(new Ku(line).POJ().hanlo);
      } else {
        outputStream.write(new Ku(line).KIP().hanlo);
      }
    }
  } else if (parsedArgs.values.count) {
    if (!parsedArgs.values.to && !parsedArgs.values.count) {
      err("Either --to <kip|poj> or --count has to be specified");
    }
    // FIXME this counts commas as a syllable.
    // (The original sng_jisoo.py also does this)
    let count = 0;
    const inputStream = getInputStream(parsedArgs.values.input);
    const outputStream = getOutputStream(parsedArgs.values.output);
    const rl = readline.createInterface(inputStream);
    for await (const line of rl) {
      count += [...new Ku(line.trimEnd()).thianji()].length;
    }
    outputStream.write(`${count}\n`);
  } else {
    err("Either --to <kip|poj> or --count has to be specified");
  }
}

await main();
