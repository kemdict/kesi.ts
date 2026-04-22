export const LIAN_JI_HU = "-";
export const KHIN_SIANN_HU = "--";

// prettier-ignore
const 句中標點符號 = new Set([
  "、", "﹑", "､", "-", "—", "~", "～", "·", "‧",
  "'", "＇", '"', "‘", "’", "“", "”", "〝", "〞", "′", "‵",
  "「", "」", "｢", "｣", "『", "』", "【", "】", "〈", "〉",
  "《", "》", "（", "）", "＜", "＞", "(", ")", "<", ">",
  "[", "]", "{", "}", "+", "*", "/", "=", "^", "＋", "－",
  "＊", "／", "＝", "$", "#", ":", "：", "﹕", "–", "—",
  "―", "─", "──", "｜", "︱", "•",
]);

// > 斷句是考慮著翻譯，閣有語音合成愛做的正規化
// https://github.com/i3thuan5/KeSi/blob/master/kesi/butkian/kongiong.py#L23
// prettier-ignore
const 斷句標點符號 = new Set([
  "\n", "，", "。", "．", "！", "？", "…", "……",
  "...", ",", ".", "!", "?", "﹐", "﹒", "﹗", "﹖",
  ";", "；", "﹔",
]);

export const 聲調符號 = new Set(
  // prettier-ignore
  [
    // Hakka tones
    /* "", */ "ˊ", "ˋ", "ˇ", "+", "^",
    // Taigi tones, 0~10
    "˙", /* "", */ "ˋ", "˪", /* "", */ "ˊ", "˫", "˫", "㆐", "^", "㆐",
],
);

export const 標點符號 = new Set([...句中標點符號, ...斷句標點符號]);

// All Ideographic Description Characters, including the new ones added in
// Unicode 15.1: U+2FFC~U+2FFF and the two other characters that don't fit in
// the block (U+303E, U+31EF).
export const 組字式符號 = "⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻⿼⿽⿾⿿〾㇯";

export function si_lomaji(char: string): boolean {
  return 敢是拼音字元(char) || /^[0-9]$/.test(char);
}

export function 敢是拼音字元(字元: string): boolean {
  if (字元 === "ⁿ" || 字元 === "'" || 字元 === "_" || 字元 === "ᴺ") {
    return true;
  }
  // Check for Ll, Lu, Mn using regex Unicode property escapes
  // \p{L} is Letter, \p{Ll} is lowercase letter, \p{Lu} is uppercase letter
  // \p{Mn} is Nonspacing Mark (accents)
  return (
    /^\p{Ll}$/u.test(字元) || /^\p{Lu}$/u.test(字元) || /^\p{Mn}$/u.test(字元)
  );
}

export function 敢是注音符號(字元: string): boolean {
  // Bopomofo: U+3100–U+312F, Bopomofo Extended: U+31A0–U+31BF
  const code = 字元.charCodeAt(0);
  return (
    (code >= 0x3100 && code <= 0x312f) || (code >= 0x31a0 && code <= 0x31bf)
  );
}

export function normalize_taibun(taibun: string): string {
  // Replace non-printable characters
  let result = taibun.replace(
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g,
    " ",
  );
  // Replace old MOE private characters with their counterparts in Unicode
  for (const [ji_kautian, ji_unicode] of Object.entries({
    "\uE701": "\u{2A736}", // 𪜶
    "\uF5E9": "\u{2B74F}", // 𫝏
    "\uE35C": "\u{2B75B}", // 𫝛
    "\uF5EA": "\u{2B77A}", // 𫝺
    "\uF5EE": "\u{2B77B}", // 𫝻
    "\uE703": "\u{2B7BC}", // 𫞼
    "\uF5EF": "\u{2B7C2}", // 𫟂
    "\uE705": "\u{2C9B0}", // 𬦰
    "\uF5E7": "\u{308FB}", // 𰣻
  })) {
    result = result.replaceAll(ji_kautian, ji_unicode);
  }
  return result.normalize("NFC");
}
