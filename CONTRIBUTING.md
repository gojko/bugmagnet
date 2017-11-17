# Contributing to Bug Magnet

BugMagnet uses WebPack for packaging, Jasmine for tests (executed via Testem) and ESLint for linting. All the main scripts are in `package.json`

## Set up a local development environment

```bash
npm i
```

## Package the extension

```bash
npm run pack-extension
```

This will create and copy the files in the `pack` dir. You can then zip that up and distribute as an extension, or just load into a browser as an unpacked extension. (check out how to do this in [Chrome](https://developer.chrome.com/extensions/getstarted#unpacked) or [Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox)).

## Run dev tests

```bash
npm t
```

### Run a subset of tests

```bash
npm t --bugmagnet:test_filter=<prefix of the test file name>
```

for example

```bash
npm t --bugmagnet:test_filter=execute-request
```

### Find out the actual source code from a test failure report

```bash
npm run sourcemap <packed URL without the origin and starting />
```

For example, given this test report:

```bash
11) [Chrome 61.0] executeRequest size generator sets the field content to a text of specified size by multiplying the template
     TypeError: handler is not a function

     TypeError: handler is not a function
         at UserContext.<anonymous> (http://localhost:7357/testem/compiled/common/execute-request-spec.js:165:4)
         at attempt (http://localhost:7357/jasmine/jasmine.js:4289:46)
         at QueueRunner.run (http://localhost:7357/jasmine/jasmine.js:4217:20)
         at QueueRunner.execute (http://localhost:7357/jasmine/jasmine.js:4199:10)
         at Spec.queueRunnerFactory (http://localhost:7357/jasmine/jasmine.js:909:35)
         at Spec.execute (http://localhost:7357/jasmine/jasmine.js:526:10)
         at UserContext.fn (http://localhost:7357/jasmine/jasmine.js:5340:37)
         at attempt (http://localhost:7357/jasmine/jasmine.js:4297:26)
         at QueueRunner.run (http://localhost:7357/jasmine/jasmine.js:4217:20)
         at QueueRunner.execute (http://localhost:7357/jasmine/jasmine.js:4199:10)
```

you can find out the actual error line using

```
npm run sourcemap testem/compiled/common/execute-request-spec.js:165:4
```

### Run tests in an open browser session (for debugging)

```
npm run test-browser
```

This will automatically watch the source and test folders and re-run tests as the files change. The `--bugmagnet:test_filter` trick also works here to restrict the test run to only a subset.
