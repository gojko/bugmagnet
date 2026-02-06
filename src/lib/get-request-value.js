const type_flag = '_type',
	vinAllowedChars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789',
	vinSerialChars = '0123456789',
	vinFormatRegex = /^[A-HJ-NPR-Z0-9]{17}$/,
	vinWeights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2],
	vinTransliteration = {
		A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
		J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
		S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
		'0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
		'5': 5, '6': 6, '7': 7, '8': 8, '9': 9
	},
	randomChar = function (chars) {
		return chars[Math.floor(Math.random() * chars.length)];
	},
	vinValue = function (char) {
		const mapped = vinTransliteration[char];
		return (typeof mapped === 'number') ? mapped : 0;
	},
	calculateVinCheckDigit = function (vinChars) {
		let sum = 0;
		for (let i = 0; i < vinChars.length; i++) {
			sum += vinValue(vinChars[i]) * vinWeights[i];
		}
		const remainder = sum % 11;
		return remainder === 10 ? 'X' : `${remainder}`;
	},
	generateRandomVin = function () {
		const vinChars = new Array(17);
		for (let i = 0; i < vinChars.length; i++) {
			if (i === 8) {
				vinChars[i] = '0';
			} else {
				vinChars[i] = randomChar(vinAllowedChars);
			}
		}
		vinChars[8] = calculateVinCheckDigit(vinChars);
		return vinChars.join('');
	},
	mutateVinSerial = function (vin) {
		const vinChars = vin.toUpperCase().split('');
		for (let i = 11; i < vinChars.length; i++) {
			vinChars[i] = randomChar(vinSerialChars);
		}
		vinChars[8] = '0';
		vinChars[8] = calculateVinCheckDigit(vinChars);
		return vinChars.join('');
	},
	pickFromPool = function (pool) {
		return pool[Math.floor(Math.random() * pool.length)];
	},
	normalizeVinPool = function (pool) {
		if (!Array.isArray(pool)) {
			return [];
		}
		return pool
			.map(vin => (typeof vin === 'string' ? vin.trim().toUpperCase() : ''))
			.filter(vin => vinFormatRegex.test(vin));
	},
	generators = {
		literal: function (request) {
			return request.value;
		},
		size: function (request) {
			const size = parseInt(request.size, 10);
			let value = request.template;
			while (value.length < size) {
				value += request.template;
			}
			return value.substring(0, request.size);
		},
		vin: function (request) {
			const mode = request.mode || 'valid';
			if (mode === 'real') {
				const pool = normalizeVinPool(request.pool);
				if (!pool.length) {
					return generateRandomVin();
				}
				const picked = pickFromPool(pool);
				if (request.mutateSerial) {
					return mutateVinSerial(picked);
				}
				return picked;
			}
			return generateRandomVin();
		}
	};

export function getRequestValue(request) {
	if (!request) {
		return false;
	}
	const generator = generators[request[type_flag]];
	if (!generator) {
		return false;
	}
	return generator(request);
}
