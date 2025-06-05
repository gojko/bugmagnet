/*global chrome*/
(function () {
        'use strict';
        const fillAndSubmit = function (username, password) {
                        const userField = document.querySelector('input[type=email], input[name*=email], input[name*=user], input[type=text]');
                        if (userField) {
                                userField.focus();
                                userField.value = username;
                                userField.dispatchEvent(new Event('input', {bubbles: true}));
                                userField.dispatchEvent(new Event('change', {bubbles: true}));
                                const passField = document.querySelector('input[type=password]');
                                if (passField) {
                                        passField.focus();
                                        passField.value = password;
                                        passField.dispatchEvent(new Event('input', {bubbles: true}));
                                        passField.dispatchEvent(new Event('change', {bubbles: true}));
                                        passField.form && passField.form.submit();
                                } else {
                                        userField.form && userField.form.submit();
                                        window.addEventListener('load', () => {
                                                const pf = document.querySelector('input[type=password]');
                                                if (pf) {
                                                        pf.focus();
                                                        pf.value = password;
                                                        pf.dispatchEvent(new Event('input', {bubbles: true}));
                                                        pf.dispatchEvent(new Event('change', {bubbles: true}));
                                                        pf.form && pf.form.submit();
                                                }
                                        });
                                }
                        }
                        setTimeout(checkForErrors, 2000, username);
                },
                checkForErrors = function (account) {
                        const text = document.body && document.body.textContent;
                        if (/invalid|error|incorrect|auth/i.test(text)) {
                                const newPass = window.prompt('Login failed. Enter new password:');
                                if (newPass) {
                                        chrome.runtime.sendMessage({type: 'updatePassword', username: account, password: newPass});
                                }
                        }
                };
        chrome.runtime.onMessage.addListener(function (request) {
                if (request && request.username) {
                        fillAndSubmit(request.username, request.password);
                }
        });
})();
