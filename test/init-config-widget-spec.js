/*global describe, it, expect, beforeEach, afterEach, jasmine */
const initConfigWidget = require('../src/lib/init-config-widget');
describe('initConfigWidget', function () {
	'use strict';
	let underTest, browserInterface, mainScreen, addScreen, sectionForCustom, sectionWithoutCustom,
		configList, statusMessage, submenuName, asyncResult, resolveLoadOptions;
	const template = `
		<div role="status" id="statusMessage"></div>
		<div id="mainScreen" role="main-screen">
			<input type="checkbox" role="option-skipStandard" id="skipStandardCheckbox"/>
			<div id="sectionWithoutCustom" role="no-custom"></div>
			<div id="sectionForCustom" role="yes-custom"></div>
			<div id="templateParent">
				<div role="template">
					<span role="name"></span>
					<span role="source"></span>
					<span><button role="remove">Remove</button></span>
				</div>
			</table>
			<button id="addBtn" role="add">Add Configuration File</button>
			<button id="closeBtn" role="close">Close</button>
		</div>
		<div id="addScreen" role="file-loader">
			<form id="form">
				<input id="submenuName" type="text" role="submenu-name"/>
				<div role="buttons">
					<button id="btnFileSelect" role="select-file-cover">Select File</button>
					<button id="backBtn" role="back">Cancel</button>
				</div>
				<span id="fileSelector" role="file-selector"/>

				<textarea id="customConfigText" role="custom-config-text"></textarea>
				<button id="addCustomConfig" role="add-custom-config"/>
				<button id="backBtn2" role="back">Cancel</button>

				<input type="text" role="remote-config-url" id="remoteUrl"/>
				<button id="addRemoteConfig" role="add-remote-config" />

			</form>
		</div>`,
		clickOn = function (domElement) {
			const event = new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true
			});
			domElement.dispatchEvent(event);
			return event;
		},
		loadFile = function (fileId) {
			const file = fileId, //new Blob([textContent], {contentType: 'application/json'}),
				changeEvt = new Event('change', {
					view: window,
					bubbles: true,
					cancelable: true
				});
			document.getElementById('fileSelector').files = [file];
			document.getElementById('fileSelector').dispatchEvent(changeEvt);
		};
	beforeEach(() => {
		const loadOptionsPromise = new Promise(resolve => resolveLoadOptions = resolve);
		underTest = document.createElement('div');
		underTest.innerHTML = template;
		document.body.append(underTest);
		browserInterface = jasmine.createSpyObj('browserInterface', ['readFile', 'getRemoteFile', 'saveOptions', 'closeWindow', 'getOptionsAsync']);
		browserInterface.getOptionsAsync.and.returnValue(loadOptionsPromise);
		asyncResult = initConfigWidget(underTest, browserInterface);
		mainScreen = document.getElementById('mainScreen');
		addScreen = document.getElementById('addScreen');
		sectionForCustom = document.getElementById('sectionForCustom');
		sectionWithoutCustom = document.getElementById('sectionWithoutCustom');
		configList = document.getElementById('templateParent');
		submenuName = document.getElementById('submenuName');
		statusMessage = document.getElementById('statusMessage');
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 200;
	});
	it('prevents form from submitting to allow firefox to handle the form', () => {
		const event = new Event('submit', {
			view: window,
			bubbles: true,
			cancelable: true
		});
		document.getElementById('form').dispatchEvent(event);
		expect(event.defaultPrevented).toBeTruthy();
	});
	it('shows the main screen', () => {
		expect(mainScreen.style.display).not.toBe('none');
		expect(addScreen.style.display).toBe('none');
	});
	describe('button handlers', () => {
		it('sets up the close button to close the window', () => {
			clickOn(document.getElementById('closeBtn'));
			expect(browserInterface.closeWindow).toHaveBeenCalled();
		});
		it('sets up the add button to show the add screen', () => {
			clickOn(document.getElementById('addBtn'));
			expect(mainScreen.style.display).toBe('none');
			expect(addScreen.style.display).not.toBe('none');
		});
		it('clears the content from custom data fields when switching to add screen', () => {
			document.getElementById('customConfigText').value = 'abc';
			document.getElementById('submenuName').value = 'def';
			clickOn(document.getElementById('addBtn'));
			expect(document.getElementById('customConfigText').value).toEqual('');
			expect(document.getElementById('submenuName').value).toEqual('');
		});

		it('sets up the back button to show the main screen', () => {
			mainScreen.style.display = 'none';
			addScreen.style.display = '';
			clickOn(document.getElementById('backBtn'));
			expect(mainScreen.style.display).not.toBe('none');
			expect(addScreen.style.display).toBe('none');
		});
		it('sets up all back buttons with the same role to show the main screen', () => {
			mainScreen.style.display = 'none';
			addScreen.style.display = '';
			clickOn(document.getElementById('backBtn2'));
			expect(mainScreen.style.display).not.toBe('none');
			expect(addScreen.style.display).toBe('none');
		});
		it('sets up the select-file-cover to re-dispatch a click on file selector', done => {
			document.getElementById('fileSelector').addEventListener('click', e => {
				expect(e.type).toEqual('click');
				done();
			});
			clickOn(document.getElementById('btnFileSelect'));
		});
	});
	describe('skipStandard', () => {
		let skipStandardCheckbox;
		beforeEach(() => {
			skipStandardCheckbox = document.getElementById('skipStandardCheckbox');
		});
		it('checks the option-skipStandard box if the option is set', done => {
			resolveLoadOptions({skipStandard: true});
			asyncResult
				.then(() => expect(skipStandardCheckbox.checked).toBeTruthy())
				.then(done, done.fail);
		});
		it('unchecks the option-skipStandard box if the option is not set', done => {
			skipStandardCheckbox.checked = true;
			resolveLoadOptions({});
			asyncResult
				.then(() => expect(skipStandardCheckbox.checked).toBeFalsy())
				.then(done, done.fail);
		});
		it('saves the options if changed', done => {
			browserInterface.saveOptions.and.callFake(options => {
				expect(options.skipStandard).toBeTruthy();
				done();
			});
			resolveLoadOptions({});
			asyncResult
				.then(() => clickOn(skipStandardCheckbox))
				.then(() => expect(browserInterface.saveOptions).toHaveBeenCalledWith({additionalMenus: [], skipStandard: true}))
				.then(done, done.fail);
		});
		it('preserves other options when saving', done => {
			resolveLoadOptions({
				additionalMenus: [1, 2, 3]
			});
			asyncResult
				.then(() => clickOn(skipStandardCheckbox))
				.then(() => expect(browserInterface.saveOptions).toHaveBeenCalledWith({additionalMenus: [1, 2, 3], skipStandard: true}))
				.then(done, done.fail);
		});
	});
	describe('without any additional config sections', () => {
		beforeEach(done => {
			resolveLoadOptions({});
			asyncResult.then(done, done.fail);
		});
		it('hides the custom section', () => {
			expect(sectionWithoutCustom.style.display).not.toBe('none');
			expect(sectionForCustom.style.display).toBe('none');
		});
		it('shows the custom section after the first element is loaded', done => {
			submenuName.value = 'abc';
			browserInterface.readFile.and.returnValue(Promise.resolve(JSON.stringify({a: 'b'})));
			browserInterface.saveOptions.and.callFake(() => {
				expect(sectionWithoutCustom.style.display).toBe('none');
				expect(sectionForCustom.style.display).not.toBe('none');
				done();
			});
			loadFile({name: 'filename.json'});
		});

	});
	describe('with additional config sections', () => {
		beforeEach(done => {
			resolveLoadOptions({
				additionalMenus: [
					{name: 'first', source: 'fi.json'},
					{name: 'second', source: 'se.json'},
					{name: 'third', source: 'th.json'}
				],
				skipStandard: false
			});
			asyncResult.then(done, done.fail);
		});
		it('shows the custom section', () => {
			expect(sectionWithoutCustom.style.display).toBe('none');
			expect(sectionForCustom.style.display).not.toBe('none');
		});
		it('clones and replicates template for each custom config', () => {
			expect(configList.children.length).toEqual(3);
			expect(configList.children.item(0).querySelector('[role="name"]').innerHTML).toEqual('first');
			expect(configList.children.item(0).querySelector('[role="source"]').innerHTML).toEqual('fi.json');
			expect(configList.children.item(1).querySelector('[role="name"]').innerHTML).toEqual('second');
			expect(configList.children.item(1).querySelector('[role="source"]').innerHTML).toEqual('se.json');
			expect(configList.children.item(2).querySelector('[role="name"]').innerHTML).toEqual('third');
			expect(configList.children.item(2).querySelector('[role="source"]').innerHTML).toEqual('th.json');
		});
		it('sets up the remove button for each custom config to remove the related item', () => {
			clickOn(configList.children.item(1).querySelector('button'));
			expect(configList.children.length).toEqual(2);
			expect(configList.children.item(0).querySelector('[role="name"]').innerHTML).toEqual('first');
			expect(configList.children.item(1).querySelector('[role="name"]').innerHTML).toEqual('third');
			expect(browserInterface.saveOptions).toHaveBeenCalledWith({
				additionalMenus: [
					{ name: 'first', source: 'fi.json' },
					{ name: 'third', source: 'th.json' }
				],
				skipStandard: false
			});
		});
	});
	describe('after initialisation', () => {
		beforeEach(done => {
			resolveLoadOptions({
				additionalMenus: [
					{name: 'first', source: 'fi.json'}
				]});
			asyncResult.then(done, done.fail);
		});

		describe('when content is added via the custom config box', () => {
			const loadCustomConfig = function (text) {
				document.getElementById('customConfigText').value = text;
				clickOn(document.getElementById('addCustomConfig'));
			};


			it('shows an error in the status field if the submenu name is empty', () => {
				submenuName.value = '\t';
				loadCustomConfig('{"a": "b"}');
				expect(statusMessage.innerHTML).toEqual('Please provide submenu name!');
				expect(browserInterface.saveOptions).not.toHaveBeenCalled();
			});
			it('shows an error in the status field if the custom content is empty', () => {
				submenuName.value = 'abc';
				loadCustomConfig('');
				expect(statusMessage.innerHTML).toEqual('Please provide the configuration');
				expect(browserInterface.saveOptions).not.toHaveBeenCalled();
			});
			it('shows an error in the status field if the custom content is not valid JSON', () => {
				submenuName.value = 'abc';
				loadCustomConfig('a: b');
				expect(statusMessage.innerHTML).toMatch(/SyntaxError/);
				expect(browserInterface.saveOptions).not.toHaveBeenCalled();
			});
			it('adds a menu when the file load resolves with a JSON content', done => {
				submenuName.value = 'abc';
				browserInterface.saveOptions.and.callFake(options => {
					expect(configList.children.length).toEqual(2);
					expect(configList.children.item(1).querySelector('[role="name"]').innerHTML).toEqual('abc');
					expect(configList.children.item(1).querySelector('[role="source"]').innerHTML).toEqual('');

					expect(options.additionalMenus).toEqual([
						{name: 'first', source: 'fi.json'},
						{name: 'abc', config: {a: 'b'}}
					]);
					done();
				});
				loadCustomConfig('{"a": "b"}');
			});

		});
		describe('remote file configuration', () => {
			const tryLoadingUrl = function (url) {
				document.getElementById('remoteUrl').value = url;
				clickOn(document.getElementById('addRemoteConfig'));
			};
			it('shows an error message in the status field if the submenu name is empty', () => {
				submenuName.value = '\t';
				tryLoadingUrl('http://a/b.json');
				expect(browserInterface.getRemoteFile).not.toHaveBeenCalled();
				expect(statusMessage.innerHTML).toEqual('Please provide submenu name!');
				expect(browserInterface.saveOptions).not.toHaveBeenCalled();
			});
			it('loads the remote URL using the browser interface', done => {
				submenuName.value = 'abc';
				browserInterface.getRemoteFile.and.callFake((url) => {
					expect(url).toEqual('http://a/b.json');
					expect(statusMessage.innerHTML).toEqual('');
					done();
					return new Promise(() => false);
				});
				tryLoadingUrl('http://a/b.json');
			});
			it('adds a menu when the file load resolves with a JSON content', done => {
				submenuName.value = 'abc';
				browserInterface.getRemoteFile.and.returnValue(Promise.resolve(JSON.stringify({a: 'b'})));
				browserInterface.saveOptions.and.callFake(options => {
					expect(configList.children.length).toEqual(2);
					expect(configList.children.item(1).querySelector('[role="name"]').innerHTML).toEqual('abc');
					expect(configList.children.item(1).querySelector('[role="source"]').innerHTML).toEqual('<a href="http://a/b.json" target="_blank">b.json</a>');
					expect(options.additionalMenus).toEqual([
						{name: 'first', source: 'fi.json'},
						{name: 'abc', remote: true, source: 'http://a/b.json', config: {a: 'b'}}
					]);
					done();
				});
				tryLoadingUrl('http://a/b.json');
			});
		});

		describe('when a file is loaded into the file box', () => {
			it('shows an error message in the status field if the submenu name is empty', () => {
				submenuName.value = '\t';
				loadFile({name: 'file.json'});
				expect(browserInterface.readFile).not.toHaveBeenCalled();
				expect(statusMessage.innerHTML).toEqual('Please provide submenu name!');
				expect(browserInterface.saveOptions).not.toHaveBeenCalled();
			});
			it('loads the file using the browser interface', done => {
				submenuName.value = 'abc';
				browserInterface.readFile.and.callFake((fileInfo) => {
					expect(fileInfo).toEqual({name: 'file.json'});
					expect(statusMessage.innerHTML).toEqual('');
					done();
					return new Promise(() => false);
				});
				loadFile({name: 'file.json'});
			});
			it('adds a menu when the file load resolves with a JSON content', done => {
				submenuName.value = 'abc';
				browserInterface.readFile.and.returnValue(Promise.resolve(JSON.stringify({a: 'b'})));
				browserInterface.saveOptions.and.callFake(options => {

					expect(configList.children.length).toEqual(2);
					expect(configList.children.item(1).querySelector('[role="name"]').innerHTML).toEqual('abc');
					expect(configList.children.item(1).querySelector('[role="source"]').innerHTML).toEqual('filename.json');

					expect(options.additionalMenus).toEqual([
						{name: 'first', source: 'fi.json'},
						{name: 'abc', source: 'filename.json', config: {a: 'b'}}
					]);
					done();
				});
				loadFile({name: 'filename.json'});
			});
		});
	});

	afterEach(() => {
		underTest.remove();
	});
});
