"use strict";
const m = require("./main");
const FirefoxMenuBuilder = m.FirefoxMenuBuilder;

exports["test Main function"] = function(assert, done){
  var callbacks = { quit: function() {
    assert.pass();
    done();
  } };

  // Make sure it doesn't crash...
  m.main({ staticArgs: {quitWhenDone: true} }, callbacks);
};

exports["test rootMenu function happy path"] = function(assert){
	assert.ok(FirefoxMenuBuilder.prototype.rootMenu("Foo"), "Creates rootMenu");
};

exports["test rootMenu without parameter"] = function(assert){
	assert.throws(function() {
		FirefoxMenuBuilder.prototype.rootMenu();
	}, "rootMenu requires parameter")
};

exports["test subMenu function happy path"] = function(assert){
	var foo = FirefoxMenuBuilder.prototype.rootMenu("Foo");
	var menu = FirefoxMenuBuilder.prototype.subMenu("Bar", foo);
	assert.ok(menu, "Creates subMenu");
	assert.deepEqual(menu, foo.items[0], "subMenu was added to rootMenu");
};

exports["test subMenu function single parameter"] = function(assert){
	assert.throws(function() {
		FirefoxMenuBuilder.prototype.subMenu("Bar");
	}, "subMenu requires two parameters");
};

exports["test subMenu function strings for both parameters"] = function(assert){
	assert.throws(function() {
		FirefoxMenuBuilder.prototype.subMenu("Foo", "Bar");
	}, "subMenu requires a string parameter, and a menu object");
};

exports["test subMenu function swapped parameter objects"] = function(assert){
	var foo = FirefoxMenuBuilder.prototype.rootMenu("Foo");
	assert.throws(function() {
		FirefoxMenuBuilder.prototype.subMenu(foo, "Bar");
	}, "subMenu requires a string parameter, and a menu object");
};

exports["test menuItem function happy path with item value as string"] = function(assert){
	var foo = FirefoxMenuBuilder.prototype.rootMenu("Foo");
	var item = FirefoxMenuBuilder.prototype.menuItem("Bar", foo, "Baz");
	assert.ok(item, "Creates menuItem");
	assert.equal(item.label, "Bar", "menuItem has label");
	var data = { _type: 'literal', value: "Baz" };
	assert.equal(item.data, JSON.stringify(data), "menuItem has data");
	assert.deepEqual(item, foo.items[0], "menuItem was added to rootMenu");
};

exports["test menuItem function happy path with item value as object"] = function(assert){
	var foo = FirefoxMenuBuilder.prototype.rootMenu("Foo");
	var data = { _type: 'literal', value: "Baz" };
	var item = FirefoxMenuBuilder.prototype.menuItem("Bar", foo, data);
	assert.ok(item, "Creates menuItem");
	assert.equal(item.label, "Bar", "menuItem has label");
	assert.equal(item.data, JSON.stringify(data), "menuItem has data");
	assert.deepEqual(item, foo.items[0], "menuItem was added to rootMenu");
};

exports["test menuItem function requires two-three parameters"] = function(assert){
	var foo = FirefoxMenuBuilder.prototype.rootMenu("Foo");
	assert.throws(function(){
		FirefoxMenuBuilder.prototype.menuItem("Bar");
	}, "menuItem does not work with one parameter only");
	assert.throws(function(){
		FirefoxMenuBuilder.prototype.menuItem("Bar", "Foo", "Baz")
	}, "menuItem does not work with all string parameters");
};

require("sdk/test").run(exports);
