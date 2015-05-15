/*global BugMagnet, self */
// context element handler populates the control with its data
self.on('click', function (node, data) {
	'use strict';
	BugMagnet.executeRequest(JSON.parse(data));
});
