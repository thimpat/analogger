
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

![img_1.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_3.png)

![img.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_2.png)

<br/>

## API

<br/>

### log() / info() / warn() / error()

Display a message in the terminal or the inspector. Depending on where the process is running. 

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

Display the browser native message box if ran from it, otherwise displays the message in the terminal.

<br/>

### overrideConsole() | setOptions()

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

### setContexts()

#### Contexts

A context allows grouping the logs by functionality by assigning them some colour.


##### Examples

```javascript
const LOG_CONTEXT = {STANDARD: null, TEST: {color: "#B18904"}, C1: null, C2: null, C3: null, DEFAULT: {}}
const LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", USER: "USER"};

anaLogger.setContexts(LOG_CONTEXT);

anaLogger.log(LOG_CONTEXT.C1, `Test Log example C1`);
anaLogger.log(LOG_CONTEXT.C2, `Test Log example C2`);
anaLogger.log(LOG_CONTEXT.C3, `Test Log example C3`);
```

See LOG_CONTEXT.C1 in this example to categorise the functionality we want to monitor.
For instance, LOG_CONTEXT.INVESTIGATING_TIMER_EFFECT could be a to display output related to something that has to
do with a timer.

The "Testing log 2" log will not show up in the console or the terminal.

**Preview In a terminal (NodeJs)**

![img.png](https://github.com/thimpat/analogger/blob/main/docs/images/img.png)

**Preview In a browser (ESM)**

![img_1.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_1.png)


<br/>

### setTargets() / setActiveTarget()

#### Targets

Targets allow to define some log categories. They can be developpers, roles, etc.
setActiveTarget() allows hiding logs from other devs or roles.

##### Examples

```javascript
anaLogger.setActiveTarget(LOG_TARGETS.DEV1);
console.log({target: LOG_CONTEXT.DEV1}, `Testing log 1`)
console.log({target: LOG_CONTEXT.DEV2}, `Testing log 2`)
console.log({context: LOG_CONTEXT.DEV3}, `Testing log 3`)
console.log(`Testing log 4`)
```


```javascript
const LOG_CONTEXT = {STANDARD: null, TEST: {color: "#B18904", symbol: "⏰"}, C1: null, C2: null, C3: null, DEFAULT: {}}
const LOG_TARGETS = {ALL: "ALL", DEV1: "TOM", DEV2: "TIM", USER: "USER"};

anaLogger.setContexts(LOG_CONTEXT);

anaLogger.log(LOG_CONTEXT.C1, `Test Log example C1`);
anaLogger.log(LOG_CONTEXT.C2, `Test Log example C2`);
anaLogger.log(LOG_CONTEXT.C3, `Test Log example C3`);
```

<br/><br/>

### assert()

You can set some tests directly in the code. It serves as early feedback.
It is useful to guarantee that the code is running straight away, rather than waiting on the CI to send its feedback.


```javascript
anaLogger.asset((a, b)=> a === b, true)
```