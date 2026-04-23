import { Given, Then, World } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { Ku } from "../../src/index.ts";

interface CustomWorld extends World {
  ku?: Ku;
}

Given("一句編碼是 {} ê字", function (this: CustomWorld, pianbe: string) {
  const bun = pianbe
    .split(",")
    .map((x) => String.fromCodePoint(parseInt(x, 16)))
    .join("");
  this.ku = new Ku(bun);
});

Then("書寫ê編碼是 {}", function (this: CustomWorld, pianbe: string) {
  const actual = Array.from(this.ku!.hanlo).map((ji) =>
    ji.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0"),
  );
  const expected = pianbe
    .split(",")
    .map((x) => x.toUpperCase().padStart(4, "0"));
  assert.deepEqual(actual, expected);
});

Then("書寫ê漢字mài變做 {}", function (this: CustomWorld, bun: string) {
  assert.ok(!this.ku!.hanlo.includes(bun));
});
