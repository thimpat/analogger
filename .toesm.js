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
            search: "const {quickLog} = require(\"../../dist/quick-log-cjs.min.cjs\");",
            replace: "const {quickLog} = require(\"../../dist/quick-log-esm.min.mjs\"); /** Replaced **/"
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