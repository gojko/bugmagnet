# BugMagnet 3.0

## Easier to simmulate real user workflows

- [x] option to use clipboard copy/paste instead of directly manipulating field values
  - [ ] add to firefox when the ff bug for optional permissions gets fixed (https://bugzilla.mozilla.org/show_bug.cgi?id=1422605)
- [x] Add/replace selection instead of always replacing the whole value

## More secure to use

- [x] No longer needs full access to full content on all pages, just asks for an activeTab -- so no more horrible warning at start
- [x] No longer stays running in the background, connects/disconnects from your page after every click

## Easier to use

- [x] Active immediately after installation, even on pages already open (previous extensions required reloading open pages)
- [x] A ton of new edge cases, including payment cards for popular providers, unicode edge cases, names

## Easier to customise

- [x] configure with a text area 
- [x] configure with a remote URL
- [x] better error reports when config loading fails
- [x] allow users to disable standard config
- [ ] add link to config instructions to the options page

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
- [ ] add contribution guide links to the menu 

