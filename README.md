
Analogger is a very simple logger for both Node and the Browser.
It is a library using both CJS and ESM. It serves as an example of a packaging hybrid (CJS/ESM) package.

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

or

```javascript
import {anaLogger} from "analogger"
```

Depending on whether you use a bundler.

### Usages

<br/>

### Preview

![img_1.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_3.png)

![img.png](https://github.com/thimpat/analogger/blob/main/docs/images/img_2.png)

#### Log contexts

A context allows grouping the logs by functionality (role) by assigning them some colour.

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

#### Log targets

Log targets are the targets of the logs. For instance, having something like:

##### Examples

```javascript
anaLogger.setTarget(LOG_TARGETS.DEV1);
console.log({target: LOG_CONTEXT.DEV1}, `Testing log 1`)
console.log({target: LOG_CONTEXT.DEV2}, `Testing log 2`)
console.log({context: LOG_CONTEXT.DEV1}, `Testing log 3`)
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

### Log options

anaLogger.setOptions({silent: false, hideError: false})
