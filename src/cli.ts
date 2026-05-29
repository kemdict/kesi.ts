import { Ku } from "./index.ts";
import * as readline from "node:readline";
import { parseArgs } from "node:util";

function err(msg: string) {
  console.error(msg);
  process.exit(1);
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
    if (!["kip", "poj", "tl"].includes(parsedArgs.values.to!)) {
      err('--to needs to be either "kip" or "poj"');
    }
    const to = parsedArgs.values.to as "kip" | "poj" | "tl";
    const rl = readline.createInterface(process.stdin);
    for await (const line of rl) {
      if (to === "poj") {
        process.stdout.write(new Ku(line).KIP().hanlo);
      } else {
        process.stdout.write(new Ku(line).POJ().hanlo);
      }
    }
  } else if (parsedArgs.values.count) {
    if (!parsedArgs.values.to && !parsedArgs.values.count) {
      err("Either --to <kip|poj> or --count has to be specified");
    }
    // FIXME this counts commas as a syllable.
    // (The original sng_jisoo.py also does this)
    let count = 0;
    const rl = readline.createInterface(process.stdin);
    for await (const line of rl) {
      count += [...new Ku(line.trimEnd()).thianji()].length;
    }
    process.stdout.write(`${count}\n`);
  } else {
    err("Either --to <kip|poj> or --count has to be specified");
  }
}

await main();
