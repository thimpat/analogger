
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
const {AnaLogger}  = require("analogger");
AnaLogger.startLogger();

// Use console method with new formatting
console.log("something");
```

<br/>

### Generate an AnaLogger instance

```javascript
const {analogger}  = require("analogger");
analogger.log("something");
```

<br/>

### Getting AnaLogger main instance

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


| **Options**      | **default** | **Expect**                        | **Description**                                                                    | 
|------------------|-------------|-----------------------------------|------------------------------------------------------------------------------------|
| silent           | false       | boolean                           | _Hide logs from console (not errors)_                                              |
| hideLog          | false       | boolean                           | _Same as above (silent has precedence over hideLog)_                               |              
| hideError        | false       | boolean                           | _Hide errors from console_                                                         |              
| hideHookMessage  | false       | boolean                           | _Hide the automatic message shown when some native console methods are overridden_ |
| hidePassingTests | false       | boolean                           | _Hide Live test results_                                                           |           
| logToDom         | false       | string (DOM Selector)             | _display log in a DOM container_                                                   |
| logToFile        | false       | string (File path)                | _write log to a file if running from Node_                                         |
| logToRemote      | undefined   | string (URL)                      | _Send log to a remote (more info in the next version)_                             |
| logMaxSize      | 0           | number                            | _Set maximum size for the log file_                                                |
| compressArchives      | false       | boolean                           | _Whether to archive and compress the logs after deleting an archive_               |
| addArchiveTimestamp      | true        | boolean                           | _Whether to add a timestamp to the generated rotated logs_                         |
| logMaxArchives      | 3           | number                            | _Maximum number of log files to use_                                               |
| requiredLogLevel | "LOG"       | "LOG" / "INFO" / "WARN" / "ERROR" | _Define the log level from which the system can show a log entry_                  |
| enableDate       | false       | boolean                           | _Show date + time (instead of time only)_                                          |

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
// See in the screenshot section below how to enable the plugin
anaLogger.lid({takeScreenshot: true, lid: 1000}, `Example 1`)
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


### setContexts()

#### Contexts

A context allows grouping the logs by functionality by assigning them some colour.


##### Examples

```javascript
const LOG_CONTEXTS = {STANDARD: null, TEST: {color: "#B18904"}, C1: null, C2: null, C3: null, DEFAULT: {}}
const DEFAULT_LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", USER: "USER"};

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


You can apply a default settings for every output with setDefaultContext 


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


---


### setTargets() / setActiveTarget()

#### Targets

Targets allow defining some log categories. For example, they can be developers, roles, etc.
setActiveTarget() allows hiding logs from other devs or roles.

##### Examples

```javascript

// "ALL" & "USER" are predefined targets
const LOG_TARGETS = ["GROUP1", "GROUP2", "TOM", "TIM"/*, "ALL", "USER"*/];

// Contexts define how the log should be seen 
const LOG_CONTEXTS = {STANDARD: null, TEST: {color: "#B18904", symbol: "⏰"}, C1: null, C2: null, C3: null, DEFAULT: {}}

anaLogger.setContexts(LOG_CONTEXTS);

// Allowed targets = "ALL", "TOM", "TIM", "USER"
anaLogger.setTargets("GROUP1", "GROUP2", "TOM", "TIM"/*, "ALL", "USER"*/); 

// Assign an active target
anaLogger.setActiveTarget("TOM");                          // <- You are "TOM"

// Seen as TOM
anaLogger.log({target: "TOM"}, `Testing log 1`);           // You will see this

// Not seen (only for TIM)
anaLogger.log({target: "TOM"}, `Testing log 2`);           // You will not see this


anaLogger.setActiveTarget(["TOM", "GROUP1"]);
anaLogger.log({target: "TOM"}, `Testing log 3`);           // You will see this
anaLogger.log({target: "TIM"}, `Testing log 4`);           // You will not see this
anaLogger.log({target: "GROUP1"}, `Testing log 5`);        // You will see this

// No target defined. Everybody sees this
anaLogger.log({context: null}, `Testing log 6`);           // You will see this    
anaLogger.log(`Testing log 4`);                            // You will see this. No context = "ALL"


```

To assign the active target, you could use IPs, read a file, read an environment variable, etc. 
It is all up to your implementation.

Examples:

###### IP Based

```javascript
anaLogger.setTargets({DEV1: "192.168.12.45", DEV: "192.168.12.46"});
anaLogger.setActiveTarget(require('ip').address());   
```
<br/>

###### File based

```javascript
// Example 2: File  
anaLogger.setTargets({DEV1: "fg890234ru20u93r2303092pkid0293"});
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

> **"html-to-image"** is an external npm package that this module uses to take screenshots.

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

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Demo</title>
    <!-- Theme file available in node_modules/analogger/dist/ -->
    <link rel="stylesheet" href="./analogger.min.css">
    <style>
        .analogger {
            height: 340px;
            width: 420px;
        }

        .image-container
        {
            display: block;
            background: rgb(222, 199, 189);
            position: absolute;
            height: 100%;
            left: 496px;
            overflow: auto;
            text-align: right;
            right: 0;
            top: 0;
            bottom: 0;
        }

        .screenshot-container img
        {
            height: 340px;
            width: 420px;
        }
    </style>
</head>
<body>

<button id="send-to-remote" class="add-button">Send log to remote</button>
<button id="take-screenshot" class="add-button">Take a screenshot</button>

<!-- Client logging view (We'll be sending logs to both this view and the remote ) -->
<div id="analogger" class="analogger">
</div>

<!-- This file is in the AnaLogger module_directory.  
Note that you could use a version from the html-to-image module directly at:
https://www.npmjs.com/package/html-to-image
 -->
<script src="browser/html-to-image.js"></script>

<!-- For this file, see 4. Link AnaLogger to the remote  -->
<script type="module" src="./demo-remote.mjs"></script>

</body>
</html>
```

<br/>

4. **Link AnaLogger to the remote**

<br/>

JavaScript (**./demo-remote.mjs**)
```javascript
// Load the AnaLogger library ( Available in ./node_modules/analogger/browser/ )
import {anaLogger} from "./browser/ana-logger.mjs";

// Register plugin
import {PLUGIN_NAME} from "./browser/html-to-image-plugin.mjs";

/**
 * Create a container to draw the screenshot
 * @returns {HTMLDivElement}
 */
const buildImageContainer = () =>
{
    const item = document.createElement("div");
    document.body.appendChild(item);
    item.classList.add("image-container");
    item.id = "image-container";
    return item;
};

/**
 * AnaLogger is about to trigger a screenshot using the html-to-image module
 * https://www.npmjs.com/package/html-to-image
 * @returns {boolean}
 */
const takeScreenshot = ($container) =>
{
    try
    {
        document.getElementById("image-container").style.display = "none";
        const box = document.body;

        let canvasWidth = box.offsetWidth;
        let canvasHeight = box.offsetHeight;

        const desiredHeight = 380;
        if (canvasHeight > desiredHeight)
        {
            canvasWidth = Math.floor(desiredHeight / canvasHeight * canvasWidth);
            canvasHeight = desiredHeight;
        }

        // Trigger the plugin has its name is passed to the context
        anaLogger.log({
            lid                                : 1234,          // <= Random number
            [PLUGIN_NAME] /** takeScreenshot */: {
                /**
                 * Tell the plugin from which div to generate the screenshot
                 */
                divSource: box,
                /**
                 * AnaLogger has called the plugin, and we have the data image,
                 * however data have not been uploaded yet
                 * @returns {boolean}
                 * @param event
                 */
                onScreenshot: function displayScreenshotInDom(event)
                {
                    // Add image to DOM
                    document.getElementById("image-container").style.display = "block";
                    const img = new Image();
                    img.src = event.imageData;
                    $container.append(img);
                },
                /**
                 * The server has saved the screenshot on the machine host.
                 * @param response
                 * @returns {boolean}
                 */
                onResponse: function ({serverResponse})
                {
                    const {message, success, urlPath} = serverResponse;

                    if (!success)
                    {
                        console.error({lid: 3007}, "Something went wrong server-side", message, urlPath)
                        return false;
                    }
                    console.log({lid: 3008}, message, urlPath)
                    return true;
                },
                options   : {
                    canvasHeight,
                    canvasWidth,
                }
            }
        }, `Taking screenshot...`);

        return true;
    }
    catch (e)
    {
        console.error({lid: 4321}, e.message);
    }

    return false;
};

const init = () =>
{
    try
    {
        let $container = buildImageContainer();

        anaLogger.validatePlugin(PLUGIN_NAME);
        anaLogger.setOptions({
            logToRemote: true,
            logToRemoteUrl: "http://192.168.2.12:8754/analogger",               // To log standard entries (log, errors)
            logToRemoteBinaryUrl: "http://192.168.2.12:8754/uploaded",          // To process screenshot data
            logToDom: true
        });
        
        anaLogger.log({lid: 1232}, `AnaLogger set up to work with remote`);

        document.getElementById("send-to-remote").addEventListener("click", () =>
        {
            anaLogger.log({lid: 1232}, `Sending a random number to the remote: ${Math.random()}`);
        });

        document.getElementById("take-screenshot").addEventListener("click", () =>
        {
            takeScreenshot($container)
        });
    }
    catch (e)
    {
        anaLogger.error({lid: 4321}, e.message);
    }
};

init();

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
│   └─ 📝 ana-logger.cjs                         ⇽ AnaLogger Node version for CommonJs (60.1k)
│   
└───📁 esm
│   │
│   └─ 📝 ana-logger.mjs                         ⇽ AnaLogger Node version for ES Modules (62.0k)
│   
└───📁 browser (ESM)
│   │─ 📝 ana-logger.mjs                         ⇽ AnaLogger browser version (62.0k)
│   │─ 📝 html-to-image-plugin.mjs               ⇽ AnaLogger plugin (3.7k)
│   └─ 📝 html-to-image.js                       ⇽ Original plugin minified (required for the above plugin to work)
│ 
└───📁 dist (minified)
│   │─ 📝 analogger.min.css                      ⇽ Default Theme file (1.9k)
│   │─ 📝 ana-light.min.css                      ⇽ Another Theme file (2.8k)
│   │─ 📝 analogger-browser.min.mjs              ⇽ AnaLogger browser version (30.8k)
│   │─ 📝 html-to-image-plugin.min.mjs           ⇽ AnaLogger plugin (30.8k)

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
