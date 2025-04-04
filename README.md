
[![Test workflow](https://github.com/thimpat/analogger/actions/workflows/test.yml/badge.svg)](https://github.com/thimpat/analogger/actions/workflows/test.yml)
[![nycrc Coverage](https://img.shields.io/nycrc/thimpat/analogger?preferredThreshold=lines)](https://github.com/thimpat/analogger/blob/main/README.md)
[![Version workflow](https://github.com/thimpat/analogger/actions/workflows/versioning.yml/badge.svg)](https://github.com/thimpat/analogger/actions/workflows/versioning.yml)
[![npm version](https://badge.fury.io/js/analogger.svg)](https://www.npmjs.com/package/analogger)
<img alt="semantic-release" src="https://img.shields.io/badge/semantic--release-19.0.2-e10079?logo=semantic-release">

---

Analogger is a logger for Node and Browser environments that is highly customizable.
It logs to terminals, browser DOM and inspectors and files.

## Installation

```shell
npm install analogger
```

<br/>

---

## Usage

### CommonJs (in Node)

```javascript
const {anaLogger}  = require("analogger");
```

<br/>

### ESM (in Node)

```javascript
import {anaLogger} from "analogger"
```

<br/>

### As ESM module (In the Browser)

```html
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <title>Demo</title>

 <!-- AnaLogger Theme -->
 <link rel="stylesheet" href="../dist/analogger.min.css">

 <!-- or another AnaLogger Theme 
  <link rel="stylesheet" href="../dist/ana-light.min.css">
 -->
 
</head>
<body>

<div id="analogger" class="analogger">
</div>

<!-- AnaLogger Main -->
<script type="module">
 import {anaLogger} from "../dist/analogger-browser.min.mjs";
 anaLogger.applyPredefinedFormat();
 anaLogger.setOptions({logToDom: "#analogger"});
 anaLogger.log({lid: 100000}, "Test Log example C1");
</script>

</body>
</html>
```

<br/>

### In the Browser via a module bundler

```javascript
// Read your module bundler documentation to load a style file
import "./node_modules/analogger/dist/analogger.min.css"
import {anaLogger} from "./node_modules/analogger/dist/analogger-browser.min.mjs";
```

<br/>

---


### Preview

#### Terminal
![img_1.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_3.png)

#### Inspector
![img.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_2.png)

#### DOM
![img.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_4.png)

#### FileSystem
![img.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_5.png)

#### Remote logging
![Preview](https://github.com/thimpat/demos/blob/main/remote-logging/images/preview-1.png "Remote Logs")

<br/>

---

## Quick start

### Start logging with AnaLogger

```javascript
const {anaLogger}  = require("analogger");
anaLogger.log("something");
```

### Start logging with AnaLogger and override the console

```javascript
const {AnaLogger}  = require("analogger");
// This call will override the console methods
AnaLogger.startLogger();

// Use console method with new formatting
console.log("something");
```

<br/>

### Generate another AnaLogger instance
If you want to have different logger with different purposes, you can create multiple instances.
You may want to have a logger that writes to a file specific information, while another one sends its logs to a remote server for instance.

```javascript
// Get the class first
const {AnaLogger}  = require("analogger");
const analogger = new AnaLogger();
analogger.log("something");
```

<br/>

### Using main instance

```javascript
// Get the main instance directly
const {anaLogger}  = require("analogger");
analogger.log("something");
```

<br/>

### Getting AnaLogger main instance

Now, that you have multiple instances, you may want to retrieve the main instance by calling the getInstance method.

```javascript
const {AnaLogger}  = require("analogger");
const myConsole = AnaLogger.getInstance(0);      // Retrieve first instance => (0)
myConsole.log("something");
```

<br/>



---


## API

<br/>

### log() / info() / warn() / error()

Display a message in the terminal or the inspector, depending on where the process runs.

#### Example 1

```javascript
anaLogger.log(`I'am some log`);
anaLogger.info(`I'am some log`);
anaLogger.warn(`I'am some log`);
anaLogger.error(`I'am some log`);
```
<br/>


#### Example 2

###### Display log in red

```javascript
anaLogger.log({color: "red"}, `I am some log in red`);
```

<br/>

###### Display log in blue on red in bold and underlined 

```javascript
anaLogger.log({color: "blue", bgColor: "red", underline: true, bold: true}, `I am some log in blue on a red 
background in bold and underlined`);
```

<br/>

#### Example 3

###### Change log color and symbol

```javascript
anaLogger.log({color: "#00FFAA", symbol: "🎧"}, `I'am some log in red`);
```

<br/>

#### Example 4

###### Set Log ID

```javascript
anaLogger.log({lid: 1234}, `I'am some log with log id`);
```

<br/>

#### Example 5

###### Set symbol by name

```javascript
anaLogger.log({lid: 1234, symbol: "check"}, `I'am some log with a check symbol`);
anaLogger.log({lid: 1235, symbol: "radioactive"}, `I'am some log with a radioactive symbol`);
anaLogger.log({lid: 1236, symbol: "scissors"}, `I'am some log with some scissors symbol`);
```

💻  ↴
>```shell
> [01:16:11]           : (1234) ✔  "I'am some log with a check symbol"
> [01:16:11]           : (1235) ☢  "I'am some log with a radioactive symbol"
> [01:16:11]           : (1236) ✂  "I'am some log with some scissors symbol"
>```

<br/>

---

### listSymbols()

Display the list of supported symbols.

```javascript
Analogger.listSymbols()
```

💻  ↴
>```prettier
> ✈   airplane 
> ⚓   anchor
> ◀   arrow_backward
> ↘   arrow_lower_right
> ↙   arrow_lower_left
>
>... (And more)
>```

---


### alert()

```javascript
anaLogger.alert(`I'am some log`);
```

Display the browser native message box if run from it; otherwise, it displays the message in the terminal.

<br/>

---


### setOptions()


| **Options**         | **default** | **Expect**                        | **Description**                                                                    | 
|---------------------|-------------|-----------------------------------|------------------------------------------------------------------------------------|
| silent              | false       | boolean                           | _Hide logs from console (not errors)_                                              |
| hideLog             | false       | boolean                           | _Same as above (silent has precedence over hideLog)_                               |              
| hideError           | false       | boolean                           | _Hide errors from console_                                                         |              
| hideHookMessage     | false       | boolean                           | _Hide the automatic message shown when some native console methods are overridden_ |
| hidePassingTests    | false       | boolean                           | _Hide Live test results_                                                           |           
| logToDom            | false       | string (DOM Selector)             | _display log in a DOM container_                                                   |
| logToFile           | false       | string (File path)                | _write log to a file if running from Node_                                         |
| logToRemote         | undefined   | string (URL)                      | _Send log to a remote (more info in the next version)_                             |
| logMaxSize          | 0           | number                            | _Set maximum size for the log file_                                                |
| compressArchives    | false       | boolean                           | _Whether to archive and compress the logs after deleting an archive_               |
| compressionLevel    | 1           | number                            | _Archive compression level (0 to 9 with 0 = no compression)_                       |
| addArchiveTimestamp | true        | boolean                           | _Whether to add a timestamp to the generated rotated logs_                         |
| logMaxArchives      | 3           | number                            | _Maximum number of log files to use_                                               |
| requiredLogLevel    | "LOG"       | "LOG" / "INFO" / "WARN" / "ERROR" | _Define the log level from which the system can show a log entry_                  |
| enableDate          | false       | boolean                           | _Show date + time (instead of time only)_                                          |

<br/>

```javascript
// No hook alert message + Log messages in the div #analogger
anaLogger.setOptions({hideHookMessage: true, logToDom: "#analogger"})
```

<br/>

#### Examples

##### Write logs to file only

```javascript
anaLogger.setOptions({silent: true, logToFile: logFilePath});
```

<br/>

##### Write logs to both file and console

```javascript
anaLogger.setOptions({silent: false, logToFile: logFilePath});
```

<br/>
<br/>

---

##### Write logs to a remote server

```javascript
// Use a predefined remote server
anaLogger.setOptions({logToRemote: true});                                           

// Use your remote server (You are responsible for the back-end implementation)
anaLogger.setOptions({logToRemoteUrl: "http://your.server.com/data"});                  
```

> Your server must support the POST method.


<br/>

##### Example

_The data received by your server may look like this:_

```json
[
    [{"lid": 123888, "color": "blue"}, "My message 1"], 
    [{"lid": 123999, "color": "#654785"}, "My message 2"]
]
```

> Your server must support the POST method.


<br/>
<br/>

---

<br/>

### Write logs to the Remote Logging module

You can also use the Remote-Logging module if you don't want to implement the back-end.


> ###### https://www.npmjs.com/package/remote-logging

> ##### Note that Remote Logging is free to use, with no license as there is no use in bundle it in an application.

<br/>

#### 1- Launch a remote from the command line

```shell
$> npx remote-logging

# or if AnaLogger is installed globally
$> analogger
```

> ##### If you're on Windows, the system may ask you permission to reach the port. Select private access.

> ##### On Linux, You will have to open port 12000 by default. To change it, pass the option --port number to the command above.

<br/>

#### 2- Copy the server URL in the AnaLogger options (In your client code)

![Copy URL](https://github.com/thimpat/analogger/blob/main/docs/images/img_7.png "Remote Logs")

```javascript

// Enable log to remote
anaLogger.setOptions({logToRemote: true});                  // <= By default, if only this option is set,
                                                            // logToRemote will be set to "http://localhost:12000/analogger"


// Enter server URLs
anaLogger.setOptions({logToRemoteUrl: "http://192.168.1.20:2000/analogger"});           // Standard message       
anaLogger.setOptions({logToRemoteBinaryUrl: "http://192.168.1.20:2000/uploaded"});      // Screenshots            
```

<br/>


#### 3- That's it


Every call to anaLogger.log will send the log to your server

```javascript
anaLogger.log({lid: 1000}, `Example 1`)
```

```javascript
anaLogger.lid({lid: 1000}, `Example 1`)
```

```shell
# Test the server is listening from the command line
> curl --request POST 'http://localhost:12000/analogger' --header 'Content-Type: application/json' --data-raw '[[{"lid": 123888, "color": "blue"}, "My message 1"], [{"lid": 123999, "color": "blue"}, "My message 2"]]
```

> ![Test from CLI](https://github.com/thimpat/analogger/blob/main/docs/images/img_8.png "Remote Logs")

<br/>

##### Example

_Data received by your server may look like this:_

```json
[
    [{"lid": 123888, "color": "blue"}, "My message 1"], 
    [{"lid": 123999, "color": "#654785"}, "My message 2"]
]
```

<br/>

> ##### 
> ```
> Scroll down to the bottom to see a complete example
> ```
>  


<br/>

---

### attachConsole();

Allows to use of the methods defined in the anaLogger instance directly from the console

```javascript

// Attach methods like keepLogHistory(), hasSeenLid(), etc. to the console
anaLogger.attachConsole();

console.keepLogHistory();

[1, -1, 3, -1, -1].forEach((n) =>
{
    if (n === -1)
    {
      if (!console.hasSeenLid(3000))
      {
         console.log({lid: 3000}, `-1 is not allowed`);          
      }        
    }
})

```

<br/>

---

### overrideConsole()

```javascript
anaLogger.setOptions({silent: true, hideError: false})
console.log(`Log Before override`);
anaLogger.overrideConsole()
console.log(`Log After override`);
```

Override **console.log**, **console.info** and **console.warn**. If you already have many console.log running in your system,
it allows hiding them all in one go.

In this example, the terminal (or inspector) will not show the message "Log After override". All following messages
either.

<br/>

---

### overrideError()

Same as above, but for **console.error**.

<br/>

---


### removeOverride() | removeOverrideError()

Remove overridden console methods.

<br/>

---


### rawLog() | rawInfo() | rawWarn() | rawInfo()

Use native console format after overrides.

```javascript
anaLogger.overrideConsole();
console.log(`Example 1`);              // <= Will use new format
console.rawLog(`Example 2`);           // <= Will use native format

console.log({raw: true}, `Example 2`); // <= Will use native format
```

<br/>

---


### setContext()

#### Context

## Using `setContext` Method

The `setContext` method allows you to register a custom context with your `AnaLogger` instance. 
This context can then be used to provide specific formatting in your log messages.

### Example

```javascript
// Define a context
anaLogger.setContext('EMAIL_WORK', {
    lid: 1234,
    symbol: 'email',
    color: 'orange'
});

// Use the logger with the new context
anaLogger.log({lid: "EM1234", contextName: "EMAIL_WORK"}, 'This is a log message with the custom context.');
anaLogger.log({lid: "EM1235", contextName: "EMAIL_WORK"}, 'This is another log message using the same formatting as the above.');

```
---


### setContexts() 

#### Contexts

Context allow grouping logs by functionality.


##### Examples

```javascript
const LOG_CONTEXTS = {STANDARD: null, TEST: {color: "#B18904"}, C1: null, C2: null, C3: null, DEFAULT: {}}
const DEFAULT_LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", USER: "USER"};

// LOG_CONTEXTS will be modified by setContexts
anaLogger.setContexts(LOG_CONTEXTS);

anaLogger.log(LOG_CONTEXTS.C1, `Test Log example C1`);
anaLogger.log(LOG_CONTEXTS.C2, `Test Log example C2`);
anaLogger.log(LOG_CONTEXTS.C3, `Test Log example C3`);
```

See LOG_CONTEXTS.C1 in this example to categorize the functionality we want to monitor.
For instance, LOG_CONTEXTS.INVESTIGATING_TIMER_EFFECT could display output related to something that has to
do with a timer.

The "Testing log 2" log will not appear in the console or the terminal.

**Preview In a terminal (NodeJs)**

![img.png](https://github.com/thimpat/analogger/blob/main/docs/images/img.png)

**Preview In a browser (ESM)**

![img_1.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_1.png)


<br/>

---


### setDefaultContext()


You can apply a default settings for every output with setDefaultContext.
**All contexts inherit from the default context.**

##### Examples

```javascript

anaLogger.setDefaultContext({color: "gray", symbol: "check", contextName: "LOG"});

anaLogger.log({lid: 100000}, `Test Log example C1`);        // <- Use default (grey color and the check symbol)
anaLogger.log({lid: 100010}, `Test Log example C2`);        // <- Use default
anaLogger.log({lid: 100020}, `Test Log example C3`);        // <- Use default

anaLogger.log({contextName: "LOG", lid: 100030, symbol: "cross"}, "Test Log example C4");
anaLogger.log({contextName: "INFO", lid: 100040, symbol: "no_entry"}, "Test Log example C4");
anaLogger.log({contextName: "WARN", lid: 100050, symbol: "raised_hand"}, "Test Log example C4");

```

💻  ↴
> ```
> [04:32:38]        LOG: (100000) ✔  "Test Log example C1"
> [04:32:38]        LOG: (100010) ✔  "Test Log example C2"
> [04:32:38]        LOG: (100020) ✔  "Test Log example C3"
> [04:32:38]        LOG: (100030) ❌  "Test Log example C4"
> [04:32:38]       INFO: (100040) ⛔  "Test Log example C5"
> [04:32:38]       WARN: (100050) ✋  "Test Log example C6"
> ```


<br/>

#### Callbacks

You can also set some callbacks to be called when a log is about to be displayed. 

```javascript
anaLogger.setDefaultContext({
    /**
     * Allow to modify the context before it is used
     * @param context
     */
    onContext: function (context) {
        context.lid = "MOD12345";
    },
    /**
     * Allow to modify the raw message before it is displayed
     * @param rawMessage
     * @param extras
     * @returns {string}
     */
    onMessage: function (rawMessage, extras) {
        return rawMessage + " ↘";
    },
    /**
     * Allow to modify the formatted message before it is displayed
     * @param formattedMessage
     * @param logCounter
     * @returns {`${string}: ${string}`}
     */
    onOutput: function (formattedMessage, {logCounter}) {

        return `${logCounter}: ${formattedMessage}`;
    }
});

```

---


### setTargets() / setActiveTarget()

#### Targets

Targets allow filtering logs by targets. 
For example, they can be developers, testers, roles, etc.
and setActiveTarget() will ignore logs for non-targeted users.

##### Examples

```javascript

// "ALL" & "USER" are predefined targets
const LOG_TARGETS = ["GROUP1", "GROUP2", "TOM", "TIM"/*, "ALL", "USER"*/];

// Contexts define how the log should be seen 
const LOG_CONTEXTS = {STANDARD: null, TEST: {color: "#B18904", symbol: "⏰"}, C1: null, C2: null, C3: null, DEFAULT: {}}

// LOG_CONTEXTS will be modified by setContexts
anaLogger.setContexts(LOG_CONTEXTS);

// Allowed targets = "ALL", "TOM", "TIM", "USER"
anaLogger.setTargets("GROUP1", "GROUP2", "TOM", "TIM"/*, "ALL", "USER"*/); 

// Assign an active target
anaLogger.setActiveTarget("TOM");                          // <- You are "TOM"

// Seen because you're TOM
anaLogger.log({target: "TOM"}, `Testing log 1`);           // You will see this

// Not seen (only for TIM)
anaLogger.log({target: "MATT"}, `Testing log 2`);           // You will not see this

// Here we set the allowed targets
anaLogger.setTargets({TOM: "TOM", GROUP1: "GROUP1", GROUP2: "GROUP2"});
anaLogger.setActiveTargets(["TOM", "GROUP1"]);
anaLogger.log({target: "TOM"}, `You will see this`);
anaLogger.log({target: "TIM"}, `You will not see this`);
anaLogger.log({target: "GROUP1"}, `You will see this`);

// To work, we should have called `anaLogger.setTargets(["NonDefinedTarget"])`
anaLogger.setActiveTarget("NonDefinedTarget");
anaLogger.log({lid: "WEB35388"}, `You will not see this`);
anaLogger.log({lid: "WEB35388", target: "NonDefinedTarget"}, `You will not see this`);

// Clear the active target, so we can see everything
anaLogger.setActiveTarget(null);
anaLogger.log({lid: "WEB35388"}, `You will see this`);

// No target defined the active target will see this
anaLogger.log({context: null}, `Testing log 6`);           // You will see this    
anaLogger.log(`Testing log 4`);                            // You will see this


```

To assign the active target, you could use IPs, read a file, read an environment variable, etc. 
It is all up to your implementation.

Examples:

###### IP Based

```javascript
anaLogger.setTargets({DEV1: "192.168.12.45", DEV: "192.168.12.46"});
// or anaLogger.setTargets("192.168.12.45", "192.168.12.46")
anaLogger.setActiveTarget(require('ip').address());   
```
<br/>

###### File based

```javascript
// Example 2: File  
anaLogger.setTargets({DEV1: "fg890234ru20u93r2303092pkid0293"});
// or anaLogger.setTargets("fg890234ru20u93r2303092pkid0293")
anaLogger.setActiveTarget(require('./something.json').key);
```

<br/>

###### Fetch
```javascript
// Example 3: Fetch
anaLogger.setTargets({DEV1: "fg890234ru20u93r2303092pkid0293"});
const key = (await (await fetch('/private-api/me')).json()).key
anaLogger.setActiveTarget(key);
```

<br/>

###### Environment system based

```javascript
// Example 4: Environment variables
anaLogger.setActiveTarget(process.env.DEVELOPER);     // <= Assuming it has been set on the system host
```

<br/>

> Note that two targets cannot be overridden: {ALL: "ALL", USER: "USER"}.
The system always adds them to the allowed list, so they will still be set even if a call to setTargets() is empty.

```javascript
// Two implicit targets "ALL" and "USER"  
analogger.setTargets()
```

<br/>

---


### assert()

You can set some tests directly in the code. It serves as early feedback.
It is helpful to guarantee that the code runs straight away rather than waiting for the CI to send its feedback.


```javascript
anaLogger.assert(1 === 1)
anaLogger.assert(1 === 2)
anaLogger.assert(()=>true, true)
anaLogger.assert((a, b)=> a === b, true, 2, 2)
```

<br/>

---


### setErrorHandlerForUserTarget()

It tells whether a log has already been displayed. keepLogHistory must be activated

```javascript
anaLogger.keepLogHistory()

anaLogger.log({lid: 1234}, `My name is log`)
anaLogger.hasSeenLid(1234)          // true
anaLogger.hasSeenLid(1000)          // false

// Optional
anaLogger.releaseLogHistory()
```
<br/>
---

### isBrowser()()

It tells whether the console runs from the browser

```javascript
anaLogger.isBrowser()
```
<br/>

---
### keepLogHistory()

Keeps log entries in memory

```javascript
anaLogger.keepLogHistory()
```
<br/>
---

### releaseLogHistory()

It tells the system to no longer keep log entries in memory

```javascript
anaLogger.releaseLogHistory()
```
<br/>
---

### resetLogHistory()

Delete memorized log entries

```javascript
anaLogger.resetLogHistory()
```

<br/>
---

### getLogHistory()

Returns log entries

```javascript
anaLogger.getLogHistory()
```

<br/>
---


### setErrorHandlerForUserTarget()

When an error is detected and should be seen by your app consumers explicitly (for instance, you want to display a 
dialogue box
to them), you can set a handler here. All other console.error will be working as usual (logging messages). 

```javascript
    anaLogger.setErrorHandlerForUserTarget(function (context/*, ...args*/)
    {
        // Detect whether we are in a browser
        if (context.environment === anaLogger.ENVIRONMENT_TYPE.BROWSER)
        {
            // When the Browser detects an error, users will see this message
            anaLogger.alert(`Users explicitly see this message`)
        }
    });

    anaLogger.setActiveTarget(LOG_TARGETS.USER);
    anaLogger.error({target: LOG_TARGETS.USER}, "Salut user!");     // Display an alert box
    anaLogger.error("Hi user!");                                    // Log the message to the inspector
```

<br/>

---

## Multiple instances

It is possible to generate multiple AnaLogger instances so that they can point to different targets. 

### Example

```javascript
const AnaLogger = require("analogger");                 // or import AnaLogger from "analogger"
const anaLoggerInstance1 = new AnaLogger();
const anaLoggerInstance2 = new AnaLogger();

anaLoggerInstance1.setOptions({logToDom: ".analogger"});
anaLoggerInstance2.setOptions({logToFile: "./logme.log"});
```


<br/>

---

## Automated Tests

When combined with Remote-logger, you can use AnaLogger as a Mocha reporter.

See: https://www.npmjs.com/package/remote-logging

<br/>

![Preview](https://github.com/thimpat/demos/blob/main/remote-logging/images/rl-report.gif "Mocha Reporter")


<br/>

---

## Take a screenshot

### takeScreenshot()

You can take a screenshot via the "html-to-image" plugin (integrated in the module).

> **"html-to-image"** is an external npm package this module uses to take screenshots.

<br/>

1. **Run a logging server from the command line**

```shell
$> analogger --port 8754
```
<br/>

2. **Report the address displayed in the console into your client code**

![Browser to Remote Logging view](https://github.com/thimpat/demos/blob/main/remote-logging/images/rl-setup-1.png)

<br/>

3. **Set up the client (Browser in our case)**

HTML (Client-Side)

<br/>

4. **Link AnaLogger to the remote**

<br/>

```javascript
// Load the AnaLogger library ( Available in ./node_modules/analogger/browser/ )
import {anaLogger} from "./browser/ana-logger.mjs";

anaLogger.setOptions({logToRemote: "http://localhost:8754/analogger", loadHtmlToImage: true});
anaLogger.takeScreenshot({selector: "body"});
```

<br/>

---

## Plugins

### Implement a plugin

```javascript
// Load anaLogger
import {anaLogger}  from "./ana-logger.mjs";

// Implement
const doSomething = ({node = document.body, container = document.body} = {}) =>
{
    console.log(`Hello plugin`)
};

// Register the plugin
anaLogger.addPlugin("doSomething", doSomething);



```

---

## Package

```
📁 package                
│
└───📁 src
│   │
│   └─ 📝 ana-logger.cjs                         ⇽ AnaLogger Node version for CommonJs
│   
└───📁 esm
│   │
│   └─ 📝 ana-logger.mjs                         ⇽ AnaLogger Node version for ES Modules
│   
└───📁 browser (ESM)
│   │─ 📝 ana-logger.mjs                         ⇽ AnaLogger browser version
│ 
└───📁 dist (minified)
│   │─ 📝 analogger.min.css                      ⇽ Default Theme file
│   │─ 📝 ana-light.min.css                      ⇽ Another Theme file
│   │─ 📝 analogger-browser.min.mjs              ⇽ AnaLogger browser version

```

<br/>

---


## Changelog

##### current:
*  Add an option to show the date and time in logs
*  Make the alert method display the lid when detected
*  Keep format when displaying multiple lines for one entry


##### 1.23.2:
*  Remove the message 'No AnaLogger instance found'


##### 1.23.0:
*  Add startLogger method to automatically override the console


##### 1.22.1:
*  Fix screenshot endpoint
*  Fix remote breaking in browser due to misconfiguration


##### 1.22.0:
*  Review display for js primitive types
*  Use native console table
*  Set up AnaLogger as a Mocha reporter
*  Launch a remote from AnaLogger
*  Fix remote-related options passed to the setOptions method
*  Launch a remote server from the CLI


##### 1.21.4:
*  Default the remote to localhost when enabled

##### 1.21.0:
*  Restore the same behaviour as before for getLogHistory
*  Add functionalities to AnaLogger instances


##### 1.20.4:
*  Fix log level applied one level down
*  Update themes


##### 1.20.3:
*  Apply empty log id by default for contexts
*  Apply missing symbols


##### 1.20.2:
*  Add missing files from the build
*  Recolor title bar
*  Add a theme file
*  Add a header and o footer to the layout
*  Use native console table on browsers
*  Apply better environment detection
*  Review logToRemote option


##### 1.20.1:
*  Review sentence failure for screenshot
*  Fix plugin validation
*  Export and validate plugin names


##### 1.20.0:
*  Fix default address for remote binary
*  Fix error on a missing callback
*  Fix log displayed twice
*  Add takeScreenshot plugin

---
