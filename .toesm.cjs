const os = require("os");
module.exports = {
    replaceStart: [
        {
            search : "const colorConvert = require(\"color-convert-cjs\");",
            replace: `const colorConvert = null;`
        },
        {
            search : /const\s+chalk\s*=\s*require\(.chalk-cjs.\)[;]?/g,
            replace: `${os.EOL}const chalk = null;${os.EOL}`
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
            "node-fetch": {
                cjs: {
                    name: "node-fetch-cjs",
                    version: "@2.6.7"
                },
                esm: {
                    version: "@3.2.10"
                }
            },
            "term-size": {
                cjs: {
                    name: "term-size-cjs",
                    version: "@2.2.1"
                },
                esm: {
                    version: "@3.0.2"
                }
            },
        }

}