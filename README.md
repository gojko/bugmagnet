
Exploratory testing assistant for Chrome and Firefox. Adds common problematic values and edge cases to the context menu (right-click) for editable elements, so you can keep them handy and access them easily during exploratory testing sessions.  

## Features

* Convenient access to common boundaries and edge cases for exploratory testing
* Extend it with your own config files easily
* Works on input fields, text areas, content editable DIVs
* Works on multi-frame pages, but only if they are from the same domain
* Works in Chrome and Firefox
* Tiny overhead per page (<1k), no 3rd party library dependencies, completely passive, so it does not interfere with your web app execution in any way

## Usage

The easiest way to install the extension is from the [Chrome Web store](https://chrome.google.com/webstore/detail/efhedldbjahpgjcneebmbolkalbhckfi) or [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/bug-magnet/).

After installation, just right-click on any editable item on the page and you'll see a Bug Magnet submenu. Click an item there, and it will be inserted into the editable field.

## Credential management with Azure Key Vault

Bug Magnet can automatically fill login forms using credentials stored in Azure Key Vault. A **Test Accounts** submenu appears when one or more accounts are configured.

### Configuring credentials

1. Open the extension options page and locate **Credential Settings**.
2. Enter your Vault URL and either a Personal Access Token or an Azure AD token.
3. Provide a JSON array of account identifiers (for example `["user@example.com"]`).
4. Click **Save**. Your accounts will become available under **Test Accounts** in the context menu.

### Using the credential filler

1. Right‑click a text field on a login form and choose the desired account from **Test Accounts**.
2. The extension fills the username, retrieves the password from Azure Key Vault and submits the form. If the password field appears on a subsequent page, it waits for the page load and fills the password there.
3. If authentication fails, a prompt allows you to enter the correct password, which is then stored back in Azure Key Vault.

### Secret naming

Account identifiers are transformed into secret names before looking them up in the vault:

* `.` → `-`
* `@` → `--`
* `_` → `---`

For instance `user_example@test.email.com` becomes `user---example--test-email-com`.

## Installation from source

Clone the repository and install dependencies:

```bash
npm run install-deps
```

To build the extension files run:

```bash
npm run pack-extension
```

This command automatically installs any missing dependencies, copies static assets and bundles the code. It creates a `pack` directory containing the packaged extension, including the manifest and static assets. In Chrome open `chrome://extensions`, enable *Developer mode* and choose **Load unpacked** pointing to this directory.
The extension now uses Manifest V3 with a background service worker. Older Chromium builds may not support this format.

On Windows you can package the extension and produce a zip archive by running:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\package-extension.ps1
```

The script installs dependencies, builds the extension and creates `bugmagnet-extension.zip` for easy distribution.

To run the automated test suite:

```bash
npm test
```

## More infomation 

* [What's new in the latest version?](https://bugmagnet.org/v3.html)
* [How to install and use BugMagnet?](https://bugmagnet.org/using.html)
* [How to contribute or support development?](https://bugmagnet.org/contributing.html)
* [How to customise menus?](https://bugmagnet.org/customising.html)
* [Developer Guide](CONTRIBUTING.md)
* [Resources about edge cases in BugMagnet menus](https://bugmagnet.org/resources.html).

## Authors 

* [Gojko Adzic](https://gojko.net) 
* [@bbbco](http://twitter.com/bbbco) (old Firefox Addon)

----

## Icon credit

Magnet icon from [Woothemes Ultimate Icon Set by Nishan Sothilingam](http://iconfindr.com/1vSsaKB)
