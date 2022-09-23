module.exports = {
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