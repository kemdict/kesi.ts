import { Ku, TuiBeTse } from "./butkian/ku.ts";
import {
  normalize_taibun,
  標點符號 as PIAUTIAM,
  si_lomaji,
} from "./butkian/kongiong.ts";
import { thiah, SuSiaTshoNgoo } from "./susia/kongke.ts";

export { Ku, TuiBeTse, normalize_taibun, PIAUTIAM, si_lomaji };

/** Return whether `tsit_ji_lomaji` is a valid syllable. */
export function kam_haphuat(tsit_ji_lomaji: string): boolean {
  try {
    thiah(tsit_ji_lomaji);
  } catch (e) {
    if (e instanceof SuSiaTshoNgoo) {
      return false;
    }
    throw e;
  }
  return true;
}
