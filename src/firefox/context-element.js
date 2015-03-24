var BugMagnet = BugMagnet || {};
// context element handler populates the control with its data
self.on("click", function(node, data) {
	BugMagnet.executeRequestOnElement(node, data);
});
