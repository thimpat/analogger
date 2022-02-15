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