# BugMagnet 3.0

## Easier to simmulate real user workflows

- [ ] Use clipboard copy/paste instead of directly manipulating field values
- [ ] test if paste works around multi-frame page/cross domain issue

## More secure to use

- [x] No longer needs full access to full content on all pages, just asks for an activeTab -- so no more horrible warning at start
- [x] No longer stays running in the background, connects/disconnects from your page after every click

## Easier to use

- [x] Active immediately after installation, even on pages already open (previous extensions required reloading open pages)

## Easier to customise

- [x] configure with a text area 
- [x] configure with a remote URL
- [x] better error reports when config loading fails
- [ ] allow users to disable standard config

## Full FireFox support

- [x] Support for Firefox Quantum
- [x] Install via Mozilla Add-ons repository
- [x] FF extension now has same features as Chrome (previously only a subset, custom config was not possible)

## Easier to contribute

- [x] modernise the dev environment
  - [x] kill grunt
  - [x] kill jscs/jshint
  - [x] use eslint
  - [x] use webpack for packaging
  - [x] use es6
- [x] clean up chrome packaging
- [x] install additional examples from github contributors
- [x] install additional examples from Humans vs Computers
- [x] update for firefox webextensions
- [x] simplify code/packaging after firefox spike
- [x] add tests for the config widget
- [x] run tests both in ff and chrome
