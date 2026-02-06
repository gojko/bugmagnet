import { getRequestValue } from '../src/lib/get-request-value.js';

describe('getRequestValue', () => {
	const vinWeights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
	const vinTransliteration = {
		A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
		J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
		S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
		'0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
		'5': 5, '6': 6, '7': 7, '8': 8, '9': 9
	};
	const isValidVin = function (vin) {
		if (!vin || vin.length !== 17) {
			return false;
		}
		const upper = vin.toUpperCase();
		let sum = 0;
		for (let i = 0; i < upper.length; i++) {
			const value = vinTransliteration[upper[i]];
			if (typeof value !== 'number') {
				return false;
			}
			sum += value * vinWeights[i];
		}
		const remainder = sum % 11;
		const checkDigit = remainder === 10 ? 'X' : `${remainder}`;
		return upper[8] === checkDigit;
	};

	it('returns a literal value for _type=literal', () => {
		expect(getRequestValue({_type: 'literal', value: 'abc'})).toEqual('abc');
	});
	it('returns a replicated value up to size for _type=size', () => {
		expect(getRequestValue({ '_type': 'size', 'size': '5', 'template': 'A' })).toEqual('AAAAA');
		expect(getRequestValue({ '_type': 'size', 'size': '20', 'template': '1234567' })).toEqual('12345671234567123456');
	});
	it('returns a valid vin for _type=vin mode=valid', () => {
		const vin = getRequestValue({ _type: 'vin', mode: 'valid' });
		expect(isValidVin(vin)).toBe(true);
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
		expect(vin.slice(0, 11)).toEqual(poolVin.slice(0, 11));
	});
	it('ignores invalid vins in the real mode pool', () => {
		const invalidVin = '1G6DA5E5IC0104969';
		const validVin = '1G6DA5E5XC0104969';
		const vin = getRequestValue({ _type: 'vin', mode: 'real', pool: [invalidVin, validVin] });
		expect(vin).toEqual(validVin);
	});
});
