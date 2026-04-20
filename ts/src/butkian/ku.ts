import {
  組字式符號,
  聲調符號,
  標點符號,
  敢是拼音字元,
  敢是注音符號,
  LIAN_JI_HU,
  si_lomaji,
  normalize_taibun
} from './kongiong';
import { Su } from './su';
import { Ji } from './ji';

export class TuiBeTse extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TuiBeTse';
  }
}

export class 解析錯誤 extends Error {
  constructor(message: string) {
    super(message);
    this.name = '解析錯誤';
  }
}

export class Ku {
  private _su: Su[];

  // Regular expressions from Python
  static readonly _切組物件分詞 = /(([^ ｜]*[^ ]｜[^ ][^ ｜]*) ?|[^ ]+)/g;
  static readonly _是空白 = /^[^\S\n]+$/;
  static readonly _是空白_global = /[^\S\n]+/g;
  static readonly _是數字 = new Set('0123456789'.split(''));
  static readonly _是多字元標點 = /^(\.\.\.)|(……)|(──)/;

  constructor(hanlo: string | null = null, lomaji: string | null = null) {
    let h = hanlo;
    let l = lomaji;
    if (h !== null) {
      h = normalize_taibun(h);
    }
    if (l !== null) {
      l = normalize_taibun(l);
    }

    if (h === null) {
      h = l;
      l = null;
    }

    if (h === null) {
      this._su = [];
    } else if (l === null) {
      const [tngji, tngji_khinsiann, si_bokangsu] = this._hunsik_tngji_tngsu(h);
      const [bun, khinsiann] = this._tngsu(tngji, tngji_khinsiann, si_bokangsu);
      this._su = this._bun_tsuan_sutin(bun, khinsiann);
    } else {
      const [tnghanlo] = this._hunsik_tngji_tngsu(h);
      const [tnglomaji, tngji_khinsiann, si_bokangsu] = this._hunsik_tngji_tngsu(l);

      if (tnghanlo.length !== tnglomaji.length) {
        throw new TuiBeTse(
          `Kù bô pênn tn̂g: Hanlo tn̂g ${tnghanlo.length} jī, m̄-koh lomaji tn̂g ${tnglomaji.length} jī`
        );
      }

      const [hanlo_tin] = this._tngsu(tnghanlo, tngji_khinsiann, si_bokangsu);
      const [lomaji_tin, khinsiann] = this._tngsu(tnglomaji, tngji_khinsiann, si_bokangsu);

      this._su = this._phe_tsuan_sutin(hanlo_tin, lomaji_tin, khinsiann);
    }
  }

  [Symbol.iterator]() {
    return this._su[Symbol.iterator]();
  }

  get length(): number {
    return this._su.length;
  }

  get(index: number): Su {
    return this._su[index];
  }

  equals(other: Ku): boolean {
    if (this._su.length !== other._su.length) return false;
    for (let i = 0; i < this._su.length; i++) {
      if (!this._su[i].equals(other._su[i])) return false;
    }
    return true;
  }

  private _bun_tsuan_sutin(bun_tin: string[][], khinsiann_tin: boolean[][]): Su[] {
    const sutin: Su[] = [];
    for (let i = 0; i < bun_tin.length; i++) {
      const tsitsu = bun_tin[i];
      const khinsiann = khinsiann_tin[i];
      const su = new Su();
      for (let j = 0; j < tsitsu.length; j++) {
        su.thiam(new Ji(tsitsu[j], null, khinsiann[j]));
      }
      sutin.push(su);
    }
    return sutin;
  }

  private _phe_tsuan_sutin(hanlo_tin: string[][], lomaji_tin: string[][], khinsiann_tin: boolean[][]): Su[] {
    const sutin: Su[] = [];
    for (let i = 0; i < hanlo_tin.length; i++) {
      const suhanlo_tin = hanlo_tin[i];
      const sulomaji_tin = lomaji_tin[i];
      const khinsiann = khinsiann_tin[i];
      const su = new Su();
      for (let j = 0; j < suhanlo_tin.length; j++) {
        su.thiam(new Ji(suhanlo_tin[j], sulomaji_tin[j], khinsiann[j]));
      }
      sutin.push(su);
    }
    return sutin;
  }

  get hanlo(): string {
    const bun: string[] = [];
    let ting_tsit_su_si_lomaji = false;
    for (const su of this._su) {
      const suhanlo = su.hanlo;
      if (ting_tsit_su_si_lomaji && si_lomaji(suhanlo[0])) {
        bun.push(' ');
      }
      bun.push(suhanlo);
      ting_tsit_su_si_lomaji = si_lomaji(suhanlo[suhanlo.length - 1]);
    }
    return bun.join('');
  }

  get lomaji(): string {
    const bun: string[] = [];
    let ting_tsit_su_si_lomaji = false;
    for (const su of this._su) {
      const sulomaji = su.lomaji;
      if (ting_tsit_su_si_lomaji && si_lomaji(sulomaji[0])) {
        bun.push(' ');
      }
      bun.push(sulomaji);
      ting_tsit_su_si_lomaji = si_lomaji(sulomaji[sulomaji.length - 1]);
    }
    return bun.join('');
  }

  get kiphanlo(): string {
    const bun: string[] = [];
    let ting_tsit_su_si_lomaji = false;
    for (const su of this._su) {
      const suhanlo = su.kiphanlo;
      if (ting_tsit_su_si_lomaji && si_lomaji(suhanlo[0])) {
        bun.push(' ');
      }
      bun.push(suhanlo);
      ting_tsit_su_si_lomaji = si_lomaji(suhanlo[suhanlo.length - 1]);
    }
    return bun.join('');
  }

  *thianji(): Generator<Ji> {
    for (const su of this._su) {
      yield* su;
    }
  }

  thiam(su: Su): void {
    this._su.push(su);
  }

  POJ(): Ku {
    const sin_ku = new Ku();
    for (const su of this._su) {
      sin_ku.thiam(su.POJ());
    }
    return sin_ku;
  }

  TL(): Ku {
    const sin_ku = new Ku();
    for (const su of this._su) {
      sin_ku.thiam(su.TL());
    }
    return sin_ku;
  }

  KIP = this.TL;

  private _tngsu(字陣列: string[], 輕聲陣列: boolean[], 佮後一个字無仝一个詞: (boolean | null)[]): [string[][], boolean[][]] {
    const 巢狀詞陣列: string[][] = [];
    const 巢狀輕聲陣列: boolean[][] = [];
    let 位置 = 0;
    while (位置 < 字陣列.length) {
      let 範圍 = 位置;
      while (範圍 < 佮後一个字無仝一个詞.length && !佮後一个字無仝一个詞[範圍]) {
        範圍 += 1;
      }
      範圍 += 1;
      巢狀詞陣列.push(字陣列.slice(位置, 範圍));
      巢狀輕聲陣列.push(輕聲陣列.slice(位置, 範圍));
      位置 = 範圍;
    }
    return [巢狀詞陣列, 巢狀輕聲陣列];
  }

  private _hunsik_tngji_tngsu(語句: string): [string[], boolean[], (boolean | null)[]] {
    const 狀態 = new _分析狀態();
    if (Ku._是空白.test(語句)) {
      return 狀態.分析結果();
    }
    let 頂一个字: string | null = null;
    let 頂一个是連字符 = false;
    let 頂一个是空白 = false;
    let 頂一个是輕聲符號 = false;
    let 頂一个是注音符號 = false;
    let 位置 = 0;
    while (位置 < 語句.length) {
      const 字 = 語句[位置];
      let 是連字符 = false;
      let 是空白 = false;
      let 是輕聲符號 = false;
      const 是注音符號 = 敢是注音符號(字);

      if (狀態.是組字模式()) {
        狀態.這馬字加一个字元(字);
        狀態.組字模型加一个字元(字);
        if (狀態.組字長度有夠矣未()) {
          狀態.這馬字好矣清掉囥入去字陣列();
          狀態.變一般模式();
        }
      } else if (狀態.是一般模式()) {
        // re.match is from current position
        const lianji_match = new RegExp(`^[${LIAN_JI_HU}]+`).exec(語句.slice(位置));
        if (lianji_match) {
          狀態.這馬字好矣清掉囥入去字陣列();
          const 分字長度 = lianji_match[0].length;
          if (分字長度 === 1) {
            if (!狀態.敢有分析資料矣() || 頂一个是空白) {
              狀態.字陣列直接加一字(LIAN_JI_HU);
              狀態.頂一字佮這馬的字無仝詞();
            } else {
              狀態.頂一字佮這馬的字仝詞();
              是連字符 = true;
              狀態.有連字符();
            }
          } else if (分字長度 === 2) {
            是輕聲符號 = true;
            狀態.這陣是輕聲詞();
            if (!頂一个是空白) {
              狀態.頂一字佮這馬的字仝詞();
            }
          } else {
            for (let i = 0; i < 分字長度; i++) {
              狀態.字陣列直接加一字(LIAN_JI_HU);
              狀態.頂一字佮這馬的字無仝詞();
            }
          }
          位置 += 分字長度 - 1;
        } else if (Ku._是空白.test(字)) {
          狀態.這馬字好矣清掉囥入去字陣列();
          狀態.頂一字佮這馬的字無仝詞();
          if (頂一个是連字符) {
            狀態.字陣列直接加一字(LIAN_JI_HU);
            狀態.頂一字佮這馬的字無仝詞();
          }
          if (頂一个是輕聲符號) {
            狀態.字陣列直接加一字(LIAN_JI_HU);
            狀態.頂一字佮這馬的字無仝詞();
            狀態.字陣列直接加一字(LIAN_JI_HU);
            狀態.頂一字佮這馬的字無仝詞();
          }
          是空白 = true;
        } else if (敢是拼音字元(字)) {
          if (頂一个字 !== null && !敢是拼音字元(頂一个字) && !Ku._是數字.has(頂一个字)) {
            狀態.這馬字好矣清掉囥入去字陣列();
            狀態.頂一字佮這馬的字無仝詞();
          }
          if (頂一个是輕聲符號) {
            狀態.這馬是輕聲字();
          }
          狀態.這馬字加一个字元(字);
        } else if (Ku._是數字.has(字)) {
          if (頂一个字 !== null && !Ku._是數字.has(頂一个字) && !敢是拼音字元(頂一个字) && !頂一个是注音符號) {
            狀態.這馬字好矣清掉囥入去字陣列();
            狀態.頂一字佮這馬的字無仝詞();
          }
          狀態.這馬字加一个字元(字);
        } else if (聲調符號.has(字) && 頂一个字 !== null && 敢是拼音字元(頂一个字)) {
          狀態.這馬字加一个字元(字);
        } else if (是注音符號) {
          if (頂一个字 !== null && !聲調符號.has(頂一个字) && !頂一个是注音符號) {
            狀態.這馬字好矣清掉囥入去字陣列();
          }
          狀態.這馬字加一个字元(字);
        } else if (聲調符號.has(字) && 頂一个是注音符號) {
          狀態.這馬字加一个字元(字);
        } else if (標點符號.has(字)) {
          const multi_match = Ku._是多字元標點.exec(語句.slice(位置));
          if (字 === '•' && 狀態.上尾敢是o結尾()) {
            狀態.這馬字加一个字元(字);
          } else if (multi_match) {
            const 符號 = multi_match[0];
            狀態.這馬字好矣清掉囥入去字陣列();
            狀態.頂一字佮這馬的字無仝詞();
            狀態.字陣列直接加一字(符號);
            狀態.頂一字佮這馬的字無仝詞();
            位置 += 符號.length - 1;
          } else {
            狀態.這馬字好矣清掉囥入去字陣列();
            狀態.頂一字佮這馬的字無仝詞();
            狀態.字陣列直接加一字(字);
            狀態.頂一字佮這馬的字無仝詞();
          }
        } else {
          if (狀態.這馬字敢全部攏數字()) {
            狀態.這馬字好矣清掉囥入去字陣列();
            狀態.頂一字佮這馬的字無仝詞();
          } else if (頂一个字 !== null && 敢是拼音字元(頂一个字)) {
            狀態.這馬字好矣清掉囥入去字陣列();
            狀態.頂一字佮這馬的字無仝詞();
          } else {
            狀態.這馬字好矣清掉囥入去字陣列();
          }
          if (頂一个是輕聲符號) {
            狀態.這馬是輕聲字();
          }
          狀態.這馬字加一个字元(字);
          if (組字式符號.includes(字)) {
            狀態.變組字模式();
          } else {
            狀態.這馬字好矣清掉囥入去字陣列();
          }
        }
      }
      位置 += 1;
      頂一个字 = 字;
      頂一个是連字符 = 是連字符;
      頂一个是空白 = 是空白;
      頂一个是輕聲符號 = 是輕聲符號;
      頂一个是注音符號 = 是注音符號;
    }
    if (狀態.這馬字敢閣有物件()) {
      if (狀態.是一般模式()) {
        狀態.這馬字好矣清掉囥入去字陣列();
      } else {
        throw new 解析錯誤(`語句組字式無完整，語句＝${語句}`);
      }
    }
    if (頂一个是連字符) {
      狀態.字陣列直接加一字(LIAN_JI_HU);
      狀態.頂一字佮這馬的字無仝詞();
    }
    if (頂一个是輕聲符號) {
      狀態.字陣列直接加一字(LIAN_JI_HU);
      狀態.頂一字佮這馬的字無仝詞();
      狀態.字陣列直接加一字(LIAN_JI_HU);
      狀態.頂一字佮這馬的字無仝詞();
    }
    return 狀態.分析結果();
  }
}

class _分析狀態 {
  private _字陣列: string[] = [];
  private _輕聲陣列: boolean[] = [];
  private _佮後一个字無仝一个詞: (boolean | null)[] = [];
  private _模式: '一般' | '組字' = '一般';
  private _組字長度: number = 0;
  private _這馬字: string = '';
  private _這馬是輕聲字: boolean = false;
  private _這陣是輕聲詞: boolean = false;
  private _這陣是輕聲詞_而且是輕聲詞ê一部份: boolean = false;

  constructor() {
    this.變一般模式();
  }

  分析結果(): [string[], boolean[], (boolean | null)[]] {
    return [this._字陣列, this._輕聲陣列, this._佮後一个字無仝一个詞];
  }

  敢有分析資料矣(): boolean {
    return this._字陣列.length > 0 || this.這馬字敢閣有物件();
  }

  這馬字敢閣有物件(): boolean {
    return this._這馬字 !== '';
  }

  這馬字敢全部攏數字(): boolean {
    return /^\d+$/.test(this._這馬字);
  }

  變一般模式(): void {
    this._模式 = '一般';
    this._組字長度 = 0;
  }

  變組字模式(): void {
    this._模式 = '組字';
    this._組字長度 = -1;
  }

  是一般模式(): boolean {
    return this._模式 === '一般';
  }

  是組字模式(): boolean {
    return this._模式 === '組字';
  }

  組字模型加一个字元(字: string): void {
    if (組字式符號.includes(字)) {
      this._組字長度 -= 1;
    } else {
      this._組字長度 += 1;
    }
  }

  組字長度有夠矣未(): boolean {
    return this._組字長度 === 1;
  }

  這馬字加一个字元(字: string): void {
    this._這馬字 += 字;
  }

  這馬是輕聲字(): void {
    this._這馬是輕聲字 = true;
  }

  這陣是輕聲詞(): void {
    this._這陣是輕聲詞 = true;
    this._這陣是輕聲詞_而且是輕聲詞ê一部份 = true;
  }

  有連字符(): void {
    if (this._這陣是輕聲詞) {
      this._這陣是輕聲詞_而且是輕聲詞ê一部份 = true;
    }
  }

  字陣列直接加一字(字: string): void {
    this._字陣列.push(字);
    this._輕聲陣列.push(false);
    this._佮後一个字無仝一个詞.push(null);
  }

  這馬字好矣清掉囥入去字陣列(): void {
    if (this._這馬字 !== '') {
      if (this._陣是輕聲詞()) {
        if (!this._這陣是輕聲詞_而且是輕聲詞ê一部份) {
          this.頂一字佮這馬的字無仝詞();
          this._這陣是輕聲詞 = false;
        }
        this._這陣是輕聲詞_而且是輕聲詞ê一部份 = false;
      }
      this._字陣列.push(this._這馬字);
      this._輕聲陣列.push(this._這馬是輕聲字);
      this._佮後一个字無仝一个詞.push(null);
      this._這馬字 = '';
      this._這馬是輕聲字 = false;
    }
  }

  private _陣是輕聲詞(): boolean {
    return this._這陣是輕聲詞;
  }

  頂一字佮這馬的字仝詞(): void {
    if (this._佮後一个字無仝一个詞.length > 0) {
      this._佮後一个字無仝一个詞[this._佮後一个字無仝一个詞.length - 1] = false;
    }
  }

  頂一字佮這馬的字無仝詞(): void {
    if (this._佮後一个字無仝一个詞.length > 0) {
      if (this._佮後一个字無仝一个詞[this._佮後一个字無仝一个詞.length - 1] === null) {
        this._佮後一个字無仝一个詞[this._佮後一个字無仝一个詞.length - 1] = true;
      }
    }
  }

  上尾敢是o結尾(): boolean {
    const oChars = ['o', 'ó', 'ò', 'ô', 'ǒ', 'ō', 'o̍', 'ő'];
    for (const o of oChars) {
      if (this._這馬字.endsWith(o)) {
        return true;
      }
    }
    return false;
  }
}
