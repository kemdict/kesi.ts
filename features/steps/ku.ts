import { Given, When, Then, DataTable, World } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { Ku, TuiBeTse } from "../../src/butkian/ku.ts";

interface CustomWorld extends World {
  ku?: Ku;
}

Given(/^一句 (.+) 建立句仔$/, function (this: CustomWorld, bun: string) {
  this.ku = new Ku(bun);
});

Given(
  /^Kan-na傳 lomaji: (.+)建立句仔$/,
  function (this: CustomWorld, lomaji: string) {
    this.ku = new Ku(undefined, lomaji);
  },
);

Then("hanlo是 {}", function (this: CustomWorld, hanlo: string) {
  assert.equal(this.ku?.hanlo, hanlo);
});

Then("lomaji是 {}", function (this: CustomWorld, lomaji: string) {
  assert.equal(this.ku?.lomaji, lomaji);
});

Then("kiphanlo是 {}", function (this: CustomWorld, kiphanlo: string) {
  assert.equal(this.ku?.kiphanlo, kiphanlo);
});

Given(
  /^兩句 (.+) kah (.+) 做伙建立一 ê 句仔$/,
  function (this: CustomWorld, hanlo: string, lomaji: string) {
    // Strip quotes if present
    const h =
      hanlo.startsWith('"') && hanlo.endsWith('"') ? hanlo.slice(1, -1) : hanlo;
    const l =
      lomaji.startsWith('"') && lomaji.endsWith('"')
        ? lomaji.slice(1, -1)
        : lomaji;
    this.ku = new Ku(h, l);
  },
);

Then("詞仔是", function (this: CustomWorld, table: DataTable) {
  const expected = table.hashes();
  const actual = Array.from(this.ku!);
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < actual.length; i++) {
    assert.equal(actual[i].hanlo, expected[i].hanlo);
    assert.equal(actual[i].lomaji, expected[i].lomaji);
  }
});

Then("字仔是", function (this: CustomWorld, table: DataTable) {
  const expected = table.hashes();
  const actual = Array.from(this.ku!.thianji());
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < actual.length; i++) {
    assert.equal(actual[i].hanlo, expected[i].hanlo);
    assert.equal(actual[i].lomaji, expected[i].lomaji);
  }
});

Then(
  "詞仔 mā ē-tàng 提著字，像第{int}詞攏總{int}字，字仔是",
  function (this: CustomWorld, kui: number, jisoo: number, table: DataTable) {
    const su = this.ku!.get(kui);
    assert.equal(su.length, jisoo);
    const expected = table.hashes();
    const actual = Array.from(su);
    assert.equal(actual.length, expected.length);
    for (let i = 0; i < actual.length; i++) {
      assert.equal(actual[i].hanlo, expected[i].hanlo);
      assert.equal(actual[i].lomaji, expected[i].lomaji);
    }
  },
);

When(
  "{} kah {} 若欲對句仔會發錯誤",
  function (this: CustomWorld, hanlo: string, lomaji: string) {
    let u_tshongoo = false;
    try {
      new Ku(hanlo, lomaji);
    } catch (e) {
      if (e instanceof TuiBeTse) {
        u_tshongoo = true;
      }
    }
    assert.ok(u_tshongoo);
  },
);

Then("轉出KIP句，伊 ê hanlo是 {}", function (this: CustomWorld, hanlo: string) {
  assert.equal(this.ku?.KIP().hanlo, hanlo);
});

Then("轉出POJ句，伊 ê hanlo是 {}", function (this: CustomWorld, hanlo: string) {
  assert.equal(this.ku?.POJ().hanlo, hanlo);
});

Then("原本ê句仔猶原是 {}", function (this: CustomWorld, bun: string) {
  assert.equal(this.ku?.hanlo, bun);
});

Then(
  "轉出POJ句，伊 ê lomaji是 {}",
  function (this: CustomWorld, lomaji: string) {
    assert.equal(this.ku?.POJ().lomaji, lomaji);
  },
);

Then(
  "轉出KIP句，伊 ê lomaji是 {}",
  function (this: CustomWorld, lomaji: string) {
    assert.equal(this.ku?.KIP().lomaji, lomaji);
  },
);
