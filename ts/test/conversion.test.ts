import { describe, it, expect } from 'vitest';
import { Ku } from '../src/butkian/ku.ts';

describe('Conversion', () => {
  it('test_TL_to_POJ', () => {
    const ku = new Ku('Phah-pe̍h-phiat');
    expect(ku.POJ().hanlo).toBe('Phah-pe̍h-phiat');
  });

  it('test_TL_to_POJ_with_conversion', () => {
    // ts -> ch, oo -> o͘
    const ku = new Ku('tshiù-nn̂g tsoo-tsit');
    expect(ku.POJ().hanlo).toBe('chhiù-nn̂g cho͘-chit');
  });

  it('test_POJ_to_TL', () => {
    // ch -> ts, o -> o
    const ku = new Ku('chhiù-nn̂g cho-chit');
    expect(ku.TL().hanlo).toBe('tshiù-nn̂g tso-tsit');
  });

  it('test_POJ_to_TL_oo', () => {
    // o͘ -> oo
    const ku = new Ku('cho͘-chit');
    expect(ku.TL().hanlo).toBe('tsoo-tsit');
  });
});
