module.exports = {
    replaceStart: [
        {
            search : /const\s+chalk\s*=\s*require\(.chalk-cjs.\)[;]?/g,
            replace: `const chalk = null;`
        },
        {
            search : "const colorConvert = require('color-convert-cjs');",
            replace: `const colorConvert = null;`
        },
        {
            search: "const {anaLogger} = require(\"../../dist/ana-logger-cjs.min.cjs\");",
            replace: "const {anaLogger} = require(\"../../dist/ana-logger-esm.min.mjs\");"
        },
        {
            search: "// alert(result)",
            replace: "alert(result)"
        },
    ],
    replaceEnd  : [
        {
            search : `// ***`,
            replace: "// ---------"
        }
    ],
    replaceModules:
        {
            chalk: {
                cjs: {
                    name: "chalk-cjs",
                    version: "@^4.1.2",
                },
                esm: {
                    version: "@latest"
                }
            },
            "rgb-hex": {
                cjs: {
                    name: "rgb-hex-cjs",
                    version: "@^3.0.0"
                },
                esm: {
                    version: "@latest"
                }
            }
        }

}