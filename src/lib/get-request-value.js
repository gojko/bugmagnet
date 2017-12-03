const type_flag = '_type',
	generators = {
		literal: function (request) {
			'use strict';
			return request.value;
		},
		size: function (request) {
			'use strict';
			const size = parseInt(request.size, 10);
			let value = request.template;
			while (value.length < size) {
				value += request.template;
			}
			return value.substring(0, request.size);
		}
	};
module.exports = function getRequestValue(request) {
	'use strict';
	if (!request) {
		return false;
	}
	const generator = generators[request[type_flag]];
	if (!generator) {
		return false;
	}
	return generator(request);
};
