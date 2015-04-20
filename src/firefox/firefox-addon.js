exports.main = function(options, callbacks){
	'use strict';

	// load dependencies
	var config = require("sdk/self").data.load('config.json');
	BugMagnet.processConfigText(config, new FirefoxMenuBuilder());

	// If you run cfx with --static-args='{"quitWhenDone":true}' this program
	// will automatically quit Firefox when it's done.
	if (options.staticArgs.quitWhenDone)
		callbacks.quit();

};
