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

/** Return whether `char` counts as lomaji. */
export function si_lomaji(char: string): boolean {
  return 敢是拼音字元(char) || /^[0-9]$/.test(char);
}

export function 敢是拼音字元(char: string): boolean {
  return (
    char === "ⁿ" ||
    char === "'" ||
    char === "_" ||
    char === "ᴺ" ||
    // Check for Ll, Lu, Mn using regex Unicode property escapes
    // \p{L} is Letter, \p{Ll} is lowercase letter, \p{Lu} is uppercase letter
    // \p{Mn} is Nonspacing Mark (accents)
    // Ll: 小寫, Lu: 大寫, Mn: 有調號英文
    /^[\p{Ll}\p{Lu}\p{Mn}]$/v.test(char)
  );
}

export function 敢是注音符號(char: string): boolean {
  // NOTE: this is slightly different from i3thuan5/KeSi: they test if the
  // character has a name that starts with "BOPOMOFO LETTER", which excludes
  // BOPOMOFO FINAL LETTER characters. That sounds unintentional to me.
  return /^\p{Script=Bopomofo}$/v.test(char);
}

/**
 * Normalize Taigi text.
 * Get rid of non-printable characters, replace old private codepoints with
 * their Unicode codepoints, then return the result in NFC normalization form.
 */
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
