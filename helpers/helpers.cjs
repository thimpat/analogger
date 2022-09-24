const os = require("os");
const {spawn} = require("child_process");


/**
 * Open a Remote-Logging window
 * @param args
 */
const openRemoteLogging = (args = []/*, options = {}*/) =>
{
    const npmPath = os.platform() === "win32" ? "npm.cmd" : "npm";

    const npx = spawn(npmPath, ["exec", "remote-logging", "--", "--yes", ...args], {
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


module.exports.openRemoteLogging = openRemoteLogging;