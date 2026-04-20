import { KHIN_SIANN_HU } from '../butkian/kongiong.ts';
import { thiah, tshiau_tuasiosia, SuSiaTshoNgoo } from './kongke.ts';

export function tsuanPOJ(bun: string): string {
  const si_khinsiann = bun.startsWith(KHIN_SIANN_HU);
  let processedBun = bun;
  if (si_khinsiann) {
    processedBun = processedBun.replace(KHIN_SIANN_HU, '');
  }
  try {
    const [siann, un, tiau, tuasiosia] = thiah(processedBun);
    const poj = kapPOJ(siann, un, tiau);
    let kiatko = tshiau_tuasiosia(tuasiosia, poj);
    if (si_khinsiann) {
      kiatko = `--${kiatko}`;
    }
    return kiatko;
  } catch (e) {
    if (e instanceof SuSiaTshoNgoo) {
      return bun;
    }
    throw e;
  }
}

export function kapPOJ(siann: string, un: string, tiau: string): string {
  return 臺羅數字調轉白話字.轉白話字(siann, un, tiau).normalize('NFC');
}

export class 臺羅數字調轉白話字 {
  static 轉白話字(聲: string, 韻: string, 調: string): string {
    const 白話字聲 = this.轉白話字聲(聲);
    const 白話字韻 = this.轉白話字韻(韻);
    const 白話字調 = this.轉白話字調(調);
    const 白話字傳統調韻 = this.白話字韻標傳統調(白話字韻, 白話字調);
    return 白話字聲 + 白話字傳統調韻;
  }

  static 轉白話字聲(聲: string): string {
    if (聲 === 'ts') {
      return 'ch';
    } else if (聲 === 'tsh') {
      return 'chh';
    } else {
      return 聲;
    }
  }

  static 轉白話字韻(un: string): string {
    return un
      .replace(/nn/g, 'ⁿ')
      .replace(/oo/g, 'o͘')
      .replace(/ua/g, 'oa')
      .replace(/ue/g, 'oe')
      .replace(/ing/g, 'eng')
      .replace(/ik/g, 'ek');
  }

  static 轉白話字調(tiau: string): string {
    // ă a̋
    return tiau.replace('\u030b', '\u0306');
  }

  static 白話字韻標傳統調(白話字韻無調: string, 調: string): string {
    let 該標調的字 = '';
    if (白話字韻無調.includes('o͘')) {
      該標調的字 = 'o͘';
    } else if (/(iau)|(oai)/.test(白話字韻無調)) {
      該標調的字 = 'a';
    } else if (/[aeiou]{2}/.test(白話字韻無調)) {
      if (白話字韻無調[0] === 'i') {
        該標調的字 = 白話字韻無調[1];
      } else if (白話字韻無調[1] === 'i') {
        該標調的字 = 白話字韻無調[0];
      } else if (白話字韻無調.length === 2) {
        該標調的字 = 白話字韻無調[0];
      } else if (白話字韻無調.endsWith('ⁿ') && !白話字韻無調.endsWith('hⁿ')) {
        該標調的字 = 白話字韻無調[0];
      } else {
        該標調的字 = 白話字韻無調[1];
      }
    } else if (/[aeiou]/.test(白話字韻無調)) {
      該標調的字 = 白話字韻無調[0];
    } else if (白話字韻無調.includes('ng')) {
      該標調的字 = 'n';
    } else if (白話字韻無調.includes('m')) {
      該標調的字 = 'm';
    }
    return this.加上白話字調符(白話字韻無調, 該標調的字, 調);
  }

  static 加上白話字調符(白話字韻無調: string, 標調字母: string, 調: string): string {
    if (標調字母 === '') return 白話字韻無調;
    return 白話字韻無調.replace(標調字母, 標調字母 + 調);
  }
}
