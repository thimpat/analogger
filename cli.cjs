#!/usr/bin/env node
let packageJson = require("./package.json");

const { program } = require("commander");
const {openRemoteLogging} = require("./helpers/helpers.cjs");


program
    .name(packageJson.name)
    .description("Open a remote server for AnaLogger")
    .version(packageJson.version, "-v, --version", "output the AnaLogger current version")
    .option("-p, --port <number>", "Remote Logging port to use", 12000)
    .showHelpAfterError("(add --help for additional information)")
    .showSuggestionAfterError(true);


(async function ()
{
    program.parse();

    const options = program.opts();
    const args = process.argv.slice(2);
    openRemoteLogging(args, options);
    
}());
