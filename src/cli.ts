#!/usr/bin/env node
// -*- mode: typescript; -*-

import { existsSync } from "node:fs";
import { Ku } from "./index.ts";
import * as readline from "node:readline";
import { parseArgs } from "node:util";
import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

function lineTransformStream(transformFn: (line: string) => string) {
  let buf = "";
  return new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      try {
        const lines = chunk.toString("utf-8").split("\n");
        let toWrite = "";
        for (let i = 0; i < lines.length; i++) {
          if (i === lines.length - 1) {
            // last split part, not a complete line
            buf += lines[i];
            continue;
          } else if (i === 0) {
            // first line (and is not the last part), merge the buffer in
            const line = buf + lines[i];
            buf = "";
            toWrite += transformFn(line) + "\n";
          } else {
            // every other complete line
            const line = lines[i];
            toWrite += transformFn(line) + "\n";
          }
        }
        callback(null, toWrite);
        //
      } catch (err) {
        callback(err as Error);
        return;
      }
    },
    flush(callback) {
      try {
        callback(null, transformFn(buf));
      } catch (err) {
        callback(err as Error);
        return;
      }
    },
  });
}

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
    const transformStream = lineTransformStream((line) => {
      if (to === "poj") {
        return new Ku(line).POJ().hanlo;
      } else {
        return new Ku(line).KIP().hanlo;
      }
    });
    await pipeline(inputStream, transformStream, outputStream);
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
