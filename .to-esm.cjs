const packageJson = require("./package.json");

module.exports = {
    "replaceStart"  : [
        {
            search : "packageJson.name",
            replace: `"${packageJson.name}"`
        },
        {
            search : "AnaLogger for CommonJs",
            replace: "AnaLogger for ES Modules"
        },
    ],
    "replaceEnd"    : [
    ],
}