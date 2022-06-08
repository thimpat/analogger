
[![Test workflow](https://github.com/thimpat/analogger/actions/workflows/test.yml/badge.svg)](https://github.com/thimpat/analogger/actions/workflows/test.yml)
[![nycrc Coverage](https://img.shields.io/nycrc/thimpat/analogger?preferredThreshold=lines)](https://github.com/thimpat/analogger/blob/main/README.md)
[![Version workflow](https://github.com/thimpat/analogger/actions/workflows/versioning.yml/badge.svg)](https://github.com/thimpat/analogger/actions/workflows/versioning.yml)
[![npm version](https://badge.fury.io/js/analogger.svg)](https://www.npmjs.com/package/analogger)
<img alt="semantic-release" src="https://img.shields.io/badge/semantic--release-19.0.2-e10079?logo=semantic-release">

---

Analogger is a logger for Node and Browser environments that is highly customisable.
It logs to terminals, browser DOM and inspectors and files.

## Installation

```shell
npm install analogger
```

<br/>

---

## Usage

### CommonJs

```javascript
const {anaLogger}  = require("analogger");
```

<br/>

### ESM

```javascript
import {anaLogger} from "analogger"
```

<br/>

### In the Browser

```html
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <title>Demo</title>

 <!-- AnaLogger Theme -->
 <link rel="stylesheet" href="../dist/analogger.min.css">

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

<br/>

---


## API

<br/>

### log() / info() / warn() / error()

Display a message in the terminal or the inspector, depending on where the process is running.

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


### table()

Display data in tabular format on the terminal.

```javascript
anaLogger.table(data, options)
```

<br/>

###### Options (for .table)

| names                | Expected | values | Description                                       |
|----------------------|----------|--------|---------------------------------------------------|
| ellipsis             | string   | "..."  | Characters to use when values don't fit           |
| ColumnMinChars       | number   | 6      | Minimum size for a column                         |
| columnMaxChars       | number   | 0      |                                                   |
| verticalSeparator    | string   | "│"    | Table vertical line symbols                       |
| horizontalSeparator  | string   | "─"    | Table horizontal line symbols                     |
 | availableLength      | number   | 0      | Maximum width for table. O for auto size          |
| onCompleteHeaders    | function | null   | Callback to call when headers line is ready       |
| onCompleteSeparators | function | null   | Callback to call when the separator line is ready |
| onCompleteLines      | function | null   | Callback to call when a line is complete          |

<br/>

> The callbacks **onCompleteHeaders, onCompleteSeparators, onCompleteSeparators** must return
> the modified first argument
> 
> For instance:
> ```javascript
> anaLogger.table(data, {
>    onCompleteLines: (textLine, objectLine) => {
> 
>        if (objectLine.name === "tom") {
>            return textLine;
>        }
> 
>        let newLine = "*" + textLine + "*";
>        return newLine;
>    }
> })
> ```

<br/>

#### Example

```javascript
    const table = [
    {
        "serverName"      : "Nubia",
        "silent"          : false,
        "defaultPage"     : "index.html",
        "port"            : 10040,
        "serverUrl"       : "http://localhost:10040/",
    },
    {
        "serverName"      : "Lavern",
        "silent"          : false,
        "defaultPage"     : "index.html",
        "port"            : 10050,
        "serverUrl"       : "http://localhost:10050/",
    },
    {
        "serverName"      : "Kristal",
        "silent"          : false,
        "defaultPage"     : "index.html",
        "host"            : "localhost",
        "port"            : 10060,
        "serverUrl"       : "http://localhost:10060/",
    }
];
anaLogger.table(table);
```

<br/>

###### Result:

```shell
serverName │ silent │ defaultPage  │ port  │ serverUrl                 │                                       
────────── │ ────── │ ──────────── │ ───── │ ───────────────────────── │                                       
Nubia      │ false  │ index.html   │ 10040 │ http://localhost:10040/   │                                       
Lavern     │ false  │ index.html   │ 10050 │ http://localhost:10050/   │                                       
Kristal    │ false  │ index.html   │ 10060 │ http://localhost:10060/   │ 
```

<br/>

---


### alert()

```javascript
anaLogger.alert(`I'am some log`);
```

Display the browser native message box if run from it; otherwise, it displays the message in the terminal.

<br/>

---


### setOptions()


| **Options**      | **default** | **Expect**            | **Description**                                                                    | 
|------------------|-------------|-----------------------|------------------------------------------------------------------------------------|
| silent           | false       | boolean               | _Will display no log (only errors)_                                           |
| hideLog          | false       | boolean               | _Hide logs from console_                                                           |              
| hideError        | false       | boolean               | _Hide errors from console_                                                         |              
| hideHookMessage  | false       | boolean               | _Hide the automatic message shown when some native console methods are overridden_ |
| hidePassingTests | false       | boolean               | _Hide Live test results_                                                           |           
| logToDom         | false       | string (DOM Selector) | _display log in a DOM container_                                                   |
| logToFile        | false       | string (File path)    | _write log to a file if running from Node_                                         |


```javascript
// No hook alert message + Log messages in the div #analogger
anaLogger.setOptions({hideHookMessage: true, logToDom: "#analogger"})
```
<br/>
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
```

<br/>

---


### setContexts()

#### Contexts

A context allows grouping the logs by functionality by assigning them some colour.


##### Examples

```javascript
const LOG_CONTEXTS = {STANDARD: null, TEST: {color: "#B18904"}, C1: null, C2: null, C3: null, DEFAULT: {}}
const LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", USER: "USER"};

anaLogger.setContexts(LOG_CONTEXTS);

anaLogger.log(LOG_CONTEXTS.C1, `Test Log example C1`);
anaLogger.log(LOG_CONTEXTS.C2, `Test Log example C2`);
anaLogger.log(LOG_CONTEXTS.C3, `Test Log example C3`);
```

See LOG_CONTEXTS.C1 in this example to categorise the functionality we want to monitor.
For instance, LOG_CONTEXTS.INVESTIGATING_TIMER_EFFECT could display output related to something that has to
do with a timer.

The "Testing log 2" log will not show up in the console or the terminal.

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
const LOG_CONTEXTS = {STANDARD: null, TEST: {color: "#B18904", symbol: "⏰"}, C1: null, C2: null, C3: null, DEFAULT: {}}
const LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", USER: "USER"};

anaLogger.setContexts(LOG_CONTEXTS);
anaLogger.setTargets(LOG_TARGETS);                                    // Allowed targets = "ALL", "TOM", "TIM", "USER"

// Many ways to assign an active target
anaLogger.setActiveTarget(LOG_TARGETS.DEV1);                          // <- You are "TOM"

// Seen as TOM
anaLogger.log({target: LOG_TARGETS.DEV1}, `Testing log 1`);           // You will see this
anaLogger.log({target: "TOM"}, `Testing log 1`);                      // You will see this

// Not seen (only for TIM)
anaLogger.log({target: LOG_TARGETS.DEV2}, `Testing log 2`);           // You will not see this
anaLogger.log({target: "TIM"}, `Testing log 2`);                      // You will not see this

// No target defined. Everybody sees this
anaLogger.log({context: LOG_CONTEXTS.STANDARD}, `Testing log 3`);     // You will see this    
anaLogger.log(`Testing log 4`);                                       // You will see this. No context = LOG_CONTEXTS.ALL


anaLogger.log(LOG_CONTEXTS.C1, `Test Log example C1`);               // You will see this
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
It is helpful to guarantee that the code is running straight away rather than waiting on the CI to send its feedback.


```javascript
anaLogger.assert(1 === 1)
anaLogger.assert(1 === 2)
anaLogger.assert(()=>true, true)
anaLogger.assert((a, b)=> a === b, true, 2, 2)
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
        if (context.environnment === anaLogger.ENVIRONMENT_TYPE.BROWSER)
        {
            // When the Browser detects an error, users will see this message
            anaLogger.alert(`Users explicitly see this message`)
        }
    });

    anaLogger.setActiveTarget(LOG_TARGETS.USER);
    anaLogger.error({target: LOG_TARGETS.USER}, "Salut user!");     // Display an alert box
    anaLogger.error("Hi user!");                                    // Log the message to the inspector
```

## Multiple instances

It is possible to generate multiple AnaLogger instances, so they can point to different targets. 

### Example

```javascript
const AnaLogger = require("analogger");                 // or import AnaLogger from "analogger"
const anaLoggerInstance1 = new AnaLogger();
const anaLoggerInstance2 = new AnaLogger();

anaLoggerInstance1.setOptions({logToDom: ".analogger"});
anaLoggerInstance2.setOptions({logToFile: "./logme.log"});
```

<br/>
<br/>

