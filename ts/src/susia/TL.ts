import { KHIN_SIANN_HU } from '../butkian/kongiong.ts';
import { thiah, tshiau_tuasiosia, SuSiaTshoNgoo } from './kongke.ts';

export function tsuanTL(bun: string): string {
  const si_khinsiann = bun.startsWith(KHIN_SIANN_HU);
  let processedBun = bun;
  if (si_khinsiann) {
    processedBun = processedBun.replace(KHIN_SIANN_HU, '');
  }
  try {
    const [siann, un, tiau, tuasiosia] = thiah(processedBun);
    const tailo = kapTL(siann, un, tiau);
    let kiatko = tshiau_tuasiosia(tuasiosia, tailo);
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

export function kapTL(siann: string, un: string, tiau: string): string {
  const tiau_tl = tsuan_TL_tiau(tiau);
  const un_tl = tau_tiauhu(un, tiau_tl);
  return (siann + un_tl).normalize('NFC');
}

export function tsuan_TL_tiau(tiau: string): string {
  if (tiau === '\u0306') {
    return '\u030b';
  }
  return tiau;
}

export function tau_tiauhu(un: string, tiau: string): string {
  if (un.includes('a')) {
    return un.replace('a', 'a' + tiau);
  } else if (un.includes('oo')) {
    return un.replace('oo', 'o' + tiau + 'o');
  } else if (un.includes('ere')) {
    return un.replace('ere', 'ere' + tiau);
  } else if (un.includes('e')) {
    return un.replace('e', 'e' + tiau);
  } else if (un.includes('o')) {
    return un.replace('o', 'o' + tiau);
  } else if (un.includes('ui')) {
    return un.replace('i', 'i' + tiau);
  } else if (un.includes('iu')) {
    return un.replace('u', 'u' + tiau);
  } else if (un.includes('iri')) {
    return un.replace('iri', 'iri' + tiau);
  } else if (un.includes('i')) {
    return un.replace('i', 'i' + tiau);
  } else if (un.includes('u')) {
    return un.replace('u', 'u' + tiau);
  } else if (un.includes('ng')) {
    return un.replace('ng', 'n' + tiau + 'g');
  } else if (un.includes('m')) {
    return un.replace('m', 'm' + tiau);
  }
  return un;
}
