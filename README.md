
[![Test workflow](https://github.com/thimpat/analogger/actions/workflows/test.yml/badge.svg)](https://github.com/thimpat/analogger/actions/workflows/test.yml)
[![nycrc Coverage](https://img.shields.io/nycrc/thimpat/analogger?preferredThreshold=lines)](https://github.com/thimpat/analogger/blob/main/README.md)
[![Version workflow](https://github.com/thimpat/analogger/actions/workflows/versioning.yml/badge.svg)](https://github.com/thimpat/analogger/actions/workflows/versioning.yml)
[![npm version](https://badge.fury.io/js/analogger.svg)](https://www.npmjs.com/package/analogger)
<img alt="semantic-release" src="https://img.shields.io/badge/semantic--release-19.0.2-e10079?logo=semantic-release">

---

Analogger is a very simple logger for both Node and the Browser.
It is a library using both CJS and ESM.
It serves as a packaging example of **hybrid (CJS/ESM) module**.

## Installation

```shell
npm install analogger
```

## Usage

### In NodeJS

```javascript
const {anaLogger}  = require("analogger");
```

### In the Browser

```javascript
import {anaLogger} from "./node_modules/analogger/dist/index-esm.min.mjs";
```

### With a bundler or a transpiler

```javascript
import {anaLogger} from "analogger"
```

<br/>

### Preview

#### Terminal
![img_1.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_3.png)

#### Inspector
![img.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_2.png)

#### DOM
![img.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_4.png)
<br/>

## API

<br/>

### log() / info() / warn() / error()

Display a message in the terminal or the inspector, depending on where the process is running.

```javascript
anaLogger.log(`I'am some log`);
anaLogger.info(`I'am some log`);
anaLogger.warn(`I'am some log`);
anaLogger.error(`I'am some log`);
```
<br/>

### alert()

```javascript
anaLogger.alert(`I'am some log`);
```

Display the browser native message box if run from it; otherwise, it displays the message in the terminal.

<br/>

### setOptions()


| **Options**        | **default** | **Description**                                                                    | 
|--------------------|-------------|------------------------------------------------------------------------------------|
| silent             | false       | _No log will be displayed (only errors)_                                           |
| hideError          | false       | _Hide errors from console_                                                         |              
| hideHookMessage    | false       | _Hide the automatic message shown when some native console methods are overridden_ |
| showPassingTests   | true        | _Show Live test results_                                                           |           
| logToDom           | undefined       | _display log in a DOM container_                                                   |


```javascript
// No hook alert message + Log messages in the div #analogger
anaLogger.setOptions({hideHookMessage: true, logToDom: "#analogger"})
```

<br/>

### overrideConsole()

```javascript
anaLogger.setOptions({silent: true, hideError: false})
console.log(`Log Before override`);
anaLogger.overrideConsole()
console.log(`Log After override`);
```

Override console.log, console.info and console.warn. If you already have many console.log running in your system,
it allows hiding them all in one go.
In this example, the terminal (or inspector) will not show the message "Log After override". All following messages
either.

<br/>

### overrideError()

Same as above, but for errors (console.error)

<br/>

### removeOverride() | removeOverrideError()

Remove overridden console methods

<br/>

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

### setTargets() / setActiveTarget()

#### Targets

Targets allow defining some log categories. For example, they can be developers, roles, etc.
setActiveTarget() allows hiding logs from other devs or roles.

##### Examples

```javascript
const LOG_CONTEXTS = {STANDARD: null, TEST: {color: "#B18904", symbol: "⏰"}, C1: null, C2: null, C3: null, DEFAULT: {}}
const LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", USER: "USER"};

anaLogger.setContexts(LOG_CONTEXTS);
anaLogger.setActiveTarget(LOG_TARGETS.DEV1);                        // <- You are DEV1 

anaLogger.log({target: LOG_TARGETS.DEV1}, `Testing log 1`);           // You will see this
anaLogger.log({target: LOG_TARGETS.DEV2}, `Testing log 2`);           // You will not see this
anaLogger.log({context: LOG_CONTEXTS.STANDARD}, `Testing log 3`);     // You will see this    
anaLogger.log(`Testing log 4`);                                       // You will see this. No context = LOG_CONTEXTS.ALL


anaLogger.log(LOG_CONTEXTS.C1, `Test Log example C1`);               // You will see this
```

<br/><br/>

### assert()

You can set some tests directly in the code. It serves as early feedback.
It is helpful to guarantee that the code is running straight away rather than waiting on the CI to send its feedback.


```javascript
anaLogger.assert(1 === 1)
anaLogger.assert(1 === 2)
anaLogger.assert(()=>true, true)
anaLogger.assert((a, b)=> a === b, true, 2, 2)
```

<br/><br/>

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
            // When an error is detected in the Browser, the Browser will see this message
            anaLogger.alert(`Users explicitly see this message`)
        }
    });

    anaLogger.setActiveTarget(LOG_TARGETS.USER);
    anaLogger.error({target: LOG_TARGETS.USER}, "Salut user!");     // Display an alert box
    anaLogger.error("Hi user!");                                    // Log the message to the inspector
```
