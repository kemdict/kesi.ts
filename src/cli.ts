import { Ku } from "./index.ts";
import { parseArgs } from "node:util";

function main() {
  const parsedArgs = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      help: { type: "boolean", short: "h" },
    },
  });
  if (parsedArgs.values.help) {
    console.log(`npx @kemdict/kesi <options>

Convert lines from standard input into KIP or POJ.

Options:
  --input <file>, -i <file>: take input from <file> instead of stdin
  --output <file>, -o <file>: write to <file> instead of stdout
  --to <kip|poj>: convert input to KIP or POJ
  --count: count the number of syllables
`);
    process.exit(0);
  }
}

main();
