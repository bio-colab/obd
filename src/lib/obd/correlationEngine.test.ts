import { describe, it, expect } from 'vitest';
import { analyzeDTCsAndData } from './correlationEngine';

describe('Correlation Engine', () => {
  it('should identify network codes as critical primary suspects', () => {
    const result = analyzeDTCsAndData(['U0100', 'P0300'], {});
    expect(result.primarySuspects).toContain('U0100');
    expect(result.symptomCodes).toContain('P0300');
    expect(result.riskLevel).toBe('CRITICAL');
  });

  it('should identify sensor codes as high risk primary suspects', () => {
    const result = analyzeDTCsAndData(['P0102', 'P0301'], {});
    expect(result.primarySuspects).toContain('P0102');
    expect(result.symptomCodes).toContain('P0301');
    expect(result.riskLevel).toBe('HIGH');
  });

  it('should detect high temperature anomaly', () => {
    const result = analyzeDTCsAndData([], { TEMP: 110 });
    expect(result.dataAnomalies.some(a => a.includes('حرارة المحرك مرتفعة جداً'))).toBe(true);
    expect(result.riskLevel).toBe('CRITICAL');
  });

  it('should detect lean mixture from Lambda', () => {
    const result = analyzeDTCsAndData([], { EQUIV_RATIO: 1.1 });
    expect(result.dataAnomalies.some(a => a.includes('خليط فقير'))).toBe(true);
  });
});
