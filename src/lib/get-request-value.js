/**
 * VIN (Vehicle Identification Number) Constants and Utilities
 * 
 * VIN Structure (ISO 3779):
 * - Positions 1-3: World Manufacturer Identifier (WMI)
 * - Positions 4-8: Vehicle Descriptor Section (VDS)
 * - Position 9: Check digit (calculated using ISO 3779 algorithm)
 * - Position 10: Model year
 * - Position 11: Plant code
 * - Positions 12-17: Sequential number (vehicle serial)
 * 
 * Valid characters: A-H, J-N, P, R-Z (excluding I, O, Q), 0-9
 */

const type_flag = '_type',
	// VIN Constants
	VIN_ALLOWED_CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789',
	VIN_SERIAL_CHARS = '0123456789',
	VIN_FORMAT_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/, 
	VIN_CHECK_DIGIT_POSITION = 8,
	VIN_SERIAL_START_POSITION = 11,
	VIN_LENGTH = 17,
	
	/**
	 * Weights used for VIN check digit calculation per ISO 3779
	 * Position 9 (index 8) has weight 0 as it's the check digit itself
	 */
	VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2],
	
	/**
	 * Character transliteration values for VIN check digit calculation
	 * Letters are mapped to numeric values, numbers remain unchanged
	 */
	VIN_TRANSLITERATION = {
	A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
	J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
	S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
	'0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
	'5': 5, '6': 6, '7': 7, '8': 8, '9': 9
	},
	
	/**
	 * Returns a random character from the provided character set
	 * @param {string} chars - String of characters to choose from
	 * @returns {string} A single random character
	 */
	getRandomChar = function (chars) {
		return chars[Math.floor(Math.random() * chars.length)];
	},
	
	/**
	 * Gets the numeric value of a VIN character for check digit calculation
	 * @param {string} char - Single character from a VIN
	 * @returns {number} Numeric value (0-9) or 0 for invalid characters
	 */
	getVinCharValue = function (char) {
		const mapped = VIN_TRANSLITERATION[char];
		if (typeof mapped !== 'number') {
			console.warn(`Invalid VIN character: '${char}'. Using 0 as fallback.`);
			return 0;
		}
		return mapped;
	},
	
	/**
	 * Calculates the VIN check digit (position 9) per ISO 3779
	 * @param {Array<string>} vinChars - Array of 17 VIN characters
	 * @returns {string} Check digit ('0'-'9' or 'X' for 10)
	 */
	calculateVinCheckDigit = function (vinChars) {
		let sum = 0;
		for (let i = 0; i < vinChars.length; i++) {
			sum += getVinCharValue(vinChars[i]) * VIN_WEIGHTS[i];
		}
		const remainder = sum % 11;
		return remainder === 10 ? 'X' : `${remainder}`;
	},
	
	/**
	 * Generates a random valid VIN with correct check digit
	 * @returns {string} A 17-character VIN string
	 */
	generateRandomVin = function () {
		const vinChars = new Array(VIN_LENGTH);
		for (let i = 0; i < vinChars.length; i++) {
			if (i === VIN_CHECK_DIGIT_POSITION) {
				// Placeholder; will be calculated below
				vinChars[i] = '0';
			} else {
				vinChars[i] = getRandomChar(VIN_ALLOWED_CHARS);
			}
		}
		vinChars[VIN_CHECK_DIGIT_POSITION] = calculateVinCheckDigit(vinChars);
		return vinChars.join('');
	},
	
	/**
	 * Mutates the serial number portion (positions 12-17) of a VIN
	 * while preserving the WMI and VDS, then recalculates check digit
	 * @param {string} vin - Base VIN to mutate
	 * @returns {string} New VIN with mutated serial and valid check digit
	 */
	mutateVinSerial = function (vin) {
		const vinChars = vin.toUpperCase().split('');
		// Mutate serial portion (positions 12-17, indices 11-16)
		for (let i = VIN_SERIAL_START_POSITION; i < vinChars.length; i++) {
			vinChars[i] = getRandomChar(VIN_SERIAL_CHARS);
		}
		// Recalculate check digit with mutated serial
		vinChars[VIN_CHECK_DIGIT_POSITION] = calculateVinCheckDigit(vinChars);
		return vinChars.join('');
	},
	
	/**
	 * Picks a random element from an array
	 * @param {Array} pool - Array to pick from
	 * @returns {*} Random element from the array
	 */
	pickFromPool = function (pool) {
		return pool[Math.floor(Math.random() * pool.length)];
	},
	
	/**
	 * Normalizes and validates a pool of VINs
	 * Filters out invalid VINs, trims whitespace, converts to uppercase
	 * @param {Array} pool - Array of potential VIN strings
	 * @returns {Array<string>} Array of valid, normalized VINs
	 */
	normalizeVinPool = function (pool) {
		if (!Array.isArray(pool)) {
			return [];
		}
		return pool
			.map(vin => (typeof vin === 'string' ? vin.trim().toUpperCase() : ''))
			.filter(vin => VIN_FORMAT_REGEX.test(vin));
	},
	
	/**
	 * Validates a VIN string according to ISO 3779 standard
	 * Checks length, character validity, and check digit
	 * @param {string} vin - VIN string to validate
	 * @returns {boolean} True if VIN is valid
	 */
	validateVin = function (vin) {
		if (!vin || vin.length !== VIN_LENGTH) {
			return false;
		}
		const upper = vin.toUpperCase();
		
		// Validate format (allowed characters)
		if (!VIN_FORMAT_REGEX.test(upper)) {
			return false;
		}
		
		// Validate check digit
		let sum = 0;
		for (let i = 0; i < upper.length; i++) {
			const value = VIN_TRANSLITERATION[upper[i]];
			if (typeof value !== 'number') {
				return false;
			}
			sum += value * VIN_WEIGHTS[i];
		}
		const remainder = sum % 11;
		const expectedCheckDigit = remainder === 10 ? 'X' : `${remainder}`;
		return upper[VIN_CHECK_DIGIT_POSITION] === expectedCheckDigit;
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
		/**
		 * VIN Generator
		 * @param {Object} request - Configuration object
		 * @param {string} request.mode - 'valid' for random VIN, 'real' for pool-based
		 * @param {Array<string>} [request.pool] - Pool of real VINs (for 'real' mode)
		 * @param {boolean} [request.mutateSerial] - Whether to mutate serial portion (for 'real' mode)
		 * @returns {string} Generated VIN
		 */
		vin: function (request) {
			const mode = request.mode || 'valid';
			if (mode === 'real') {
				const pool = normalizeVinPool(request.pool);
				if (!pool.length) {
					// No valid VINs in pool, fall back to random generation
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

/**
 * Export VIN validation function for testing
 * @param {string} vin - VIN to validate
 * @returns {boolean} True if valid
 */
export function isValidVin(vin) {
	return validateVin(vin);
}

/**
 * Export VIN constants for testing
 */
export { VIN_WEIGHTS, VIN_TRANSLITERATION };