import { Given, Then, World } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { Ku } from "../../src/index.ts";

interface CustomWorld extends World {
  ku?: Ku;
}

Given(/^一句 ((?!.* 建立句仔$).+)$/, function (this: CustomWorld, bun: string) {
  this.ku = new Ku(bun);
});

Then("書寫轉POJ會生做 {}", function (this: CustomWorld, poj: string) {
  const poj_ku = this.ku!.POJ();
  assert.equal(poj_ku.hanlo, poj);
  assert.equal(poj_ku.lomaji, poj);
});

Then("書寫轉KIP會生做 {}", function (this: CustomWorld, kip: string) {
  const tailo = this.ku!.KIP();
  assert.equal(tailo.hanlo, kip);
  assert.equal(tailo.lomaji, kip);
  assert.deepEqual(tailo, this.ku!.TL());
});
