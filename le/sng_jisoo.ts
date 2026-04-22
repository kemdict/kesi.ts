import * as readline from "node:readline";
import { stdin, stdout } from "node:process";

import { Ku } from "../src/index.ts";

async function sng() {
  const rl = readline.createInterface(stdin);
  const prompt = "算字數：";
  stdout.write(prompt);
  for await (const line of rl) {
    let jisoo = [...new Ku(line.trimEnd()).thianji()].length;
    console.log(`字數=${jisoo}`);
    stdout.write(prompt);
  }
}

await sng();
