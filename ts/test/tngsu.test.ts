import { describe, it, expect } from "vitest";
import { Ku } from "../src/butkian/ku.ts";

describe("TshiTngSu", () => {
  const check = (語句: string, 詞: string[]) => {
    const ku = new Ku(語句);
    const kiatko = Array.from(ku).map((su) => su.hanlo);
    expect(kiatko).toEqual(詞);
  };

  it("test_全羅看有黏做伙無決定斷詞", () => {
    check("Guan2 tsit4-ma2", ["Guan2", "tsit4-ma2"]);
  });

  it("test_全羅輕聲看有黏做伙無決定斷詞", () => {
    check("Mi̍h-kiānn phah-bô--khì --ah", ["Mi̍h-kiānn", "phah-bô--khì", "--ah"]);
  });

  it("test_漢羅黏做伙bôkāng詞", () => {
    check("媠koo-niû", ["媠", "koo-niû"]);
  });

  it("test_漢羅分開2詞", () => {
    check("媠 koo-niû", ["媠", "koo-niû"]);
  });

  it("test_漢羅做伙", () => {
    check("台文通訊Bóng報好看", ["台文通訊", "Bóng", "報好看"]);
  });

  it("test_漢羅輕聲", () => {
    check("阿菊姨--ā", ["阿菊姨--ā"]);
  });

  it("test_漢字看有黏做伙無決定斷詞", () => {
    check("媠 姑娘", ["媠", "姑娘"]);
  });

  it("test_漢字輕聲就當作無仝詞", () => {
    check("好 --矣", ["好", "--矣"]);
  });

  it("test_輕聲詞中央可能有重音詞", () => {
    check("有--ê-無--ê", ["有--ê-無--ê"]);
  });

  it("test_輕聲符無", () => {
    check("有--ê無--ê", ["有--ê", "無--ê"]);
  });

  it("test_漢字知影有輕聲猶原一個詞", () => {
    check("害--矣--啦", ["害--矣--啦"]);
  });

  it("test_全漢連續輕聲", () => {
    check("緊--出-來--啦", ["緊--出-來--啦"]);
  });

  it("test_漢字濟字輕聲混合201802p13", () => {
    check("想--起-來就", ["想--起-來", "就"]);
  });

  it("test_漢字濟字輕聲混合201802p13接羅馬字", () => {
    check("想--起-來tō ē", ["想--起-來", "tō", "ē"]);
  });

  it("test_漢字濟字輕聲混合201802p13句尾", () => {
    check("想--起-來tō", ["想--起-來", "tō"]);
  });

  it("test_句中輕聲無連做伙嘛會使", () => {
    check("講會出--來", ["講會出--來"]);
  });

  it("test_句中輕聲kah4後壁無連做伙嘛會使", () => {
    check("講--出-來", ["講--出-來"]);
  });

  it("test_組字當作漢字", () => {
    check("癩⿸疒哥人", ["癩⿸疒哥人"]);
  });

  it("test_標點愛分開", () => {
    check("我愛「白話字」！", ["我愛", "「", "白話字", "」", "！"]);
  });

  it("test_漢字佮算式", () => {
    check("所以是5 - 3 = 2!", ["所以是", "5", "-", "3", "=", "2", "!"]);
  });

  it("test_時間符號", () => {
    check("伊18:30會來", ["伊", "18", ":", "30", "會來"]);
  });

  it("test_濟字連字號尾", () => {
    check(" tsio1-sian3 - ", ["tsio1-sian3", "-"]);
  });

  it("test_臺羅刪節號", () => {
    check("Pang-liau5 hi5-kang2...", ["Pang-liau5", "hi5-kang2", "..."]);
  });

  it("test_漢字刪節號", () => {
    check("枋寮漁港……", ["枋寮漁港", "……"]);
  });

  it("test_tab當做空白", () => {
    check("\t千金小姐\ttshian1-kim1-sio2-tsia2\t", [
      "千金小姐",
      "tshian1-kim1-sio2-tsia2",
    ]);
  });

  it("test_UTF16", () => {
    check("𪜶", ["𪜶"]);
  });

  it("test_錯誤ê連字符", () => {
    check("----你", ["-", "-", "-", "-", "你"]);
  });
});
