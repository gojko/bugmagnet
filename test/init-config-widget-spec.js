/*global describe, it, expect, beforeEach, afterEach, jasmine */
const initConfigWidget = require('../src/lib/init-config-widget');
describe('initConfigWidget', function () {
	'use strict';
	const template = `
		<div role="status" class="status"></div>
		<div id="mainScreen" role="main-screen">
			<div role="no-custom"></div>
			<div role="yes-custom"></div>
			<table>
				<tr role="template">
					<td role="name"></td>
					<td role="source" class="sourceCell"></td>
					<td><button role="remove">Remove</button></td>
				</tr>
			</table>
			<button id="addBtn" role="add">Add Configuration File</button>
			<button id="closeBtn" role="close">Close</button>
		</div>
		<div id="addScreen" role="file-loader">
			<form id="form">
				<input type="text" role="submenu-name" required="true" />
				<div role="buttons">
					<button role="select-file-cover">Select File</button>
					<button id="backBtn" role="back">Cancel</button>
				</div>
				<input type="file" role="file-selector" class="file-selector"/>
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
	let underTest, browserInterface;
	beforeEach(() => {
		underTest = document.createElement('div');
		underTest.innerHTML = template;
		document.body.append(underTest);
		browserInterface = jasmine.createSpyObj('browserInterface', ['readFile', 'saveOptions', 'closeWindow', 'loadOptions']);
	});
	describe('initial setup', () => {
		let mainScreen, addScreen;
		beforeEach(() => {
			initConfigWidget(underTest, browserInterface);
			mainScreen = document.getElementById('mainScreen');
			addScreen = document.getElementById('addScreen');
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
		});
	});

	afterEach(() => {
		underTest.remove();
	});
});
