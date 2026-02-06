import { getRequestValue, isValidVin, VIN_WEIGHTS, VIN_TRANSLITERATION } from '../src/lib/get-request-value.js';

describe('getRequestValue', () => {
	it('returns a literal value for _type=literal', () => {
		expect(getRequestValue({_type: 'literal', value: 'abc'})).toEqual('abc');
	});
	
	it('returns a replicated value up to size for _type=size', () => {
		expect(getRequestValue({ '_type': 'size', 'size': '5', 'template': 'A' })).toEqual('AAAAA');
		expect(getRequestValue({ '_type': 'size', 'size': '20', 'template': '1234567' })).toEqual('12345671234567123456');
	});

describe('VIN generation', () => {
	it('returns a valid vin for _type=vin mode=valid', () => {
		const vin = getRequestValue({ _type: 'vin', mode: 'valid' });
		expect(isValidVin(vin)).toBe(true);
	});

	it('generates different random VINs', () => {
		const vin1 = getRequestValue({ _type: 'vin', mode: 'valid' });
		const vin2 = getRequestValue({ _type: 'vin', mode: 'valid' });
		const vin3 = getRequestValue({ _type: 'vin', mode: 'valid' });
		
		// All should be valid
		expect(isValidVin(vin1)).toBe(true);
		expect(isValidVin(vin2)).toBe(true);
		expect(isValidVin(vin3)).toBe(true);
		
		// At least one should be different (extremely high probability)
		const allSame = (vin1 === vin2 && vin2 === vin3);
		expect(allSame).toBe(false);
	});

	it('returns a vin from the pool for _type=vin mode=real without mutation', () => {
		const poolVin = '1G6DA5E5XC0104969';
		const vin = getRequestValue({ _type: 'vin', mode: 'real', pool: [poolVin] });
		expect(vin).toEqual(poolVin);
	});

	it('returns a valid vin for _type=vin mode=real with mutation', () => {
		const poolVin = '1G6DA5E5XC0104969';
		const vin = getRequestValue({ _type: 'vin', mode: 'real', pool: [poolVin], mutateSerial: true });
		expect(isValidVin(vin)).toBe(true);
		// First 11 characters (WMI + VDS + check digit recalculated, but WMI stays same)
		expect(vin.slice(0, 11)).toEqual(poolVin.slice(0, 11));
	});

	it('mutates serial portion creating different VINs', () => {
		const poolVin = '1G6DA5E5XC0104969';
		const vin1 = getRequestValue({ _type: 'vin', mode: 'real', pool: [poolVin], mutateSerial: true });
		const vin2 = getRequestValue({ _type: 'vin', mode: 'real', pool: [poolVin], mutateSerial: true });
		
		expect(isValidVin(vin1)).toBe(true);
		expect(isValidVin(vin2)).toBe(true);
		// Serial portions should likely be different
		expect(vin1.slice(11)).not.toEqual(vin2.slice(11));
	});

	it('ignores invalid vins in the real mode pool', () => {
		const invalidVin = '1G6DA5E5IC0104969'; // Invalid check digit
		const validVin = '1G6DA5E5XC0104969';
		const vin = getRequestValue({ _type: 'vin', mode: 'real', pool: [invalidVin, validVin] });
		expect(vin).toEqual(validVin);
	});

	it('falls back to random generation when pool is empty', () => {
		const vin = getRequestValue({ _type: 'vin', mode: 'real', pool: [] });
		expect(isValidVin(vin)).toBe(true);
	});

	it('falls back to random generation when pool has no valid VINs', () => {
		const invalidVins = ['INVALID', '123', 'ABCDEFGHIJK123456'];
		const vin = getRequestValue({ _type: 'vin', mode: 'real', pool: invalidVins });
		expect(isValidVin(vin)).toBe(true);
	});

	it('handles non-array pool gracefully', () => {
		const vin = getRequestValue({ _type: 'vin', mode: 'real', pool: 'not-an-array' });
		expect(isValidVin(vin)).toBe(true);
	});

	it('handles pool with non-string values', () => {
		const pool = [null, undefined, 123, { vin: '1G6DA5E5XC0104969' }, '1G6DA5E5XC0104969'];
		const vin = getRequestValue({ _type: 'vin', mode: 'real', pool: pool });
		expect(vin).toEqual('1G6DA5E5XC0104969');
	});

	it('normalizes pool VINs to uppercase and trims whitespace', () => {
		const pool = ['  1g6da5e5xc0104969  ', '1G6DG5EY2B0102432'];
		const vin = getRequestValue({ _type: 'vin', mode: 'real', pool: pool });
		expect(isValidVin(vin)).toBe(true);
		expect(['1G6DA5E5XC0104969', '1G6DG5EY2B0102432']).toContain(vin);
	});
});

describe('isValidVin helper', () => {
	it('validates correct VINs', () => {
		expect(isValidVin('1G6DA5E5XC0104969')).toBe(true);
		expect(isValidVin('1HGCG555XWA157274')).toBe(true);
		expect(isValidVin('JM1BM1K77F1239111')).toBe(true);
	});

	it('rejects VINs with wrong check digit', () => {
		expect(isValidVin('1G6DA5E5IC0104969')).toBe(false); // 'I' instead of 'X'
	});

	it('rejects VINs with invalid length', () => {
		expect(isValidVin('1G6DA5E5X')).toBe(false);
		expect(isValidVin('1G6DA5E5XC0104969EXTRA')).toBe(false);
	});

	it('rejects VINs with invalid characters', () => {
		expect(isValidVin('1G6DA5E5XC010496O')).toBe(false); // Contains 'O'
		expect(isValidVin('1G6DA5E5XC010496I')).toBe(false); // Contains 'I'
		expect(isValidVin('1G6DA5E5XC010496Q')).toBe(false); // Contains 'Q'
	});

	it('handles null and undefined', () => {
		expect(isValidVin(null)).toBe(false);
		expect(isValidVin(undefined)).toBe(false);
	});

	it('handles empty string', () => {
		expect(isValidVin('')).toBe(false);
	});
});
});
