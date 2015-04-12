var main = require("./main");

exports["test1"] = function(assert){
	assert.ok(false);
}

require("sdk/test").run(exports);
