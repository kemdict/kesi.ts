import { KONGKE_SIANNBO, KONGKE_UNBO } from './pio';

export const SI_TSUAN_TUASIA = 'SI_TSUAN_TUASIA';
export const SI_TSUAN_SIOSIA = 'SI_TSUAN_SIOSIA';
export const SI_THAU_TUASIA = 'SI_THAU_TUASIA';

export const TIAUHO_TIAUHU_PIO: Record<string, string> = {
  '1': '',
  '2': '\u0301',
  '3': '\u0300',
  '4': '',
  '5': '\u0302',
  '6': '\u030c',
  '7': '\u0304',
  '8': '\u030d',
  '9': '\u0306',
};

export class SuSiaTshoNgoo extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SuSiaTshoNgoo';
  }
}

export function khuann_tuasiosia(bun: string): string {
  const latin = bun.replace(/ⁿ/g, '');
  if (latin === latin.toLowerCase()) {
    return SI_TSUAN_SIOSIA;
  } else if (/^[A-Z]/.test(latin) && latin.slice(1) === latin.slice(1).toLowerCase()) {
    return SI_THAU_TUASIA;
  } else {
    return SI_TSUAN_TUASIA;
  }
}

export function tshiau_tuasiosia(tuasiosia: string, bun: string): string {
  if (tuasiosia === SI_TSUAN_TUASIA) {
    return bun.toUpperCase();
  } else if (tuasiosia === SI_TSUAN_SIOSIA) {
    return bun.toLowerCase();
  } else {
    // capitalize
    return bun.charAt(0).toUpperCase() + bun.slice(1).toLowerCase();
  }
}

export function thiah(lomaji: string): [string, string, string, string] {
  const [siannun, tiau] = theh_sianntiau(lomaji);

  const siannun_n = thong_n(siannun);
  const tuasiosia = khuann_tuasiosia(siannun_n);

  const siannun_se = siannun_n.toLowerCase();
  const kongke = tsuan_kongke(siannun_se);
  const [siann, un] = thiah_siannun(kongke);
  return [siann, un, tiau, tuasiosia];
}

export function theh_sianntiau(lomaji: string): [string, string] {
  const nfd = lomaji.normalize('NFD');
  // Numerical tone
  const lastChar = nfd.slice(-1);
  if (lastChar in TIAUHO_TIAUHU_PIO) {
    return [nfd.slice(0, -1), TIAUHO_TIAUHU_PIO[lastChar]];
  }
  // Traditional tone
  const pitui = /[\u0301\u0300\u0302\u030c\u0304\u030d\u030b\u0306]/.exec(nfd);
  let tiau = '';
  if (pitui) {
    tiau = pitui[0];
  }
  const siannun = nfd.replace(tiau, '');
  return [siannun, tiau];
}

export function thong_n(siannun: string): string {
  let phinnim = siannun.replace(/([a-z])(N)(h?)/gi, (match, p1, p2, p3) => {
    // In Python it was re.sub('([a-z])(N)(h?)', r'\1ⁿ\3', siannun)
    // The 'i' flag is not there in python, but siannun might be mixed case
    // Actually Python code: phinnim = re.sub('([a-z])(N)(h?)', r'\1ⁿ\3', siannun)
    // It matches lowercase letter followed by uppercase N.
    return p1 + 'ⁿ' + p3;
  });
  phinnim = phinnim.replace(/ᴺ/g, 'ⁿ');
  return phinnim;
}

export function tsuan_kongke(siannun: string): string {
  return siannun
    .replace(/ch/g, 'ts')
    .replace(/ou/g, 'oo')
    .replace(/o͘/g, 'oo')
    .replace(/ⁿ/g, 'nn')
    .replace(/oa/g, 'ua')
    .replace(/oe/g, 'ue')
    .replace(/eng/g, 'ing')
    .replace(/ek/g, 'ik')
    .replace(/oonn/g, 'onn');
}

export function thiah_siannun(無調號音標: string): [string, string] {
  for (let 所在 = 0; 所在 <= 無調號音標.length; 所在++) {
    const 聲母 = 無調號音標.slice(0, 所在);
    if (KONGKE_SIANNBO.has(聲母.toLowerCase())) {
      const 韻母 = 無調號音標.slice(所在);
      if (KONGKE_UNBO.has(韻母.toLowerCase())) {
        return [聲母, 韻母];
      }
    }
  }
  throw new SuSiaTshoNgoo(`Bô tsit-khuán im-tsiat: ${無調號音標}`);
}
