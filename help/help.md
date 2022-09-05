
### Build the library for NPM

> **All steps needed**

#### 1- Generate the ESM build

```shell
$> npm run build:esm:terminal
```

#### 2- Generate the browser build from the plugin build

    * Generate code for the browser
    * Generate code for the takeScreenshot plugin
    * Add the html-to-image code + license within the browser directory 

```shell
$> npm run build:plugins
```

> Removed: 
> _~~$> npm run build:esm:browser~~_


#### 3- Generate the minified browser version

```shell
$> npm run build:esm:browser:minified
```

#### 6- Add the theme .css file 

```shell
$> npm run copy:css
```

---

### Manual Testing

#### 1- Test the library for CommonJs environments

```shell
$> npm run demo:terminal:cjs
```


---

### Test the library

#### 1- Generate the ESM build for the demo

```shell
$> npm run build:demo:terminal
```

#### 2- Generate the browser build for the demo

```shell
$> npm run build:demo:browser
```

#### 3- Generate the browser build with importmaps support for the demo

```shell
$> npm run build:demo:browser:importmaps
```

#### 4- Generate the minified browser build for the demo

```shell
$> npm run build:demo:minified
```

#### 5- Run the tests

```shell
$> npm test
```

