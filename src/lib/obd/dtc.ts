export function parseDTCResponse(hexString: string): string[] {
  const cleanHex = hexString.replace(/\s/g, '').toUpperCase();
  if (cleanHex.includes('NODATA') || cleanHex.includes('ERROR')) {
    return [];
  }

  // Mode 03 response starts with 43
  const index = cleanHex.indexOf('43');
  if (index === -1) return [];

  const dataHex = cleanHex.substring(index + 2); // Skip '43'
  
  const dtcs: string[] = [];
  
  // Every 4 hex characters (2 bytes) represent one DTC
  for (let i = 0; i < dataHex.length; i += 4) {
    if (i + 4 > dataHex.length) break;
    const codeHex = dataHex.substring(i, i + 4);
    if (codeHex !== '0000') {
      dtcs.push(parseDTCCode(codeHex));
    }
  }

  return [...new Set(dtcs)]; // Return unique DTCs
}

function parseDTCCode(hex: string): string {
  // hex is 4 chars, e.g., "0104"
  // First hex digit determines the letter (P, C, B, U) and the first digit of the code
  const firstHexChar = parseInt(hex[0], 16);
  
  // 0-3: P0, P1, P2, P3
  // 4-7: C0, C1, C2, C3
  // 8-B: B0, B1, B2, B3
  // C-F: U0, U1, U2, U3
  
  const letters = ['P', 'C', 'B', 'U'];
  const letterIndex = firstHexChar >> 2; // Divide by 4
  const letter = letters[letterIndex];
  
  const firstDigit = (firstHexChar & 0x3).toString(16); // Remainder
  
  const rest = hex.substring(1);
  
  return `${letter}${firstDigit}${rest}`.toUpperCase();
}

// We keep this for backward compatibility, but the main DB is in dtcDatabase.ts
export const DTC_DICTIONARY: Record<string, string> = {
  'P0300': 'Random/Multiple Cylinder Misfire Detected',
  'P0171': 'System Too Lean (Bank 1)',
  'P0420': 'Catalyst System Efficiency Below Threshold',
  'P0102': 'Mass or Volume Air Flow Circuit Low Input',
  'P0113': 'Intake Air Temperature Circuit High Input',
  'P0135': 'O2 Sensor Heater Circuit Malfunction (Bank 1 Sensor 1)',
  'P0301': 'Cylinder 1 Misfire Detected',
  'P0302': 'Cylinder 2 Misfire Detected',
  'P0303': 'Cylinder 3 Misfire Detected',
  'P0304': 'Cylinder 4 Misfire Detected',
  'P0500': 'Vehicle Speed Sensor Malfunction',
};
