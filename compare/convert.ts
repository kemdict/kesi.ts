import * as readline from "node:readline";
import { stdin } from "node:process";
import { parseArgs } from "node:util";

import { Ku } from "../src/index.ts";

async function convert(to: "poj" | "kip" | "tl") {
  const rl = readline.createInterface(stdin);
  if (to === "poj") {
    for await (const line of rl) {
      console.log(new Ku(line.trimEnd()).POJ().hanlo);
    }
  } else {
    for await (const line of rl) {
      console.log(new Ku(line.trimEnd()).KIP().hanlo);
    }
  }
}

async function main() {
  const parsedArgs = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      help: { type: "boolean", short: "h" },
    },
  });
  if (parsedArgs.values.help) {
    console.log(`./convert.ts <kip|poj>

Convert lines from standard input into KIP or POJ.`);
    process.exit(0);
  }

  const to = parsedArgs.positionals[0];
  if (!to) {
    console.log("TO must be provided");
    process.exit(1);
  }
  if (!["poj", "kip", "tl"].includes(to)) {
    console.log("TO must be one of kip or poj");
    process.exit(1);
  }
  await convert(to as "poj" | "kip" | "tl");
}

await main();
