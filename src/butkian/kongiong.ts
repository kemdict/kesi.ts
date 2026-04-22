export const LIAN_JI_HU = "-";
export const KHIN_SIANN_HU = "--";

// prettier-ignore
export const 句中標點符號 = new Set([
  "、", "﹑", "､", "-", "—", "~", "～", "·", "‧",
  "'", "＇", '"', "‘", "’", "“", "”", "〝", "〞", "′", "‵",
  "「", "」", "｢", "｣", "『", "』", "【", "】", "〈", "〉",
  "《", "》", "（", "）", "＜", "＞", "(", ")", "<", ">",
  "[", "]", "{", "}", "+", "*", "/", "=", "^", "＋", "－",
  "＊", "／", "＝", "$", "#", ":", "：", "﹕", "–", "—",
  "―", "─", "──", "｜", "︱", "•",
]);

// prettier-ignore
export const 斷句標點符號 = new Set([
  "\n", "，", "。", "．", "！", "？", "…", "……",
  "...", ",", ".", "!", "?", "﹐", "﹒", "﹗", "﹖",
  ";", "；", "﹔",
]);

export const HAGFA_TIAU = new Set(["", "ˊ", "ˋ", "ˇ", "+", "^"]);
export const NGOO_SIU_LE: Record<string, string> = {
  "0": "˙",
  "1": "",
  "2": "ˋ",
  "3": "˪",
  "4": "",
  "5": "ˊ",
  "6": "˫",
  "7": "˫",
  "8": "㆐",
  "9": "^",
  "10": "㆐",
};

const siannTiauValues = new Set([...HAGFA_TIAU, ...Object.values(NGOO_SIU_LE)]);
siannTiauValues.delete("");
export const 聲調符號 = siannTiauValues;

export const 標點符號 = new Set([...句中標點符號, ...斷句標點符號]);

export const 組字式符號 = "⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻⿿";

export function si_lomaji(jiguan: string): boolean {
  return 敢是拼音字元(jiguan) || /^[0-9]$/.test(jiguan);
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
