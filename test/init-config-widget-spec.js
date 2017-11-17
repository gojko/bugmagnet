/*global describe, it, expect, beforeEach, afterEach, jasmine */
const initConfigWidget = require('../src/lib/init-config-widget');
describe('initConfigWidget', function () {
	'use strict';
	const template = `
		<div role="status" class="status"></div>
		<div id="mainScreen" role="main-screen">
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
				<input type="text" role="submenu-name" required="true" />
				<div role="buttons">
					<button id="btnFileSelect" role="select-file-cover">Select File</button>
					<button id="backBtn" role="back">Cancel</button>
				</div>
				<input id="fileSelector" role="file-selector"/>
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
		};
	let underTest, browserInterface, mainScreen, addScreen, loadOptionsCallback, sectionForCustom, sectionWithoutCustom,
		configList;
	beforeEach(() => {
		underTest = document.createElement('div');
		underTest.innerHTML = template;
		document.body.append(underTest);
		browserInterface = jasmine.createSpyObj('browserInterface', ['readFile', 'saveOptions', 'closeWindow', 'loadOptions']);
		initConfigWidget(underTest, browserInterface);
		mainScreen = document.getElementById('mainScreen');
		addScreen = document.getElementById('addScreen');
		loadOptionsCallback = browserInterface.loadOptions.calls.argsFor(0)[0];
		sectionForCustom = document.getElementById('sectionForCustom');
		sectionWithoutCustom = document.getElementById('sectionWithoutCustom');
		configList = document.getElementById('templateParent');
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
		it('sets up the back button to show the main screen', () => {
			mainScreen.style.display = 'none';
			addScreen.style.display = '';
			clickOn(document.getElementById('backBtn'));
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
	describe('without any additional config sections', () => {
		beforeEach(() => {
			loadOptionsCallback([]);
		});
		it('hides the custom section', () => {
			expect(sectionWithoutCustom.style.display).not.toBe('none');
			expect(sectionForCustom.style.display).toBe('none');
		});
	});
	describe('with additional config sections', () => {
		beforeEach(() => {
			loadOptionsCallback([
				{name: 'first', source: 'fi.json'},
				{name: 'second', source: 'se.json'},
				{name: 'third', source: 'th.json'}
			]);
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
			expect(browserInterface.saveOptions).toHaveBeenCalledWith([
				{ name: 'first', source: 'fi.json' },
				{ name: 'third', source: 'th.json' }
			]);
		});
	});

	afterEach(() => {
		underTest.remove();
	});
});
