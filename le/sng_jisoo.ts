import * as readline from "node:readline";
import { stdin } from "node:process";

import { Ku } from "../src/index.ts";

async function sng() {
  const rl = readline.createInterface(stdin);
  for await (const line of rl) {
    let jisoo = [...new Ku(line.trimEnd()).thianji()].length;
    console.log(`字數=${jisoo}`);
  }
}

await sng();
