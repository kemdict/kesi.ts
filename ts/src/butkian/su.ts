import { LIAN_JI_HU, KHIN_SIANN_HU, si_lomaji } from './kongiong';
import { Ji } from './ji';

export class Su {
  private _ji: Ji[];

  constructor() {
    this._ji = [];
  }

  [Symbol.iterator]() {
    return this._ji[Symbol.iterator]();
  }

  get length(): number {
    return this._ji.length;
  }

  equals(other: Su): boolean {
    if (this._ji.length !== other._ji.length) return false;
    for (let i = 0; i < this._ji.length; i++) {
      if (!this._ji[i].equals(other._ji[i])) return false;
    }
    return true;
  }

  get hanlo(): string {
    const buntin: string[] = [];
    let ting_ji_si_lomaji = false;
    let su_u_khinsiann = false;

    for (const ji of this._ji) {
      const jihanlo = ji.hanlo;
      if (ji.si_khinsiann) {
        su_u_khinsiann = true;
      } else if (ting_ji_si_lomaji && si_lomaji(jihanlo[0])) {
        buntin.push(LIAN_JI_HU);
      } else if (su_u_khinsiann) {
        buntin.push(LIAN_JI_HU);
      }
      buntin.push(jihanlo);
      ting_ji_si_lomaji = si_lomaji(jihanlo[jihanlo.length - 1]);
    }
    return buntin.join('');
  }

  get lomaji(): string {
    const buntin: string[] = [];
    let ting_ji_si_lomaji = false;
    let su_u_khinsiann = false;

    for (const ji of this._ji) {
      const jilomaji = ji.lomaji;
      if (ji.si_khinsiann) {
        su_u_khinsiann = true;
      } else if (ting_ji_si_lomaji && si_lomaji(jilomaji[0])) {
        buntin.push(LIAN_JI_HU);
      } else if (su_u_khinsiann) {
        buntin.push(LIAN_JI_HU);
      }
      buntin.push(jilomaji);
      ting_ji_si_lomaji = si_lomaji(jilomaji[jilomaji.length - 1]);
    }
    return buntin.join('');
  }

  get kiphanlo(): string {
    const buntin: string[] = [];
    let ting_ji_si_lomaji = false;

    for (const ji of this._ji) {
      const jihanlo = ji.kiphanlo;
      if (ting_ji_si_lomaji && si_lomaji(jihanlo[0])) {
        if (ji.si_khinsiann) {
          buntin.push(KHIN_SIANN_HU);
        } else {
          buntin.push(LIAN_JI_HU);
        }
      }
      buntin.push(jihanlo);
      ting_ji_si_lomaji = si_lomaji(jihanlo[jihanlo.length - 1]);
    }
    return buntin.join('');
  }

  thiam(ji: Ji): void {
    this._ji.push(ji);
  }

  POJ(): Su {
    const sin_su = new Su();
    for (const ji of this._ji) {
      sin_su.thiam(ji.POJ());
    }
    return sin_su;
  }

  TL(): Su {
    const sin_su = new Su();
    for (const ji of this._ji) {
      sin_su.thiam(ji.TL());
    }
    return sin_su;
  }

  KIP = this.TL;
}
