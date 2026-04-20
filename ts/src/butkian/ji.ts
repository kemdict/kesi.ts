import { tsuanPOJ } from "../susia/POJ.ts";
import { tsuanTL } from "../susia/TL.ts";
import { KHIN_SIANN_HU, si_lomaji } from "./kongiong.ts";

export class Ji {
  hanlo: string;
  lomaji: string;

  constructor(
    hanlo: string,
    lomaji: string | null = null,
    si_khinsiann: boolean = false,
  ) {
    if (si_khinsiann) {
      this.hanlo = `--${hanlo}`;
    } else {
      this.hanlo = hanlo;
    }

    if (lomaji !== null && si_khinsiann) {
      this.lomaji = `--${lomaji}`;
    } else if (lomaji !== null) {
      this.lomaji = lomaji;
    } else {
      this.lomaji = this.hanlo;
    }
  }

  equals(other: Ji): boolean {
    return (
      this.hanlo === other.hanlo &&
      this.lomaji === other.lomaji &&
      this.si_khinsiann === other.si_khinsiann
    );
  }

  get kiphanlo(): string {
    if (this.si_khinsiann && !si_lomaji(this.hanlo[2])) {
      return this.hanlo.slice(2);
    }
    return this.hanlo;
  }

  POJ(): Ji {
    let hanlo: string;
    let lomaji: string;
    if (this.si_khinsiann) {
      hanlo = this.hanlo.slice(2);
      lomaji = this.lomaji.slice(2);
    } else {
      hanlo = this.hanlo;
      lomaji = this.lomaji;
    }
    return new Ji(tsuanPOJ(hanlo), tsuanPOJ(lomaji), this.si_khinsiann);
  }

  TL(): Ji {
    let hanlo: string;
    let lomaji: string;
    if (this.si_khinsiann) {
      hanlo = this.hanlo.slice(2);
      lomaji = this.lomaji.slice(2);
    } else {
      hanlo = this.hanlo;
      lomaji = this.lomaji;
    }
    return new Ji(tsuanTL(hanlo), tsuanTL(lomaji), this.si_khinsiann);
  }

  KIP = this.TL;

  get si_khinsiann(): boolean {
    return this.hanlo.startsWith(KHIN_SIANN_HU);
  }
}
