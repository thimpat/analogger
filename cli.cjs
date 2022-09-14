#!/usr/bin/env node
let packageJson = require("./package.json");

const {spawn} = require("child_process");
const os = require("os");

const { program } = require("commander");

const openRemoteLogging = (argv) =>
{
    const args = argv.slice(2);

    const npmPath = os.platform() === "win32" ? "npm.cmd" : "npm";

    const npx = spawn(npmPath, ["exec", "remote-logging", ...args], {
        stdio      : ["pipe", "pipe", "pipe"],
        windowsHide: true,
        shell: false
    });

    npx.stdout.on("data", (data) =>
    {
        console.log(`stdout: ${data}`);
        // Workaround
        process.exit(0);
    });

    npx.stderr.on("data", (data) =>
    {
        console.log(`stderr: ${data}`);
    });

    npx.on("close", (code) =>
    {
        console.log(`child process exited with code ${code}`);
    });

    npx.unref();

};

program
    .name(packageJson.name)
    .description("Open a remote server for AnaLogger")
    .version(packageJson.version, "-v, --version", "output the AnaLogger current version")
    .option("-p, --port", "Remote Logging port to use", 12000)
    .option("-s, --server", "Open Remote Logging GUI")
    .showHelpAfterError("(add --help for additional information)")
    .showSuggestionAfterError(true);


(async function ()
{
    program.parse();

    const options = program.opts();

    const args = process.argv.slice(2);

    openRemoteLogging(args, options);
    
}());
