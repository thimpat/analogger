// ===========================================================================
// Imports
// ---------------------------------------------------------------------------
const {getFileContent, getGlobalArguments} = require("@thimpat/libutils");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

// ===========================================================================
// Constants
// ---------------------------------------------------------------------------
const insertLids = function (content, {logCounter = 1000, errorCounter = 3000} = {})
{
    try
    {
        logCounter = parseInt(logCounter);
        errorCounter = parseInt(errorCounter);

        // Replace content to insert log ids (Lids)
        let matches = content.matchAll(/\blid:\s*(\d+)/g);
        let duplicatedLids = [];
        for (let match of matches)
        {
            // let lid = parseInt(match[1]);
            let lid = match[1];
            duplicatedLids.push(lid);
        }

        duplicatedLids = duplicatedLids.sort();
        duplicatedLids = duplicatedLids.filter((e, i, a) => a.indexOf(e) !== i);

        const dupLids = {};
        duplicatedLids.forEach(function (lid)
        {
            dupLids[lid] = dupLids[lid] || 0;
            ++dupLids[lid];
        });

        // Add lids to console.log and console.error
        content = content.replace(/(console.\b(log|error)\b\s*\(\s*)(?!\{?lid)(.*)/g, "$1{lid: 1000}, $3");


        // Replace lids in console.log and console.error
        content = content.replace(/console.\b(log|error)\b\s*\(\s*\{.*?\b(lid:\s*)(\d+)/g, function (substring, logType, lidText, detectedLid)
        {
            let counter;

            if (dupLids[detectedLid] < 0)
            {
                return substring;
            }

            --dupLids[detectedLid];
            if (logType === "log")
            {
                counter = logCounter;
                logCounter += 2;
            }
            else
            {
                counter = errorCounter;
                errorCounter += 2;
            }

            return substring.replace(lidText + detectedLid, `lid: ${counter}`);
        });

        return {content, logCounter, errorCounter};
    }
    catch (e)
    {
        console.error({lid: 1000}, e.message);
    }

    return null;
};

function writeResults(filepath, content, {same} = {})
{
    try
    {
        if (same)
        {
            fs.writeFileSync(filepath, content, {encoding: "utf-8"});
        }
        else
        {
            // Write result to backup file
            const infoFile = path.parse(filepath);
            const modifiedFilepath = path.join(process.cwd(), infoFile.name + ".bak" + infoFile.ext);
            fs.writeFileSync(modifiedFilepath, content, {encoding: "utf-8"});
        }

        return true;
    }
    catch (e)
    {
        console.error({lid: 1000}, e.message);
    }

    return false;
}

const writeLidsToFile = function (filepath, {logidstart, erroridstart, overwrite})
{
    try
    {
        // -----------
        const content = getFileContent(filepath);
        if (!content)
        {
            return false;
        }

        // -----------
        let {content: modifiedContent, logCounter, errorCounter} = insertLids(content,
            {logCounter: logidstart, errorCounter: erroridstart});

        if (modifiedContent === null)
        {
            return false;
        }

        // -----------
        writeResults(filepath, modifiedContent, {same: overwrite});

        console.log(`Successfully modified: ${filepath}`);

        return {logCounter, errorCounter};
    }
    catch (e)
    {
        console.error({lid: 1000}, e.message);
    }

    return false;
};

function writeLidsToList(fileList, {logidstart = 1000, erroridstart = 3000, overwrite = false} = {})
{
    try
    {
        for (let i = 0; i < fileList.length; i++)
        {
            const filepath = fileList[i];
            const {logCounter, errorCounter} = writeLidsToFile(filepath, {logidstart, erroridstart, overwrite});
            logidstart = logCounter;
            erroridstart = errorCounter;
        }

        return true;
    }
    catch (e)
    {
        console.error({lid: 1000}, e.message);
    }

    return false;
}

function getFileList(filepath)
{
    let filepaths;
    try
    {
        if (fs.lstatSync(filepath).isFile())
        {
            filepaths = [filepath];
        }
        else if (fs.lstatSync(filepath).isDirectory())
        {
            filepaths = glob.sync("**/*.*[cm]js", {
                dot     : false,
                nodir   : true,
                cwd     : filepath,
                ignore  : ["node_modules/**/*.*[cm]js"],
                realpath: true
            });
        }
        else
        {
            return [];
        }
    }
    catch (e)
    {
        console.error({lid: 1000}, e.message);
    }

    return filepaths;
}

// ===========================================================================
// Initialisation
// ---------------------------------------------------------------------------
// ---
const init = async function ()
{
    try
    {
        // ------------------------------------
        // Get filepath to apply transformation
        // ------------------------------------
        const {filepath} = getGlobalArguments();
        if (!filepath)
        {
            console.error(`Missing target file or directory`);
            return false;
        }

        if (!fs.existsSync(filepath))
        {
            console.error(`Could not find ${filepath}`);
            return false;
        }

        // ------------------------------------
        // Get file list
        // ------------------------------------
        const fileList = getFileList(filepath);
        if (!fileList.length)
        {
            console.error(`No sources found in [${filepath}]`);
            return false;
        }

        // ------------------------------------
        // Apply transformations
        // ------------------------------------
        const {overwrite, logidstart, erroridstart} = getGlobalArguments();
        writeLidsToList(fileList, {overwrite, logidstart, erroridstart});

        return true;
    }
    catch (e)
    {
        console.error({lid: 1000}, e.message);
    }

    return false;
};

(async function ()
{
    try
    {
        await init();
        return true;
    }
    catch (e)
    {
        console.error({lid: 1000}, e.message);
    }

    process.exit(1);

}());