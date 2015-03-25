// context element handler populates the control with its data
self.on("click", function(node, data) {
	BugMagnet.executeRequest(JSON.parse(data));
});
