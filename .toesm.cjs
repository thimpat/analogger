module.exports = {
    replaceStart  : [
        {
            search: "const AdmZip = require(\"adm-zip\");",
            replace: ""
        }
    ],
    replaceModules:
        {
            "node-fetch": {
                cjs: {
                    name   : "node-fetch-cjs",
                    version: "@2.6.7"
                },
                esm: {
                    version: "@3.2.10"
                }
            }
        }
}