/** to-esm-browser: remove **/
const path = require("path");
const fs = require("fs");
const os = require("os");
const {c, x} = require('tar');
/** to-esm-browser: end-remove **/


// to-ansi is also used by the browser
const toAnsi = require("to-ansi");

const DEFAULT = {
    moduleName: "analogger",
    // Default values for remote-logging
    protocol: "http://",
    host    : "localhost",
    port    : 12000,
    // Path for analogger text data
    pathname: "analogger",
    // Path for analogger raw data
    binarypathname: "uploaded",
    // ---------------------------------
    loopback: "localhost",
    // ---------------------------------
    consoleDomId: "#analogger",
    logFilename : "./analogger.log"
};

const {
    COLOR_TABLE, SYSTEM, MAX_CHILDREN_DOM_ANALOGGER, CLASS_REMOVED_NOTIF, ADD_TYPE, CONSOLE_AREA_CLASSNAME,
    PREDEFINED_FORMATS, ANALOGGER_NAME, LINE_CLASSNAME
} = require("./constants.cjs");

const DEFAULT_LOG_TARGETS = {
    ALL : "ALL",
    USER: "USER",
    NONE: "NONE"
};

const DEFAULT_LOG_LEVELS = {
    FATAL  : 5000,
    ERROR  : 4000,
    WARN   : 3000,
    INFO   : 2000,
    LOG    : 1000,
    DEBUG  : 500,
    ALL    : 200,
    OFF    : 0,
    INHERIT: -1,
};

/**
 * @typedef PLUGIN_TYPE
 * @type {{LOCAL: string, GLOBAL: string}}
 */
const PLUGIN_TYPE = {
    LOCAL : "local",
    GLOBAL: "global"
};

/**
 * @typedef PLUGIN_PROPERTIES_TYPE
 * @property {string} methodName AnaLogger's real method name that is set to the AnaLogger instance *
 * @property {function} callback AnaLogger method that will be called when invoking the plugin
 * @property {PLUGIN_TYPE} type Whether the plugin is accessible to the AnaLogger class or an instance
 */

const DEFAULT_LOG_CONTEXTS = {
    // The default context
    DEFAULT : {contextName: "DEFAULT", logLevel: DEFAULT_LOG_LEVELS.LOG, symbol: "check"},
    LOG     : {contextName: "LOG", logLevel: DEFAULT_LOG_LEVELS.LOG, symbol: "check"},
    DEBUG   : {contextName: "DEBUG", logLevel: DEFAULT_LOG_LEVELS.DEBUG},
    INFO    : {contextName: "INFO", logLevel: DEFAULT_LOG_LEVELS.INFO, color: "#B18904", symbol: "diamonds"},
    WARN    : {contextName: "WARN", logLevel: DEFAULT_LOG_LEVELS.WARN, color: COLOR_TABLE[0], symbol: "cross"},
    ERROR   : {contextName: "ERROR", logLevel: DEFAULT_LOG_LEVELS.ERROR},
    CRITICAL: {contextName: "CRITICAL", logLevel: DEFAULT_LOG_LEVELS.CRITICAL},
};

const {stringify} = require("flatted");
const {CONSOLE_HEADER_CLASSNAME, CONSOLE_FOOTER_CLASSNAME} = require("./constants.cjs");

const EOL = `
`;

const symbolNames = {
    airplane                  : "✈",
    anchor                    : "⚓",
    announcement              : "📢",
    arrow_backward            : "◀",
    arrow_double_up           : "⏫",
    arrow_double_down         : "⏬",
    arrow_forward             : "▶",
    arrow_lower_right         : "↘",
    arrow_lower_left          : "↙",
    arrow_right_hook          : "↪",
    arrow_up_down             : "↕",
    arrow_upper_left          : "↖",
    arrow_upper_right         : "↗",
    ballot_box_with_check     : "☑",
    biohazard                 : "☣",
    black_circle              : "⏺",
    black_medium_small_square : "◾",
    black_medium_square       : "◼",
    black_nib                 : "✒",
    black_small_square        : "▪",
    black_square              : "⏹",
    chains                    : "⛓",
    check                     : "✔",
    chess_pawn                : "♟",
    cloud_and_rain            : "⛈",
    clubs                     : "♣",
    coffee                    : "☕",
    computer                 : "💻",
    computer_disk             : "💽",
    computer_mouse            : "🖱️",
    copyright                 : "©",
    cross                     : "❌",
    desktop_computer          : "🖥️",
    diamonds                  : "♦",
    divisions_ign             : "➗",
    double_triangle_right     : "⏭",
    double_triangle_left      : "⏮",
    email                     : "✉",
    eject                     : "⏏",
    envelope                  : "✉️",
    exclamation_mark          : "❗",
    fast_forward              : "⏩",
    female_sign               : "♀",
    fire                      : "🔥",
    fist                      : "✊",
    floppy_disk              : "💾",
    fuel_pump                 : "⛽",
    gear                      : "⚙",
    hammer_and_pick           : "⚒",
    hand                      : "✋",
    hearts                    : "♥",
    identification_card       : "🆔",
    infinity                  : "♾",
    information               : "ℹ",
    information_source        : "ℹ️",
    key                       : "🔑",
    left_right_arrow          : "↔",
    leftwards_arrow_with_hook : "↩",
    lock                      : "🔒",
    male_sign                 : "♂",
    minus_sign                : "➖",
    money_bag                : "💰",
    no_entry                  : "⛔",
    old_key                   : "🗝️",
    partly_sunny              : "⛅",
    pencil                    : "✏",
    phone                     : "☎",
    pile_of_poo              : "💩",
    plus_sign                 : "➕",
    question                  : "❔",
    radioactive               : "☢",
    raised_hand               : "✋",
    recycle                   : "♻",
    registered                : "®",
    relaxed                   : "☺",
    rewind                    : "⏪",
    scissors                  : "✂",
    settings                  : "⚙️",
    shield                    : "🛡️",
    screen_with_curl          : "📜",
    snowman                   : "☃",
    spades                    : "♠",
    sparkles                  : "✨",
    speech_bubble             : "💬",
    squared_cancellation_mark : "❎",
    star                      : "⭐",
    sunny                     : "☀",
    tent                      : "⛺",
    thought_balloon           : "💭",
    trademark                 : "™",
    triangle_with_vertical_bar: "⏯",
    umbrella                  : "☔",
    unlock                    : "🔓",
    vertical_bars             : "⏸",
    watch                     : "⌚",
    white_frowning_face       : "☹",
    white_medium_square       : "◻",
    white_medium_small_square : "◽",
    white_small_square        : "▫",
    wheelchair                : "♿",
    white_circle              : "⚪",
    white_square_containing_black_small_square: "◽",
    writing_hand              : "✍",
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function getFilePathProperties(filePath) {
    try {
        const ext = path.extname(filePath);
        const basename = path.basename(filePath, ext);
        const dirname = path.dirname(filePath);
        const fPath = filePath.slice(0, filePath.length - ext.length);
        return {
            extension: ext, filePath: fPath, basename, dirname
        };
    } catch (e) {
        console.error("FILEPATH_EXT_FAILURE: ", e.message);
    }
    return {
        extension: ".log", filePath
    };
}

function getConsistentTimestamp() {
    const now = new Date();

    // ISO 8601 format with milliseconds and timezone offset
    const isoString = now.toISOString();

    return isoString.replace(/:/g, "-").replace(/\./g, "-");
}

/**
 * Deletes all files in the given directory that match the specified filename prefix, index, and extension.
 *
 * @param {string} directory - The directory containing the files.
 * @param {string} filenamePrefix - The prefix of the filename (e.g., "demo").
 * @param {string} index - The index to match (e.g., "01", "02", "03").
 * @param {string} extension - The file extension (e.g., "log").
 * @param archiveName
 * @param compressionLevel
 * @param {function} deletionCallback - A callback function to handle the result.
 */
function deleteFilesWithIndex(directory, filenamePrefix, index, extension, archiveName, compressionLevel, deletionCallback) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            deletionCallback(err, null);
            return;
        }

        const deletedFiles = [];
        let filesProcessed = 0;

        const removeFile = (filePath, callback) => {
            if (!fs.existsSync(filePath)) {
                callback(null, null);
                return;
            }
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`DELETION_FAILURE: Error deleting file ${filePath}: ${unlinkErr}`);
                } else {
                    deletedFiles.push(filePath);
                }
                filesProcessed++;
                if (filesProcessed === files.length) {
                    callback(null, deletedFiles);
                }
            });
        };

        const processFile = (file) => {
            if (file.startsWith(filenamePrefix + ".") && file.endsWith(index + extension)) {
                const filePath = path.join(directory, file);

                if (archiveName)
                {
                    createTarGzArchiveSync(filePath, archiveName, compressionLevel);
                    removeFile(filePath, deletionCallback);
                }
                else
                {
                    removeFile(filePath, deletionCallback);
                }

            } else {
                filesProcessed++;
                if (filesProcessed === files.length) {
                    deletionCallback(null, deletedFiles);
                }
            }
        };

        if (files.length === 0) {
            deletionCallback(null, deletedFiles); // Handle empty directory
        } else {
            files.forEach(processFile, compressionLevel);
        }
    });
}

function addScriptToDOM(scriptCode, attributes = {}) {
    const script = document.createElement('script');
    script.textContent = scriptCode;

    // Add any provided attributes to the script element
    for (const key in attributes) {
        script.setAttribute(key, attributes[key]);
    }

    document.head.appendChild(script); // Or document.body.appendChild(script)

    script.remove();
}

/**
 * Code for htmlToImage v1.11.13
 * AnaLogger embed htmlToImage which is a third-party library.
 * @returns {string}
 *
 */
function getHtmlToImage() {
    /**
     * MIT License
     *
     * Copyright (c) 2017 W.Y.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */
    const code = [];
    code.push(`!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).htmlToImage={})}(this,(function(t){"use strict";function e(t,e,n,r){return new(n||(n=Promise))((function(i,o){function u(t){try{a(r.next(t))}catch(t){o(t)}}function c(t){try{a(r.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(u,c)}a((r=r.apply(t,e||[])).next())}))}function n(t,e){var n,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function c(c){return function(a){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;o&&(o=0,c[0]&&(u=0)),u;)try{if(n=1,r&&(i=2&c[0]?r.return:c[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,c[1])).done)return i;switch(r=0,i&&(c=[2&c[0],i.value]),c[0]){case 0:case 1:i=c;break;case 4:return u.label++,{value:c[1],done:!1};case 5:u.label++,r=c[1],c=[0];continue;case 7:c=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==c[0]&&2!==c[0])){u=0;continue}if(3===c[0]&&(!i||c[1]>i[0]&&c[1]<i[3])){u.label=c[1];break}if(6===c[0]&&u.label<i[1]){u.label=i[1],i=c;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(c);break}i[2]&&u.ops.pop(),u.trys.pop();continue}c=e.call(t,u)}catch(t){c=[6,t],r=0}finally{n=i=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,a])}}}var r,i=(r=0,function(){return r+=1,"u".concat("0000".concat((Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)).concat(r)});function o(t){for(var e=[],n=0,r=t.length;n<r;n++)e.push(t[n]);return e}var u=null;function c(t){return void 0===t&&(t={}),u||(u=t.includeStyleProperties?t.includeStyleProperties:o(window.getComputedStyle(document.documentElement)))}function a(t,e){var n=(t.ownerDocument.defaultView||window).getComputedStyle(t).getPropertyValue(e);return n?parseFloat(n.replace("px","")):0}function s(t,e){void 0===e&&(e={});var n,r,i,o=e.width||(r=a(n=t,"border-left-width"),i=a(n,"border-right-width"),n.clientWidth+r+i),u=e.height||function(t){var e=a(t,"border-top-width"),n=a(t,"border-bottom-width");return t.clientHeight+e+n}(t);return{width:o,height:u}}var l=16384;function f(t,e){return void 0===e&&(e={}),t.toBlob?new Promise((function(n){t.toBlob(n,e.type?e.type:"image/png",e.quality?e.quality:1)})):new Promise((function(n){for(var r=window.atob(t.toDataURL(e.type?e.type:void 0,e.quality?e.quality:void 0).split(",")[1]),i=r.length,o=new Uint8Array(i),u=0;u<i;u+=1)o[u]=r.charCodeAt(u);n(new Blob([o],{type:e.type?e.type:"image/png"}))}))}function h(t){return new Promise((function(e,n){var r=new Image;r.onload=function(){r.decode().then((function(){requestAnimationFrame((function(){return e(r)}))}))},r.onerror=n,r.crossOrigin="anonymous",r.decoding="async",r.src=t}))}function d(t){return e(this,void 0,void 0,(function(){return n(this,(function(e){return[2,Promise.resolve().then((function(){return(new XMLSerializer).serializeToString(t)})).then(encodeURIComponent).then((function(t){return"data:image/svg+xml;charset=utf-8,".concat(t)}))]}))}))}function v(t,r,i){return e(this,void 0,void 0,(function(){var e,o,u;return n(this,(function(n){return e="http://www.w3.org/2000/svg",o=document.createElementNS(e,"svg"),u=document.createElementNS(e,"foreignObject"),o.setAttribute("width","".concat(r)),o.setAttribute("height","".concat(i)),o.setAttribute("viewBox","0 0 ".concat(r," ").concat(i)),u.setAttribute("width","100%"),u.setAttribute("height","100%"),u.setAttribute("x","0"),u.setAttribute("y","0"),u.setAttribute("externalResourcesRequired","true"),o.appendChild(u),u.appendChild(t),[2,d(o)]}))}))}var p=function(t,e){if(t instanceof e)return!0;var n=Object.getPrototypeOf(t);return null!==n&&(n.constructor.name===e.name||p(n,e))};function g(t,e,n,r){var i=".".concat(t,":").concat(e),o=n.cssText?function(t){var e=t.getPropertyValue("content");return"".concat(t.cssText," content: '").concat(e.replace(/'|"/g,""),"';")}(n):function(t,e){return c(e).map((function(e){var n=t.getPropertyValue(e),r=t.getPropertyPriority(e);return"".concat(e,": ").concat(n).concat(r?" !important":"",";")})).join(" ")}(n,r);return document.createTextNode("".concat(i,"{").concat(o,"}"))}function m(t,e,n,r){var o=window.getComputedStyle(t,n),u=o.getPropertyValue("content");if(""!==u&&"none"!==u){var c=i();try{e.className="".concat(e.className," ").concat(c)}catch(t){return}var a=document.createElement("style");a.appendChild(g(c,n,o,r)),e.appendChild(a)}}var w="application/font-woff",y="image/jpeg",b={woff:w,woff2:w,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:y,jpeg:y,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml",webp:"image/webp"};function S(t){var e=function(t){var e=/\\.([^./]*?)$/g.exec(t);return e?e[1]:""}(t).toLowerCase();return b[e]||""}function E(t){return-1!==t.search(/^(data:)/)}function x(t,e){return"data:".concat(e,";base64,").concat(t)}function C(t,r,i){return e(this,void 0,void 0,(function(){var e,o;return n(this,(function(n){switch(n.label){case 0:return[4,fetch(t,r)];case 1:if(404===(e=n.sent()).status)throw new Error('Resource "'.concat(e.url,'" not found'));return[4,e.blob()];case 2:return o=n.sent(),[2,new Promise((function(t,n){var r=new FileReader;r.onerror=n,r.onloadend=function(){try{t(i({res:e,result:r.result}))}catch(t){n(t)}},r.readAsDataURL(o)}))]}}))}))}var P={};function R(t,r,i){return e(this,void 0,void 0,(function(){var e,o,u,c,a;return n(this,(function(n){switch(n.label){case 0:if(e=function(t,e,n){var r=t.replace(/\\?.*/,"");return n&&(r=t),/ttf|otf|eot|woff2?/i.test(r)&&(r=r.replace(/.*\\//,"")),e?"[".concat(e,"]").concat(r):r}(t,r,i.includeQueryParams),null!=P[e])return[2,P[e]];i.cacheBust&&(t+=(/\\?/.test(t)?"&":"?")+(new Date).getTime()),n.label=1;case 1:return n.trys.push([1,3,,4]),[4,C(t,i.fetchRequestInit,(function(t){var e=t.res,n=t.result;return r||(r=e.headers.get("Content-Type")||""),function(t){return t.split(/,/)[1]}(n)}))];case 2:return u=n.sent(),o=x(u,r),[3,4];case 3:return c=n.sent(),o=i.imagePlaceholder||"",a="Failed to fetch resource: ".concat(t),c&&(a="string"==typeof c?c:c.message),a&&console.warn(a),[3,4];case 4:return P[e]=o,[2,o]}}))}))}function T(t){return e(this,void 0,void 0,(function(){var e;return n(this,(function(n){return"data:,"===(e=t.toDataURL())?[2,t.cloneNode(!1)]:[2,h(e)]}))}))}function A(t,r){return e(this,void 0,void 0,(function(){var e,i,o,u;return n(this,(function(n){switch(n.label){case 0:return t.currentSrc?(e=document.createElement("canvas"),i=e.getContext("2d"),e.width=t.clientWidth,e.height=t.clientHeight,null==i||i.drawImage(t,0,0,e.width,e.height),[2,h(e.toDataURL())]):(o=t.poster,u=S(o),[4,R(o,u,r)]);case 1:return[2,h(n.sent())]}}))}))}function k(t,r){var i;return e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return e.trys.push([0,3,,4]),(null===(i=null==t?void 0:t.contentDocument)||void 0===i?void 0:i.body)?[4,I(t.contentDocument.body,r,!0)]:[3,2];case 1:return[2,e.sent()];case 2:return[3,4];case 3:return e.sent(),[3,4];case 4:return[2,t.cloneNode(!1)]}}))}))}var L=function(t){return null!=t.tagName&&"SVG"===t.tagName.toUpperCase()};function N(t,e,n){return p(e,Element)&&(function(t,e,n){var r=e.style;if(r){var i=window.getComputedStyle(t);i.cssText?(r.cssText=i.cssText,r.transformOrigin=i.transformOrigin):c(n).forEach((function(n){var o=i.getPropertyValue(n);if("font-size"===n&&o.endsWith("px")){var u=Math.floor(parseFloat(o.substring(0,o.length-2)))-.1;o="".concat(u,"px")}p(t,HTMLIFrameElement)&&"display"===n&&"inline"===o&&(o="block"),"d"===n&&e.getAttribute("d")&&(o="path(".concat(e.getAttribute("d"),")")),r.setProperty(n,o,i.getPropertyPriority(n))}))}}(t,e,n),function(t,e,n){m(t,e,":before",n),m(t,e,":after",n)}(t,e,n),function(t,e){p(t,HTMLTextAreaElement)&&(e.innerHTML=t.value),p(t,HTMLInputElement)&&e.setAttribute("value",t.value)}(t,e),function(t,e){if(p(t,HTMLSelectElement)){var n=e,r=Array.from(n.children).find((function(e){return t.value===e.getAttribute("value")}));r&&r.setAttribute("selected","")}}(t,e)),e}function I(t,r,i){return e(this,void 0,void 0,(function(){return n(this,(function(u){return i||!r.filter||r.filter(t)?[2,Promise.resolve(t).then((function(t){return function(t,r){return e(this,void 0,void 0,(function(){return n(this,(function(e){return p(t,HTMLCanvasElement)?[2,T(t)]:p(t,HTMLVideoElement)?[2,A(t,r)]:p(t,HTMLIFrameElement)?[2,k(t,r)]:[2,t.cloneNode(L(t))]}))}))}(t,r)})).then((function(i){return function(t,r,i){var u,c;return e(this,void 0,void 0,(function(){var e;return n(this,(function(n){switch(n.label){case 0:return L(r)?[2,r]:(e=[],0===(e=null!=(a=t).tagName&&"SLOT"===a.tagName.toUpperCase()&&t.assignedNodes?o(t.assignedNodes()):p(t,HTMLIFrameElement)&&(null===(u=t.contentDocument)||void 0===u?void 0:u.body)?o(t.contentDocument.body.childNodes):o((null!==(c=t.shadowRoot)&&void 0!==c?c:t).childNodes)).length||p(t,HTMLVideoElement)?[2,r]:[4,e.reduce((function(t,e){return t.then((function(){return I(e,i)})).then((function(t){t&&r.appendChild(t)}))}),Promise.resolve())]);case 1:return n.sent(),[2,r]}var a}))}))}(t,i,r)})).then((function(e){return N(t,e,r)})).then((function(t){return function(t,r){return e(this,void 0,void 0,(function(){var e,i,o,u,c,a,s,l,f,h,d,v,p;return n(this,(function(n){switch(n.label){case 0:if(0===(e=t.querySelectorAll?t.querySelectorAll("use"):[]).length)return[2,t];i={},p=0,n.label=1;case 1:return p<e.length?(o=e[p],(u=o.getAttribute("xlink:href"))?(c=t.querySelector(u),a=document.querySelector(u),c||!a||i[u]?[3,3]:(s=i,l=u,[4,I(a,r,!0)])):[3,3]):[3,4];case 2:s[l]=n.sent(),n.label=3;case 3:return p++,[3,1];case 4:if((f=Object.values(i)).length){for(h="http://www.w3.org/1999/xhtml",(d=document.createElementNS(h,"svg")).setAttribute("xmlns",h),d.style.position="absolute",d.style.width="0",d.style.height="0",d.style.overflow="hidden",d.style.display="none",v=document.createElementNS(h,"defs"),d.appendChild(v),p=0;p<f.length;p++)v.appendChild(f[p]);t.appendChild(d)}return[2,t]}}))}))}(t,r)}))]:[2,null]}))}))}var D=/url\\((['"]?)([^'"]+?)\\1\\)/g,H=/url\\([^)]+\\)\\s*format\\((["']?)([^"']+)\\1\\)/g,M=/src:\\s*(?:url\\([^)]+\\)\\s*format\\([^)]+\\)[,;]\\s*)+/g;function F(t,r,i,o,u){return e(this,void 0,void 0,(function(){var e,c,a,s;return n(this,(function(n){switch(n.label){case 0:return n.trys.push([0,5,,6]),e=i?function(t,e){if(t.match(/^[a-z]+:\\/\\//i))return t;if(t.match(/^\\/\\//))return window.location.protocol+t;if(t.match(/^[a-z]+:/i))return t;var n=document.implementation.createHTMLDocument(),r=n.createElement("base"),i=n.createElement("a");return n.head.appendChild(r),n.body.appendChild(i),e&&(r.href=e),i.href=t,i.href}(r,i):r,c=S(r),a=void 0,u?[4,u(e)]:[3,2];case 1:return s=n.sent(),a=x(s,c),[3,4];case 2:return[4,R(e,c,o)];case 3:a=n.sent(),n.label=4;case 4:return[2,t.replace((l=r,f=l.replace(/([.*+?^$`);
    code.push(`{}()|\\[\\]\\/\\\\])/g,"\\\\$1"),new RegExp("(url\\\\(['\\"]?)(".concat(f,")(['\\"]?\\\\))"),"g")),"$1".concat(a,"$3"))];case 5:return n.sent(),[3,6];case 6:return[2,t]}var l,f}))}))}function V(t){return-1!==t.search(D)}function q(t,r,i){return e(this,void 0,void 0,(function(){var e,o;return n(this,(function(n){return V(t)?(e=function(t,e){var n=e.preferredFontFormat;return n?t.replace(M,(function(t){for(;;){var e=H.exec(t)||[],r=e[0],i=e[2];if(!i)return"";if(i===n)return"src: ".concat(r,";")}})):t}(t,i),o=function(t){var e=[];return t.replace(D,(function(t,n,r){return e.push(r),t})),e.filter((function(t){return!E(t)}))}(e),[2,o.reduce((function(t,e){return t.then((function(t){return F(t,e,r,i)}))}),Promise.resolve(e))]):[2,t]}))}))}function U(t,r,i){var o;return e(this,void 0,void 0,(function(){var e,u;return n(this,(function(n){switch(n.label){case 0:return(e=null===(o=r.style)||void 0===o?void 0:o.getPropertyValue(t))?[4,q(e,null,i)]:[3,2];case 1:return u=n.sent(),r.style.setProperty(t,u,r.style.getPropertyPriority(t)),[2,!0];case 2:return[2,!1]}}))}))}function j(t,r){return e(this,void 0,void 0,(function(){var e,i;return n(this,(function(n){switch(n.label){case 0:return[4,U("background",t,r)];case 1:return n.sent()?[3,3]:[4,U("background-image",t,r)];case 2:n.sent(),n.label=3;case 3:return[4,U("mask",t,r)];case 4:return(i=n.sent())?[3,6]:[4,U("-webkit-mask",t,r)];case 5:i=n.sent(),n.label=6;case 6:return(e=i)?[3,8]:[4,U("mask-image",t,r)];case 7:e=n.sent(),n.label=8;case 8:return e?[3,10]:[4,U("-webkit-mask-image",t,r)];case 9:n.sent(),n.label=10;case 10:return[2]}}))}))}function O(t,r){return e(this,void 0,void 0,(function(){var e,i,o;return n(this,(function(n){switch(n.label){case 0:return(e=p(t,HTMLImageElement))&&!E(t.src)||p(t,SVGImageElement)&&!E(t.href.baseVal)?[4,R(i=e?t.src:t.href.baseVal,S(i),r)]:[2];case 1:return o=n.sent(),[4,new Promise((function(n,i){t.onload=n,t.onerror=r.onImageErrorHandler?function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];try{n(r.onImageErrorHandler.apply(r,t))}catch(t){i(t)}}:i;var u=t;u.decode&&(u.decode=n),"lazy"===u.loading&&(u.loading="eager"),e?(t.srcset="",t.src=o):t.href.baseVal=o}))];case 2:return n.sent(),[2]}}))}))}function B(t,r){return e(this,void 0,void 0,(function(){var e,i;return n(this,(function(n){switch(n.label){case 0:return e=o(t.childNodes),i=e.map((function(t){return z(t,r)})),[4,Promise.all(i).then((function(){return t}))];case 1:return n.sent(),[2]}}))}))}function z(t,r){return e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return p(t,Element)?[4,j(t,r)]:[3,4];case 1:return e.sent(),[4,O(t,r)];case 2:return e.sent(),[4,B(t,r)];case 3:e.sent(),e.label=4;case 4:return[2]}}))}))}var W={};function $(t){return e(this,void 0,void 0,(function(){var e,r;return n(this,(function(n){switch(n.label){case 0:return null!=(e=W[t])?[2,e]:[4,fetch(t)];case 1:return[4,n.sent().text()];case 2:return r=n.sent(),e={url:t,cssText:r},W[t]=e,[2,e]}}))}))}function G(t,r){return e(this,void 0,void 0,(function(){var i,o,u,c,a=this;return n(this,(function(s){return i=t.cssText,o=/url\\(["']?([^"')]+)["']?\\)/g,u=i.match(/url\\([^)]+\\)/g)||[],c=u.map((function(u){return e(a,void 0,void 0,(function(){var e;return n(this,(function(n){return(e=u.replace(o,"$1")).startsWith("https://")||(e=new URL(e,t.url).href),[2,C(e,r.fetchRequestInit,(function(t){var e=t.result;return i=i.replace(u,"url(".concat(e,")")),[u,e]}))]}))}))})),[2,Promise.all(c).then((function(){return i}))]}))}))}function _(t){if(null==t)return[];for(var e=[],n=t.replace(/(\\/\\*[\\s\\S]*?\\*\\/)/gi,""),r=new RegExp("((@.*?keyframes [\\\\s\\\\S]*?){([\\\\s\\\\S]*?}\\\\s*?)})","gi");;){if(null===(u=r.exec(n)))break;e.push(u[0])}n=n.replace(r,"");for(var i=/@import[\\s\\S]*?url\\([^)]*\\)[\\s\\S]*?;/gi,o=new RegExp("((\\\\s*?(?:\\\\/\\\\*[\\\\s\\\\S]*?\\\\*\\\\/)?\\\\s*?@media[\\\\s\\\\S]*?){([\\\\s\\\\S]*?)}\\\\s*?})|(([\\\\s\\\\S]*?){([\\\\s\\\\S]*?)})","gi");;){var u;if(null===(u=i.exec(n))){if(null===(u=o.exec(n)))break;i.lastIndex=o.lastIndex}else o.lastIndex=i.lastIndex;e.push(u[0])}return e}function J(t,r){return e(this,void 0,void 0,(function(){var e,i;return n(this,(function(n){return e=[],i=[],t.forEach((function(e){if("cssRules"in e)try{o(e.cssRules||[]).forEach((function(t,n){if(t.type===CSSRule.IMPORT_RULE){var o=n+1,u=$(t.href).then((function(t){return G(t,r)})).then((function(t){return _(t).forEach((function(t){try{e.insertRule(t,t.startsWith("@import")?o+=1:e.cssRules.length)}catch(e){console.error("Error inserting rule from remote css",{rule:t,error:e})}}))})).catch((function(t){console.error("Error loading remote css",t.toString())}));i.push(u)}}))}catch(o){var n=t.find((function(t){return null==t.href}))||document.styleSheets[0];null!=e.href&&i.push($(e.href).then((function(t){return G(t,r)})).then((function(t){return _(t).forEach((function(t){n.insertRule(t,n.cssRules.length)}))})).catch((function(t){console.error("Error loading remote stylesheet",t)}))),console.error("Error inlining remote css file",o)}})),[2,Promise.all(i).then((function(){return t.forEach((function(t){if("cssRules"in t)try{o(t.cssRules||[]).forEach((function(t){e.push(t)}))}catch(e){console.error("Error while reading CSS rules from ".concat(t.href),e)}})),e}))]}))}))}function Q(t){return t.filter((function(t){return t.type===CSSRule.FONT_FACE_RULE})).filter((function(t){return V(t.style.getPropertyValue("src"))}))}function X(t,r){return e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:if(null==t.ownerDocument)throw new Error("Provided element is not within a Document");return[4,J(o(t.ownerDocument.styleSheets),r)];case 1:return[2,Q(e.sent())]}}))}))}function K(t){return t.trim().replace(/["']/g,"")}function Y(t,r){return e(this,void 0,void 0,(function(){var e,i;return n(this,(function(n){switch(n.label){case 0:return[4,X(t,r)];case 1:return e=n.sent(),i=function(t){var e=new Set;return function t(n){(n.style.fontFamily||getComputedStyle(n).fontFamily).split(",").forEach((function(t){e.add(K(t))})),Array.from(n.children).forEach((function(e){e instanceof HTMLElement&&t(e)}))}(t),e}(t),[4,Promise.all(e.filter((function(t){return i.has(K(t.style.fontFamily))})).map((function(t){var e=t.parentStyleSheet?t.parentStyleSheet.href:null;return q(t.cssText,e,r)})))];case 2:return[2,n.sent().join("\\n")]}}))}))}function Z(t,r){return e(this,void 0,void 0,(function(){var e,i,o,u,c;return n(this,(function(n){switch(n.label){case 0:return null==r.fontEmbedCSS?[3,1]:(i=r.fontEmbedCSS,[3,5]);case 1:return r.skipFonts?(o=null,[3,4]):[3,2];case 2:return[4,Y(t,r)];case 3:o=n.sent(),n.label=4;case 4:i=o,n.label=5;case 5:return(e=i)&&(u=document.createElement("style"),c=document.createTextNode(e),u.appendChild(c),t.firstChild?t.insertBefore(u,t.firstChild):t.appendChild(u)),[2]}}))}))}function tt(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){var e,i,o,u;return n(this,(function(n){switch(n.label){case 0:return e=s(t,r),i=e.width,o=e.height,[4,I(t,r,!0)];case 1:return[4,Z(u=n.sent(),r)];case 2:return n.sent(),[4,z(u,r)];case 3:return n.sent(),function(t,e){var n=t.style;e.backgroundColor&&(n.backgroundColor=e.backgroundColor),e.width&&(n.width="".concat(e.width,"px")),e.height&&(n.height="".concat(e.height,"px"));var r=e.style;null!=r&&Object.keys(r).forEach((function(t){n[t]=r[t]}))}(u,r),[4,v(u,i,o)];case 4:return[2,n.sent()]}}))}))}function et(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){var e,i,o,u,c,a,f,d,v;return n(this,(function(n){switch(n.label){case 0:return e=s(t,r),i=e.width,o=e.height,[4,tt(t,r)];case 1:return[4,h(n.sent())];case 2:return u=n.sent(),c=document.createElement("canvas"),a=c.getContext("2d"),f=r.pixelRatio||function(){var t,e;try{e=process}catch(t){}var n=e&&e.env?e.env.devicePixelRatio:null;return n&&(t=parseInt(n,10),Number.isNaN(t)&&(t=1)),t||window.devicePixelRatio||1}(),d=r.canvasWidth||i,v=r.canvasHeight||o,c.width=d*f,c.height=v*f,r.skipAutoScale||function(t){(t.width>l||t.height>l)&&(t.width>l&&t.height>l?t.width>t.height?(t.height*=l/t.width,t.width=l):(t.width*=l/t.height,t.height=l):t.width>l?(t.height*=l/t.width,t.width=l):(t.width*=l/t.height,t.height=l))}(c),c.style.width="".concat(d),c.style.height="".concat(v),r.backgroundColor&&(a.fillStyle=r.backgroundColor,a.fillRect(0,0,c.width,c.height)),a.drawImage(u,0,0,c.width,c.height),[2,c]}}))}))}t.getFontEmbedCSS=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){return n(this,(function(e){return[2,Y(t,r)]}))}))},t.toBlob=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return[4,et(t,r)];case 1:return[4,f(e.sent())];case 2:return[2,e.sent()]}}))}))},t.toCanvas=et,t.toJpeg=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return[4,et(t,r)];case 1:return[2,e.sent().toDataURL("image/jpeg",r.quality||1)]}}))}))},t.toPixelData=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){var e,i,o,u;return n(this,(function(n){switch(n.label){case 0:return e=s(t,r),i=e.width,o=e.height,[4,et(t,r)];case 1:return u=n.sent(),[2,u.getContext("2d").getImageData(0,0,i,o).data]}}))}))},t.toPng=function(t,r){return void 0===r&&(r={}),e(this,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return[4,et(t,r)];case 1:return[2,e.sent().toDataURL()]}}))}))},t.toSvg=tt}));`);
    return code.join("");
}

/**
 * Adds a log file to a tar.gz archive.
 *
 * @param {string} inputFile - The path to the log file to be added to the archive.
 * @param {string} archivePath - The path to the tar.gz archive.
 * @param compressionLevel
 */
function createTarGzArchiveSync(inputFile, archivePath, compressionLevel = 1) {
    try {
        // Check if the input file exists
        if (!fs.existsSync(inputFile)) {
            return;
        }

        // Create the archive if it doesn't exist, otherwise append
        if (!fs.existsSync(archivePath)) {
            // Create a new archive with the single file at root
            const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tar-gz-init-'));
            try {
                const destFilePath = path.join(tempDir, path.basename(inputFile));
                fs.copyFileSync(inputFile, destFilePath);
                c({
                    sync: true,
                    gzip: { level: compressionLevel },
                    file: archivePath,
                    cwd: tempDir,
                    portable: true,
                }, [path.basename(inputFile)]);
            } finally {
                fs.rmSync(tempDir, { recursive: true, force: true });
            }
            return;
        }

        // If archive exists, append
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tar-gz-append-'));

        try {
            x({
                file: archivePath,
                cwd: tempDir,
                sync: true,
            });

            const destFilePath = path.join(tempDir, path.basename(inputFile));
            fs.copyFileSync(inputFile, destFilePath);

            c({
                gzip: true,
                file: archivePath,
                cwd: tempDir,
                sync: true,
                portable: true,
            }, fs.readdirSync(tempDir));

        } finally {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    } catch (err) {
        console.error(`ARCHIVE_FAILURE: ${e.message}`);
    }
}

function getInvocationLine()
{
    try
    {
        const error = new Error();
        const stack = error.stack;
        let anaLoggerPossibleFileName = "ana-logger";
        let isMinified = false;
        let result = null;
        let strippedOutStackTrace;
        let errorText = [];

        if (stack) {
            const lines = stack.split('\n');
            let fileName = null;
            if (lines.length >= 3) {
                let index = 0;
                // Look for the reference of this line
                for (let i = 0, l = lines.length; i < l; i++) {
                    const line = lines[i];

                    // We can't use the name if it's minified
                    const parts = line.split(':');
                    if (parts.length < 3) {
                        errorText.push(line);
                        continue;
                    }

                    index = i;

                    fileName = parts[parts.length - 3];

                    if (line.indexOf(anaLoggerPossibleFileName)=== -1) {
                        // We're sure we can use this stacktrace
                        break;
                    }

                    if (line.indexOf("getInvocationLine")=== -1) {
                        // The file is minified
                        // We're only partially sure we can use this stacktrace
                        isMinified = true;
                        // We try to extract the file name
                        anaLoggerPossibleFileName = fileName.split(/[\\/]/).pop();
                        break;
                    }

                    // We have no idea if the stacktrace will help us, but we leave the search
                    break;
                }

                // Look for when the call was done exactly
                for (let i = index + 1, l = lines.length; i < l; i++) {
                    const lineStr = lines[i];
                    if (lineStr.indexOf(fileName) > -1) {
                        continue;
                    }

                    const parts = lineStr.split(':');
                    if (parts.length < 3) {
                        continue;
                    }

                    strippedOutStackTrace = errorText.join("\n") + lines.slice(i).join('\n');

                    const col = parseInt(parts.pop());
                    const line = parseInt(parts.pop());
                    const file = parts.pop();
                    let infoStr = parts.pop();
                    let infoArr = infoStr.split(" ");

                    let method = null;
                    for (let j = 0; j < infoArr.length; j++) {
                        const element = infoArr[j];
                        if (!element) {
                            continue;
                        }

                        if (element.indexOf("at")===0) {
                            continue;
                        }

                        method = element;
                        break;
                    }

                    result = {
                        file,
                        line,
                        col,
                        method,
                        isMinified,
                        stack: strippedOutStackTrace
                    }

                    break;
                }

                return result;
            }
        }
    }
    catch(err)
    {

    }

    return null;
}

function generateLid(maxChars = 8)
{
    try
    {
        const line = getInvocationLine();
        if (!line) {
            return `LID${Date.now()}`;
        }
        const fun = line.method.split(".");
        const id = fun[0].toUpperCase().substring(0, 3);
        if (id.length >= maxChars) {
            return id.substring(0, maxChars);
        }

        let combined1 = `${id}:${line.line}`;
        if (combined1.length >= maxChars) {
            combined1 = combined1.replaceAll(":", "");
            return combined1.substring(0, maxChars);
        }

        let combined2 = `${id}:${line.line}:${line.col}`;
        if (combined2.length > maxChars) {
            const combined3 = combined2.substring(0, maxChars);
            if (combined3.endsWith(":")) {
                return `${id}${line.line}:${line.col}`.substring(0, maxChars);
            }

            return combined2.substring(0, maxChars);
        }

        return `${id}${line.line}:${line.col}`.substring(0, maxChars);
    }
    catch (e) {
        return `ERR_LID${Date.now()}`;
    }
}


/**
 * https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
 * @returns {string}
 */
function detectEnvironment()
{
    if (typeof process === "object")
    {
        if (typeof process.versions === "object")
        {
            if (typeof process.versions.node !== "undefined")
            {
                return SYSTEM.NODE;
            }
        }
    }
    return SYSTEM.BROWSER;
}

const currentSystem = detectEnvironment();

/**
 * Tell whether we are in a Node environment
 * @returns {boolean}
 */
function isNode()
{
    return currentSystem === SYSTEM.NODE;
}

const COMMON_METHODS = [
    "alert",
    "assert",
    "keepLogHistory",
    "getLogHistory",
    "truncateMessage",
    "truncateMessage",
    "rawLog",
    "removeOverride",
    "removeOverrideError",
    "overrideConsole",
    "overrideError",
    "table",
    "rawInfo",
    "rawWarn",
    "rawError",
    "hasSeenLid",
    "addToLogHistory",
    "releaseLogHistory",
    "resetLogHistory",
    "setLogFormat",
    "resetLogFormatter",
    "getRawLogHistory",
];


/**
 * @module ____AnaLogger
 * @class ____AnaLogger
 */
class ____AnaLogger
{
    system = "";

    instanceId = "";
    instanceName = "";

    static #instances = [];

    logIndex = 0;
    logCounter = 0;

    #contexts = [];
    #targets = {...DEFAULT_LOG_TARGETS};
    #levels = {};

    activeTargets = [Object.values(DEFAULT_LOG_TARGETS)];

    indexColor = 0;

    format = "";

    keepLog = false;
    logHistory = [];

    $containers = null;

    options = {
        hideHookMessage: false
    };

    static Console = null;

    #overridenMap = {
        log  : false,
        info : false,
        warn : false,
        error: false,
    };

    static ALIGN = {
        LEFT : "LEFT",
        RIGHT: "RIGHT"
    };

    static ENVIRONMENT_TYPE = {
        BROWSER: "BROWSER",
        NODE   : "NODE",
        OTHER  : "OTHER"
    };

    static instanceCount = 0;

    static pluginTable = {};

    originalFormatFunction;

    static lidTable = {};
    static lidTableOn = false;

    forceLidOn = false;
    resolveLineCall = false;
    resolveErrorLineCall = false;

    constructor({name = "default"} = {})
    {
        this.system = detectEnvironment();

        this.format = this.onBuildLog.bind(this);
        this.originalFormatFunction = this.format;

        this.instanceName = name;

        this.instanceId = ____AnaLogger.instanceCount + "-" + Date.now();
        ____AnaLogger.#instances[____AnaLogger.instanceCount] = this;
        ++____AnaLogger.instanceCount;

        this.errorTargetHandler = this.onError.bind(this);
        this.errorUserTargetHandler = this.onErrorForUserTarget.bind(this);

        this.setOptions(this.options);

        if (!____AnaLogger.Console) {
            ____AnaLogger.Console = {
                log: console.log,
                info: console.info,
                warn: console.warn,
                error: console.error,
                debug: console.debug,
                table: console.table
            }
        }

        this.rawLog = ____AnaLogger.Console.log;
        this.rawInfo = ____AnaLogger.Console.info;
        this.rawWarn = ____AnaLogger.Console.warn;
        this.rawError = ____AnaLogger.Console.error;

        this.ALIGN = ____AnaLogger.ALIGN;
        this.ENVIRONMENT_TYPE = ____AnaLogger.ENVIRONMENT_TYPE;

        this.#initialiseDefault();

        this.resetLogHistory();
    }

    getName()
    {
        return this.instanceName;
    }

    getId()
    {
        return this.instanceId;
    }

    /**
     * For the logger to generate a lid when none is specified
     * @param lidOn
     */
    forceLid(lidOn = true)
    {
        this.forceLidOn = !!lidOn;
    }

    forceResolveLineCall(resolveLineCall = true)
    {
        this.resolveLineCall = !!resolveLineCall;
    }

    forceResolveErrorLineCall(resolveErrorLineCall = true)
    {
        this.resolveErrorLineCall = !!resolveErrorLineCall;
    }

    importLids(lids)
    {
        for (let lid in lids)
        {
            const lidObj = lids[lid] || {};
            lidObj.lid = lidObj.lid || lid;
            lidObj.callCount = 0;
            lidObj.callTimes = [];
            ____AnaLogger.lidTable[lid] = lidObj;
        }
        ____AnaLogger.lidTableOn = true;
    }

    loadLids(lids)
    {
        lids = lids || {};
        this.importLids(lids);
    }

    convertTimestampToDate(timestamp)
    {
        const date = new Date(timestamp); // Create a Date object from the timestamp

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    getLids()
    {
        const clone = {...__AnaLogger.lidTable };
        for (let lid in clone)
        {
            const lidObj = clone[lid] || {};
            if (lidObj.callTimes.length)
            {
                lidObj.dates = [];
                for (let j = 0; j < lidObj.callTimes.length; ++j)
                {
                    const callTime = lidObj.callTimes[j];
                    const readableTime = this.convertTimestampToDate(callTime);
                    lidObj.dates.push(readableTime);
                }
            }
        }
        return clone;
    }

    keepLogHistory()
    {
        this.keepLog = true;
    }

    releaseLogHistory()
    {
        this.keepLog = false;
    }

    resetLogHistory()
    {
        this.logHistory = [];
    }

    addToLogHistory(obj)
    {
        obj = obj || {};
        this.logHistory.push(Object.assign({}, obj));
    }

    /**
     * Returns log entries
     * @note This method should return the list of objects rather than
     * the array of text
     * @param join
     * @param symbol
     * @returns {string|*[]}
     */
    getLogHistory(join = true, symbol = EOL)
    {
        const historyLog = this.logHistory || [];
        const history = [];
        historyLog.forEach((logEntry) =>
        {
            const {text} = logEntry;
            history.push(text);
        });

        if (!join)
        {
            return history;
        }

        return history.join(symbol);
    }

    getRawLogHistory()
    {
        return this.logHistory || [];
    }

    hasSeenLid(lid)
    {
        this.logHistory = this.logHistory || [];
        for (let i = 0; i < this.logHistory.length; ++i)
        {
            const log = this.logHistory[i] || {};
            const context = log.context || {};
            if (lid === context.lid)
            {
                return true;
            }
        }

        return false;
    }

    forceEnvironment(system)
    {
        this.forcedSystem = system;
    }

    /**
     * Tell whether we are in a Node environment
     * @returns {boolean}
     */
    isNode()
    {
        if (this && this.forcedSystem)
        {
            return this.forcedSystem === SYSTEM.NODE;
        }

        return isNode();
    }

    /**
     * Tell whether the logger runs from a browser
     * @returns {boolean}
     */
    isBrowser()
    {
        return !this.isNode();
    }

    resetLogger()
    {
        this.options = {};
        this.options.timeLenMax = 12;
        this.options.contextLenMax = 10;
        this.options.idLenMax = 5;
        this.options.lidLenMax = 6;
        this.options.messageLenMax = undefined;
        this.options.symbolLenMax = 60;
        this.options.hideHookMessage = undefined;
        this.options.hidePassingTests = undefined;
        this.options.hideLog = undefined;
        this.options.hideError = undefined;
        this.options.oneConsolePerContext = true;
        this.options.logToDom = undefined;
        this.options.logToFile = undefined;
        this.options.logMaxSize = 0;
        this.options.logMaxArchives = 3;
        this.options.logIndexArchive = 0;
        this.options.logToRemote = undefined;
        this.options.addArchiveTimestamp = true;
        this.options.addArchiveIndex = true;
        this.options.logToRemoteUrl = undefined;
        this.options.logToRemoteBinaryUrl = undefined;
        this.options.compressArchives = false;
        this.options.compressionLevel = 1;
        this.options.protocol = undefined;
        this.options.host = undefined;
        this.options.port = undefined;
        this.options.pathname = undefined;
        this.options.binarypathname = undefined;
        this.options.enableDate = undefined;
    }

    resetOptions()
    {
        this.resetLogger();
    }

    setOptions({
                   contextLenMax = 10,
                   idLenMax = 5,
                   lidLenMax = 6,
                   symbolLenMax = 2,
                   messageLenMax = undefined,
                   hideLog = undefined,
                   hideError = undefined,
                   hideHookMessage = undefined,
                   hidePassingTests = undefined,
                   logToDom = undefined,
                   logToFile = undefined,
                   logMaxSize = 0,
                   logMaxArchives = 3,
                   logIndexArchive = 0,
                   addArchiveTimestamp = true,
                   addArchiveIndex = true,
                   compressArchives = false,
                   compressionLevel = 1,
                   logToRemote = undefined,
                   logToRemoteUrl = undefined,
                   logToRemoteBinaryUrl = undefined,
                   loopback = DEFAULT.loopback,
                   requiredLogLevel = DEFAULT_LOG_LEVELS.LOG,
                   oneConsolePerContext = undefined,
                   silent = undefined,
                   enableDate = undefined,
                   /** Remote - all optional **/
                   protocol = undefined,
                   host = undefined,
                   port = undefined,
                   pathname = undefined,
                   binarypathname = undefined,
                   loadHtmlToImage = false
               } = null)
    {
        this.options.contextLenMax = contextLenMax;
        this.options.idLenMax = idLenMax;
        this.options.lidLenMax = lidLenMax;
        this.options.messageLenMax = messageLenMax;
        this.options.symbolLenMax = symbolLenMax;

        this.options.logMaxSize = logMaxSize;
        this.options.logMaxArchives = logMaxArchives;
        this.options.logIndexArchive = logIndexArchive;
        this.options.addArchiveTimestamp = addArchiveTimestamp;
        this.options.addArchiveIndex = addArchiveIndex;
        this.options.compressArchives = compressArchives;
        this.options.compressionLevel = compressionLevel;

        this.options.requiredLogLevel = requiredLogLevel;

        if (loadHtmlToImage) {
            const code = getHtmlToImage();
            addScriptToDOM(code);
        }

        // TODO: Make one of silent or hideToLog options obsolete
        let solveSilent = undefined;
        if (silent !== undefined)
        {
            solveSilent = !!silent;
        }
        else if (hideLog !== undefined)
        {
            solveSilent = !!hideLog;
        }

        // Force boolean type
        [
            {hideLog: solveSilent},
            {oneConsolePerContext},
            {hideError},
            {enableDate},
            {hideHookMessage},
            {hidePassingTests},
            {logToRemote},
        ].forEach((feature) =>
        {
            const key = Object.keys(feature)[0];
            const val = feature[key];
            if (val !== undefined)
            {
                this.options[key] = !!val;
            }
        });

        // Any type
        [
            {logToRemoteBinaryUrl},
            {logToRemoteUrl},
            {loopback},
            {protocol},
            {host},
            {port},
            {pathname},
            {binarypathname},
        ].forEach((feature) =>
        {
            const key = Object.keys(feature)[0];
            const val = feature[key];
            if (val !== undefined)
            {
                this.options[key] = val;
            }
        });

        if (this.options.logToRemote && !this.options.logToRemoteUrl)
        {
            this.options.logToRemoteUrl = this.convertToUrl({
                protocol: this.options.protocol,
                host    : this.options.host,
                port    : this.options.port,
                pathname: this.options.pathname
            });
        }

        if (this.options.logToRemote && !this.options.logToRemoteBinaryUrl)
        {
            this.options.logToRemoteBinaryUrl = this.convertToUrl({
                protocol: this.options.protocol,
                host    : this.options.host,
                port    : this.options.port,
                pathname: this.options.binarypathname || DEFAULT.binarypathname
            });
        }

        // Special cases
        if (logToDom === false)
        {
            this.options.logToDom = false;
        }
        else if (logToDom !== undefined)
        {
            this.options.logToDom = (logToDom === true) ? DEFAULT.consoleDomId : logToDom;
        }

        if (logToFile === false)
        {
            this.options.logToFile = false;
        }
        else if (logToFile !== undefined)
        {
            if (!this.isBrowser())
            {
                this.options.logToFile = logToFile || DEFAULT.logFilename;

                /** to-esm-browser: remove **/
                // these require won't get compiled by to-esm
                this.options.logToFilePath = path.resolve(this.options.logToFile);
                this.EOL = os.EOL;
                /** to-esm-browser: end-remove **/
            }

            /** to-esm-browser: add
             ____AnaLogger.Console.log("LogToFile is not supported in this environment. ")
             **/
        }

    }

    getOptions()
    {
        return this.options;
    }

    truncateMessage(input = "", {fit = 0, align = ____AnaLogger.ALIGN.LEFT, ellipsis = "..."} = {})
    {
        input = "" + input;
        if (fit && input.length > fit)
        {
            input = input.substring(0, fit - ellipsis.length) + ellipsis;
        }

        input = align === ____AnaLogger.ALIGN.LEFT ? input.padEnd(fit, " ") : input.padStart(fit, " ");
        return input;
    }

    /**
     * Format inputs
     * @see Override {@link setLogFormat}
     * @param contextName
     * @param id
     * @param message
     * @param lid
     * @param symbol
     * @returns {string}
     */
    onBuildLog({contextName, message = "", lid = "", symbol = ""} = {})
    {
        try
        {
            let strResult = "";

            const strs = message.split(/\n/g);

            for (let i = 0; i < strs.length; ++i)
            {
                let message0 = strs[i];

                // Time
                const now = new Date();
                let time = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2);

                if (this.options.enableDate)
                {
                    let date = now.getFullYear().toString().slice(-2) + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0");
                    time = date + " " + time;
                }

                // Display content in columns
                time = this.truncateMessage(time, {fit: this.options.timeLenMax});

                if (i > 0)
                {
                    contextName = "";
                    lid = "";
                }
                contextName = this.truncateMessage(contextName, {
                    fit  : this.options.contextLenMax,
                    align: ____AnaLogger.ALIGN.RIGHT
                });
                lid = this.truncateMessage(lid, {fit: this.options.lidLenMax});

                if (this.options.messageLenMax !== undefined)
                {
                    message0 = this.truncateMessage(message0, {fit: this.options.messageLenMax});
                }

                symbol = this.truncateMessage(symbol, {fit: this.options.symbolLenMax});

                if (i <= 0)
                {
                    strResult += `[${time}] ${contextName}: (${lid}) ${symbol} ${message0}`;
                }
                else
                {
                    // If last line empty, don't display it
                    if (i < strs.length - 1)
                    {
                        strResult += "\n";
                        strResult += `[${time}] ${contextName}   ${lid}     ${message0}`;
                    }
                    else
                    {
                        if (message0)
                        {
                            strResult += "\n";
                            strResult += `[${time}] ${contextName}   ${lid}     ${message0}`;
                        }
                    }
                }
            }

            return strResult;
        }
        catch (e)
        {
            ____AnaLogger.Console.error(`ANALOGGER_FAILURE_1001: ${e.message}`);
        }

        return "";
    }

    onErrorForUserTarget(context, ...args)
    {
        this.errorUserTargetHandler(context, ...args);
    }

    onError(context, ...args)
    {
        if (context.target === this.#targets.USER)
        {
            this.onErrorForUserTarget(context, ...args);
        }
    }

    /**
     * Forward input to real console log
     * @param args
     */
    onDisplayLog(...args)
    {
        this.log(...args);
    }

    assistStask(error)
    {
        try
        {
            const lines = error.stack.split("\n");
            const stack = [];

            for (let i = 0; i < lines.length; ++i)
            {
                const line = lines[i];
                stack.push(line);
            }

            return stack;
        }
        catch (e)
        {
            ____AnaLogger.Console.error(`ANALOGGER_FAILURE_1002: ${e.message}`);
        }

        return error.message;
    }

    /**
     * Forward input to real console log
     * @param args
     */
    onDisplayError(...args)
    {
        try
        {
            let mainIndex = -1;
            let extracted = null;
            for (let i = 0; i < args.length; ++i)
            {
                const arg = args[i];
                if (arg instanceof Error)
                {
                    if (arg.stack)
                    {
                        mainIndex = i;
                        extracted = this.assistStask(arg) || [];
                        break;
                    }
                }
            }

            if (!extracted)
            {
                this.error(...args);
                return;
            }

            for (let i = 0; i < extracted.length; ++i)
            {
                args[mainIndex] = extracted[i];
                this.error(...args);
            }

        }
        catch (e)
        {
            ____AnaLogger.Console.error(`ANALOGGER_FAILURE_1003: ${e.message}`);
        }

    }

    /**
     * Set log template
     * @param format
     */
    setLogFormat(format)
    {
        if (typeof format !== "function")
        {
            console.error("Invalid parameter for setFormat. It is expecting a function or method.");
            return false;
        }
        this.format = format.bind(this);
    }

    resetLogFormatter()
    {
        this.format = this.originalFormatFunction;
    }

    setErrorHandler(handler)
    {
        this.errorTargetHandler = handler.bind(this);
    }

    setErrorHandlerForUserTarget(handler)
    {
        this.errorUserTargetHandler = handler.bind(this);
    }

    // ------------------------------------------------
    // Color
    // ------------------------------------------------

    // ------------------------------------------------
    // Log Contexts
    // ------------------------------------------------
    isContextValid(context)
    {
        if (
            !(typeof context === "object" &&
                !Array.isArray(context) &&
                context !== null)
        )
        {
            return false;
        }
        return (context.hasOwnProperty("contextName") && context.hasOwnProperty("target"));
    }

    /**
     * Set context properties for default context
     * @param context
     */
    setDefaultContext(context)
    {
        this.setContext(DEFAULT_LOG_CONTEXTS.DEFAULT.contextName, context);
    }

    /**
     * Generate a default context with a default color
     * @returns {*|{}}
     */
    generateDefaultContext()
    {
        let defaultContext = this.#contexts[DEFAULT_LOG_CONTEXTS.DEFAULT.contextName] || {};
        defaultContext = Object.assign({},
            {
                lid        : "",
                contextName: DEFAULT_LOG_CONTEXTS.DEFAULT.contextName,
                target     : DEFAULT_LOG_TARGETS.ALL,
                symbol     : "⚡",
                color      : COLOR_TABLE[1],
                logLevel   : DEFAULT_LOG_LEVELS.LOG
            }, defaultContext);

        defaultContext.name = defaultContext.contextName;

        defaultContext.id = this.logIndex++;
        return defaultContext;
    }

    /**
     * Generate a new context based on the default context.
     * The only difference with default is that a different color will be assigned to that context automatically
     * @returns {*|{}}
     */
    generateNewContext()
    {
        const newContext = this.generateDefaultContext();
        newContext.color = COLOR_TABLE[(this.indexColor++) % (COLOR_TABLE.length - 3) + 2];
        newContext.symbol = "";
        return newContext;
    }

    generateErrorContext()
    {
        const errorContext = this.generateDefaultContext();
        errorContext.contextName = DEFAULT_LOG_CONTEXTS.ERROR.contextName;
        errorContext.name = errorContext.contextName;
        errorContext.color = COLOR_TABLE[0];
        errorContext.symbol = "❌";
        errorContext.error = true;
        errorContext.logLevel = DEFAULT_LOG_LEVELS.ERROR;
        return errorContext;
    }

    /**
     * Use given context to generate new context
     * @param entry
     * @returns {any}
     */
    #defineContextProperties(entry)
    {
        const defaultContext = this.generateNewContext();
        const converted = Object.assign({}, defaultContext, entry);
        if (converted.color.toLowerCase().indexOf("rgb") > -1)
        {
            converted.color = toAnsi.rgbStringToHex(converted.color);
        }
        else if (converted.color.indexOf("#") === -1)
        {
            converted.color = toAnsi.colorNameToHex(converted.color);
        }

        return converted;
    }

    /**
     * Redefine a context
     * @param contextName
     * @param context
     */
    setContext(contextName, context = {})
    {
        context.contextName = contextName;
        context.name = contextName;
        context = this.#defineContextProperties(context);
        this.#contexts[contextName] = context;
    }

    getContext(contextName)
    {
        return this.#contexts[contextName];
    }

    /**
     * Load the context names that should be available to the environment.
     * They are defined by the user.
     * @see Context definitions {@link ./example/more/contexts-def.cjs}
     * @param contextTable
     */
    setContexts(contextTable)
    {
        const arr = Object.keys(contextTable);
        arr.forEach((contextName) =>
        {
            const contextPassed = contextTable[contextName] || {};
            this.setContext(contextName, contextPassed);
            contextTable[contextName] = this.#contexts[contextName];
        });
    }

    getContexts()
    {
        return Object.freeze(this.#contexts);
    }

    setTargets(targetTable = {})
    {
        let targetObjects = {};
        if (Array.isArray(targetTable))
        {
            try
            {
                for (let i = 0; i < targetTable.length; ++i)
                {
                    const entry = targetTable[i];
                    if (typeof entry === "string" || entry instanceof String)
                    {
                        targetObjects[entry] = entry;
                    }
                    else if (typeof entry === "object")
                    {
                        let found = null;
                        for (let prop in entry)
                        {
                            let valueProp = entry[prop];
                            prop = prop.trim();
                            if (!prop)
                            {
                                console.error(`Invalid target`);
                                break;
                            }

                            if (typeof valueProp === "string" || valueProp instanceof String)
                            {
                                valueProp = valueProp.trim();
                                found = [prop, valueProp];
                                break;
                            }

                            if (typeof valueProp === "number")
                            {
                                break;
                            }

                        }

                        if (found)
                        {
                            targetObjects[found[0]] = found[1];
                        }

                    }

                }
            }
            catch (e)
            {
                console.error({lid: 4321}, e.message);
            }
        }
        else
        {
            targetObjects = targetTable;
        }

        this.#targets = Object.assign({}, targetObjects, {...DEFAULT_LOG_TARGETS});
    }

    addTargets(targets)
    {
        const currentTargets = this.#targets;
        const merged = Object.assign({}, currentTargets, targets);
        this.setTargets(merged);
    }

    getTargets()
    {
        return Object.freeze(this.#targets);
    }

    /**
     * Set one or more active targets
     * @param targets
     */
    setActiveTargets(targets = null)
    {
        if (targets === undefined || targets === null) {
            this.activeTargets = [DEFAULT_LOG_TARGETS.ALL];
            return;
        }

        // If targets is a function, call it to get the actual targets
        if (typeof targets === "function") {
            targets = targets.call(this);
        }

        if (targets === null)
        {
            this.activeTargets = [DEFAULT_LOG_TARGETS.ALL];
            return;
        }
        else if (typeof targets === "string" || targets instanceof String)
        {
            targets = targets.split(",");
        }
        else if (typeof targets === "function")
        {
            // If targets is a closure, call it to get the actual targets
            targets = targets.call(this);
        }
        else if (typeof targets === "object")
        {
            targets = Object.values(targets);
        }
        else if (!Array.isArray(targets))
        {
            return ;
        }

        const filteredTargets = [];
        for (let i = 0; i < targets.length; ++i)
        {
            const target = targets[i].trim();
            if (Object.values(this.#targets).includes(target)) {
                filteredTargets.push(target);
            }
        }

        this.activeTargets = filteredTargets;
    }

    getActiveTargets()
    {
        return this.activeTargets;
    }

    getActiveTarget()
    {
        const activeTargets = this.getActiveTargets() || [];
        return activeTargets[0] || DEFAULT_LOG_TARGETS.NONE;
    }

    /**
     * Set only one active target
     * NOTE: Kept for backward compatibility.
     * Use setActiveTargets instead
     * @param target
     */
    setActiveTarget(target)
    {
        this.activeTargets = [];
        this.setActiveTargets(target);
        // In case of strings
        const activeTarget = this.activeTargets[0] || DEFAULT_LOG_TARGETS.NONE;
        this.activeTargets = [activeTarget];
    }

    setLogLevel(name, level)
    {
        this.#levels[name] = level;
    }

    getLogLevel(name)
    {
        return this.#levels[name];
    }

    setLogLevels(levels)
    {
        this.#levels = levels;
    }

    getLogLevels()
    {
        return Object.freeze(this.#levels);
    }

    isTargetAllowed(target)
    {
        if (target === DEFAULT_LOG_TARGETS.NONE)
        {
            return false;
        }

        if (target === DEFAULT_LOG_TARGETS.ALL)
        {
            return true;
        }

        if (this.getActiveTarget() === DEFAULT_LOG_TARGETS.ALL)
        {
            return true;
        }

         return this.activeTargets.includes(target);
    }


    // ------------------------------------------------
    // Logging methods
    // ------------------------------------------------
    /**
     * Add many sections (columns) to a given DOM line
     * @param $line
     * @param context
     * @param text
     */
    setColumns($line, context, text)
    {
        let index = 0;
        for (let columnName in context)
        {
            if (!["contextName", "symbol", "lid", "text"].includes(columnName))
            {
                continue;
            }

            const colContent = context[columnName];
            const $col = document.createElement("span");
            $col.classList.add("analogger-col", `analogger-col-${columnName}`, `analogger-col-${index}`);
            ++index;
            $col.textContent = colContent;
            $line.append($col);
        }

        let $col = document.createElement("span");
        $col.classList.add("analogger-col", "analogger-col-text", `analogger-col-${index}`);
        $col.textContent = text;
        $line.append($col);

        // Add 3 more columns
        for (let i = 1; i <= 3; ++i)
        {
            $col = document.createElement("span");
            $col.classList.add("analogger-col", "analogger-col-extra", `analogger-extra-${i}`);
            $line.append($col);
        }
    }

    /**
     * Check that the div has not too many entries
     * @param $view
     */
    removeDomOldEntries = ($view) =>
    {
        const nbChildren = $view.childElementCount;
        if (nbChildren > MAX_CHILDREN_DOM_ANALOGGER)
        {
            const n = Math.ceil(MAX_CHILDREN_DOM_ANALOGGER / 10);
            for (let i = 0; i < n; ++i)
            {
                $view.removeChild($view.firstChild);
            }
            return n;
        }

        return 0;
    };

    /**
     * Scroll to bottom if div is already at the bottom
     * @param $view
     */
    scrollDivToBottom = ($view) =>
    {
        const scrollBottom = $view.scrollHeight - ($view.clientHeight + $view.scrollTop);
        const divHeight = $view.clientHeight || $view.offsetHeight;
        if (scrollBottom > divHeight / 2)
        {
            /* istanbul ignore next */
            return;
        }

        $view.scrollTop = $view.scrollHeight;
    };

    checkOnLoggingToDom(context, param2)
    {
        try
        {
            let callback = context.onLoggingToDom;
            if (typeof callback !== "function")
            {
                return;
            }

            return callback.call(this, context, param2);
        }
        catch (e)
        {
        }
    }

    /**
     * Add a line to the Analogger div.
     * Remove older lines if exceeding limit.
     * @param $view
     * @param $line
     * @param context
     * @param addType
     * @param message
     * @param text
     * @param args
     */
    addLineToDom($view, $line, {context, addType, message, text, args})
    {
        let proceedFurther = this.checkOnLoggingToDom(context, {
            message,
            text,
            args,
            logCounter: this.logCounter,
            $view,
            $line,
            addType
        });

        // If one of the plugins returns false, no further operation will follow
        if (proceedFurther === false)
        {
            return;
        }

        if (addType === ADD_TYPE.BOTTOM)
        {
            $view.append($line);
        }
        else
        {
            $view.insertBefore($line, $view.firstChild);
        }

        let nbRemoved = this.removeDomOldEntries($view);
        if (nbRemoved)
        {
            if ($view.getElementsByClassName(CLASS_REMOVED_NOTIF).length)
            {
                return;
            }

            this.showRemovedNotification(context);
            return;
        }

        this.scrollDivToBottom($view);

    }

    showRemovedNotification(context)
    {
        context.contextName = ANALOGGER_NAME;
        context.symbol = "🗑";
        context.color = "orange";
        context.className = CLASS_REMOVED_NOTIF;

        clearTimeout(this.timerAddLineToDomID);
        this.timerAddLineToDomID = setTimeout(() =>
        {
            this.timerAddLineToDomID = null;
            /* istanbul ignore next */
            this.writeLogToDom(context, "", {addType: ADD_TYPE.TOP, message: `Oldest entries removed`});
        }, 500);
    }

    writeLogToDom(context, fullText, {addType = ADD_TYPE.BOTTOM, message = "", args = null} = {})
    {
        this.$containers = this.$containers || document.querySelectorAll(this.options.logToDom);
        fullText = message || fullText;

        for (let i = 0; i < this.$containers.length; ++i)
        {
            const $container = this.$containers[i];

            let $header = $container.querySelector("." + CONSOLE_HEADER_CLASSNAME);
            if (!$header)
            {
                $header = document.createElement("div");
                $header.classList.add(CONSOLE_HEADER_CLASSNAME);

                $header.append(document.createElement("span"));
                $header.append(document.createElement("span"));
                $header.append(document.createElement("span"));

                $container.append($header);
            }

            let $view = $container.querySelector("." + CONSOLE_AREA_CLASSNAME);
            if (!$view)
            {
                $view = document.createElement("div");
                $view.classList.add(CONSOLE_AREA_CLASSNAME);
                $container.append($view);
            }

            let $footer = $container.querySelector("." + CONSOLE_FOOTER_CLASSNAME);
            if (!$footer)
            {
                $footer = document.createElement("div");
                $footer.classList.add(CONSOLE_FOOTER_CLASSNAME);

                $footer.append(document.createElement("span"));
                $footer.append(document.createElement("span"));
                $footer.append(document.createElement("span"));

                $container.append($footer);
            }

            const $line = document.createElement("div");
            $line.classList.add(LINE_CLASSNAME);
            if (context.className)
            {
                $line.classList.add(context.className);
            }
            $line.style.color = context.color;

            this.setColumns($line, context, fullText, args);

            // Prevent the application to be stuck when many logs are entered at once
            /* istanbul ignore next */
            setTimeout(/* istanbul ignore next */function ($view, $line, {addType, context, message, text, args})
            {
                /* istanbul ignore next */
                this.addLineToDom($view, $line, {addType, context, message, text, args});
            }.bind(this, $view, $line, {addType, context, message, text: fullText, args}), 0);

        }
    }

    writeLogToFile(text)
    {
        try
        {
            if (!fs.existsSync(this.options.logToFilePath))
            {
                const dir = path.dirname(this.options.logToFilePath);
                if (!fs.existsSync(dir))
                {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(this.options.logToFilePath, "");
            }

            // Check filesize doesn't exceed the limit set by the user
            if (this.options.logMaxSize) {
                const stats = fs.statSync(this.options.logToFilePath);
                const fileSizeInBytes = stats.size;
                if (fileSizeInBytes > this.options.logMaxSize) {

                    if (this.options.logIndexArchive < this.options.logMaxArchives) {
                        ++this.options.logIndexArchive;
                    } else {
                        this.options.logIndexArchive = 1;
                    }

                    // Extract the archive name without the extension
                    const padding = this.options.logMaxArchives.toString().length + 1;
                    const {filePath, extension, basename, dirname} = getFilePathProperties(this.options.logToFilePath);

                    // Find index of the next archive
                    let indexStr, timeStamp;
                    indexStr = this.options.addArchiveIndex ? "." + this.options.logIndexArchive.toString().padStart(padding, "0") : "";
                    timeStamp = this.options.addArchiveTimestamp ? "." + getConsistentTimestamp() : "";

                    // Deduce old log file name
                    const oldFileName = `${filePath}${timeStamp}${indexStr}${extension}`;

                    // Deduce archive name
                    const archiveFileName = this.options.compressArchives ? `${filePath}.tar.gz` : "";

                    // Delete old archives
                    deleteFilesWithIndex(dirname, basename, indexStr, extension, archiveFileName, this.options.compressionLevel, (error/*, deletedFiles*/) => {
                        if (error) {
                            console.error(`DELETION_FAILURE: Failed to delete some files`);
                        }
                    });

                    fs.renameSync(this.options.logToFilePath, oldFileName);
                    fs.writeFileSync(this.options.logToFilePath, "");
                }
            }
            fs.appendFileSync(this.options.logToFilePath, text + this.EOL);
        } catch (e) {
            /* istanbul ignore next */
            ____AnaLogger.Console.error("LOG_TO_FILE_FAILURE: ", e.message);
        }
    }

    writeLogToRemote(...data)
    {
        try
        {
            const urlDest = this.generateLogToRemoteUrl(this.options.logToRemoteUrl);
            if (!urlDest)
            {
                return null;
            }

            const entry = [...data];
            const stringified = JSON.stringify(entry);
            fetch(urlDest, {
                method : "post",
                body   : stringified,
                headers: {"Content-Type": "application/json"},
            })
                .then(res => res.json())
                .catch(() => null);
        }
        catch (e)
        {
            /* istanbul ignore next */
            ____AnaLogger.Console.error("LOG_TO_REMOTE_FAILURE: ", e.message);
        }
    }

    /**
     * Send data to the registered remote server
     * @param raw
     * @param context
     * @param done
     */
    uploadDataToRemote(raw, context = null, done = null)
    {
        try
        {
            if (!this.options.logToRemote)
            {
                return;
            }

            const urlDest = this.generateLogToRemoteUrl(this.options.logToRemoteBinaryUrl, {pathname: DEFAULT.binarypathname});
            if (!urlDest)
            {
                return null;
            }

            let data = raw;
            if (context)
            {
                data = JSON.stringify({raw, context});
            }

            fetch(urlDest, {
                method: "post",
                body  : data,
            })
                .then((response) => response.json())
                .then((data) => done && done(data))
                .catch(e => e);
        }
        catch (e)
        {
            /* istanbul ignore next */
            ____AnaLogger.Console.error("BINARY_TO_REMOTE_FAILURE: ", e.message);
        }
    }

    stringifyEntry(arg)
    {
        let str;

        try
        {
            str = JSON.stringify(arg);
        }
        catch (e)
        {

        }

        if (!str)
        {
            try
            {
                str = stringify(arg);
            }
            catch (e)
            {

            }
        }

        return str;
    }

    /**
     * If a variable is too complex for the logger, stringify it
     */
    convertEntry(arg)
    {
        try
        {
            if (arg === null || arg === undefined || arg === "")
            {
                return arg;
            }
            else if (typeof arg === "boolean")
            {
                return arg;
            }
            else if (typeof arg === "symbol")
            {
                return arg;
            }
            if (typeof arg === "number")
            {
                return arg;
            }
            else if (typeof arg === "string" || myVar instanceof arg)
            {
                return arg;
            }
            else if (arg instanceof Date)
            {
                return arg;
            }
        }
        catch (e)
        {
        }

        return this.stringifyEntry(arg);
    }

    convertArgumentsToText(args)
    {
        const strs = [];
        let text;
        const n = args.length;
        for (let i = 0; i < n; ++i)
        {
            let str;
            let arg = args[i];

            str = this.convertEntry(arg);

            strs.push(str);
        }

        text = strs.join("•");
        return text;
    }

    writeToConsole(output, context)
    {
        const res = [output];
        if (this.isBrowser())
        {
            res.push(`color: ${context.color}`);
        }

        const contextLevel = context.contextLevel || DEFAULT_LOG_LEVELS.LOG;
        if (contextLevel >= DEFAULT_LOG_LEVELS.ERROR)
        {
            ____AnaLogger.Console.error(...res);
        }
        else if (contextLevel >= DEFAULT_LOG_LEVELS.WARN)
        {
            ____AnaLogger.Console.warn(...res);
        }
        else if (contextLevel >= DEFAULT_LOG_LEVELS.INFO)
        {
            ____AnaLogger.Console.info(...res);
        }
        else if (contextLevel >= DEFAULT_LOG_LEVELS.LOG)
        {
            ____AnaLogger.Console.log(...res);
        }
        else if (contextLevel >= DEFAULT_LOG_LEVELS.DEBUG)
        {
            ____AnaLogger.Console.debug(...res);
        }

    }

    /**
     * Parse the context. If one of its keys has the same name as a registered plugin,
     * the system will invoke the plugin (the value of the key must be anything truthy).
     * @param context
     * @param extras
     * @returns {undefined|boolean}
     */
    checkPlugins(context, {message, text, args, logCounter})
    {
        try
        {
            if (!Object.keys(____AnaLogger.pluginTable).length)
            {
                return;
            }

            let proceedFurther = true;
            for (let keyName in context)
            {
                const pluginOptions = context[keyName];

                /**
                 * The key has been passed in the context, but has a falsy value,
                 * so let's ignore it
                 */
                if (!pluginOptions)
                {
                    continue;
                }

                /**
                 * Extract plugin properties
                 * @type PLUGIN_TYPE
                 */
                const pluginProperties = ____AnaLogger.pluginTable[keyName];

                /**
                 * Check plugin properties exists
                 * @see addPlugin
                 * @see addGlobalPlugin
                 */
                if (!pluginProperties)
                {
                    continue;
                }

                // Should be an object
                if (typeof pluginProperties !== "object")
                {
                    continue;
                }

                /**
                 * Extract plugin properties
                 */
                const {callback, methodName, type} = pluginProperties;
                if (typeof callback !== "function")
                {
                    continue;
                }

                /**
                 * Invoke the plugin
                 */
                let res = callback.call(this, context, {
                    message,
                    text,
                    args,
                    logCounter,
                    methodName,
                    type,
                    pluginOptions
                });

                // If the plugin returns exactly false, the log entry will be ignored by anaLogger
                if (res === false)
                {
                    proceedFurther = false;
                }
            }
            return proceedFurther;
        }
        catch (e)
        {
        }
    }

    /**
     * If the context contain a key onLogging that is a function,
     * execute
     * @param context
     * @param data
     * @param extras
     * @param callbackName
     * @returns {*}
     */
    checkOnLogging(context, data, extras, callbackName )
    {
        if (!callbackName) {
            return ;
        }
        try
        {
            let callback = context[callbackName];
            if (typeof callback !== "function")
            {
                return;
            }

            return callback.call(this, data, extras);
        }
        catch (e)
        {
        }
    }

    isContextMessagePattern(str) {
        return /\{\{[^}]+}}/.test(str);
    }

    transformContextMessage(template, data)
    {
        let result = template;
        for (const key in data)
        {
            const placeholder = `{{${key}}}`;
            const value = data[key];
            // Replace all occurrences of the placeholder with the value
            result = result.replaceAll(placeholder, value);
        }
        return result;
    }

    /**
     * Display log following template
     * @param context
     * @param argsWithoutContext
     */
    processOutput(context = {}, ...argsWithoutContext)
    {
        try
        {
            let message = "";

            if (____AnaLogger.lidTableOn && context.lid) {
                const lidObj = ____AnaLogger.lidTable[context.lid];

                // If the lid is already in the table, we set the message if not existing
                if (lidObj)
                {
                    context.message = context.message || lidObj.message;
                    lidObj.callCount = lidObj.callCount || 0;
                    ++lidObj.callCount;
                    lidObj.callTimes.push(Date.now());
                }
                // If the lid is not already in the table, we register it
                else {
                    ____AnaLogger.lidTable[context.lid] = {
                        ...context,
                        message: argsWithoutContext[0],
                        lid: context.lid,
                        callCount: 1,
                        callTimes: [Date.now()]
                    }
                }
            }

            if (context.message) {
                // If the context message is a template
                if (this.isContextMessagePattern(context.message)) {
                    // The context message second parameter should be an object that we will use to perform the replacement
                    if (argsWithoutContext.length >= 1 && typeof argsWithoutContext[0] === "object") {
                        context.message = this.transformContextMessage(context.message, argsWithoutContext[0]);
                        // We remove the second parameter from the arguments
                        argsWithoutContext.shift();
                    }
                }

                // We add the context message as an arguments
                argsWithoutContext.unshift(context.message);
            }
            this.applySymbolByName(context);

            this.checkOnLogging(context, context, argsWithoutContext, "onContext");
            if (!this.isTargetAllowed(context.target))
            {
                return;
            }

            if (context.logLevel === DEFAULT_LOG_LEVELS.OFF)
            {
                return;
            }

            if (this.options.requiredLogLevel > context.logLevel)
            {
                return;
            }

            const newMessages = this.checkOnLogging(context, argsWithoutContext[0], arguments,"onMessage");
            if (newMessages !== undefined) {
                arguments[1] = newMessages;
            }

            let args = argsWithoutContext;

            message = this.convertArgumentsToText(args);

            let output = "";
            let text = this.format({...context, message});

            if (this.keepLog)
            {
                this.addToLogHistory({context, message, text});
            }

            ++this.logCounter;

            let proceedFurther = this.checkOnLogging(context, text, {message, args, logCounter: this.logCounter}, "onOutput");
            // If one of the plugins returns false, no further operation will follow
            if (proceedFurther === false)
            {
                return;
            }
            else if (typeof proceedFurther === 'string' || proceedFurther instanceof String)
            {
                text = proceedFurther;
            }

            proceedFurther = this.checkPlugins(context, {message, text, args, logCounter: this.logCounter});

            // If one of the plugins returns false, no further operation will follow
            if (proceedFurther === false)
            {
                return;
            }

            if (this.options.logToRemote)
            {
                this.writeLogToRemote(context, ...args);
            }

            /* istanbul ignore next */
            if (this.isBrowser())
            {
                context.environnment = ____AnaLogger.ENVIRONMENT_TYPE.BROWSER;
                /* istanbul ignore next */
                if (this.options.logToDom)
                {
                    /* istanbul ignore next */
                    this.writeLogToDom(context, text, {message, args,});
                }

                output = `%c${text}`;
            }
            else
            {
                context.environnment = ____AnaLogger.ENVIRONMENT_TYPE.NODE;
                output = toAnsi.getTextFromColor(text, {
                    fg         : context.color,
                    bg         : context.bgColor,
                    isBold     : context.bold,
                    isUnderline: context.underline,
                    isReversed : context.reversed
                });

                if (this.options.logToFile)
                {
                    this.writeLogToFile(text);
                }
            }

            if (this.options.hideLog || context.hideLog || context.silent)
            {
                return;
            }

            this.writeToConsole(output, context);

            this.errorTargetHandler(context, args);
        }
        catch (e)
        {
            /* istanbul ignore next */
            // Don't use the logger to avoid infinite loop
            // Silently fail
        }
    }

    /**
     * Check that a parameter uses the expected AnaLogger format.
     * For this, the first parameter should be an object that contains at least
     * a logging id (lid), a target, a contextName, etc
     * @param options
     * @returns {boolean}
     */
    isExtendedOptionsPassed(options)
    {
        if (typeof options !== "object")
        {
            return false;
        }

        return options.hasOwnProperty("context") ||
            options.hasOwnProperty("target") ||
            options.hasOwnProperty("color") ||
            options.hasOwnProperty("contextName") ||
            options.hasOwnProperty("raw") ||
            options.hasOwnProperty("lid");
    }

    /**
     * Convert a string to an object by parsing the string
     * and identifying key-value pairs
     * @param str
     * @returns {{}|null}
     */
    stringToObject(str) {
        try {
            str = str.trim();

            // Check for brackets and remove them if present
            if (str.startsWith("{") && str.endsWith("}")) {
                str = str.slice(1, -1).trim();
            }

            // If the string is empty, return an empty object
            if (!str) {
                return {};
            }

            const obj = {};
            const keyValuePairs = str.split(",");

            for (const pair of keyValuePairs) {
                const parts = pair.trim().split(":");

                if (parts.length < 2) {
                    // Handle cases like "key5", "fd"
                    if (parts.length===2) {
                        const cleanedKey = parts[0].trim().replace(/^['"]|['"]$/g, "");
                        obj[cleanedKey] = parts[1].trim().replace(/^['"]|['"]$/g, "");
                    }
                    else if (parts.length===1 && Object.keys(obj).length > 0) {
                        const lastKey = Object.keys(obj).pop();
                        if (obj[lastKey] instanceof Array) {
                            obj[lastKey].push(parts[0].trim().replace(/^['"]|['"]$/g, ""));
                        }
                        else {
                            obj[lastKey] = [obj[lastKey], parts[0].trim().replace(/^['"]|['"]$/g, "")];
                        }
                    }
                    continue;
                }

                const key = parts[0];
                const value = parts.slice(1).join(":"); // Handle values with colons

                // Remove leading/trailing quotes from keys and values
                const cleanedKey = key.trim().replace(/^['"]|['"]$/g, "");
                const cleanedValue = value.trim().replace(/^['"]|['"]$/g, "");

                // Attempt to parse the value as a number if it's numeric
                if (!isNaN(cleanedValue) && !isNaN(parseFloat(cleanedValue))) {
                    obj[cleanedKey] = parseFloat(cleanedValue);
                }
                else {
                    obj[cleanedKey] = cleanedValue;
                }
            }

            return obj;
        }
        catch (error) {
            return null;
        }
    }

    /**
     * Convert a string into a Context object if possible
     * TODO: To implement in next version
     * @returns {string}
     * @param input
     */
    extractContextFromInput(input)
    {
        if (typeof input === "string" || input instanceof String)
        {
            if (input.toLowerCase().indexOf("lid:") !== 0)
            {
                return input;
            }

            const obj = this.stringToObject(input);
            if (obj) {
                input = obj;
            }
        }

        if (typeof input==="object" && !Array.isArray(input) && input!==null) {
            if (this.isExtendedOptionsPassed(input)) {
                if (input.contextName) {
                    const obj = this.#contexts[input.contextName];
                    if (obj) {
                        input = Object.assign({}, obj, input);
                    }
                }
                if (!input.target) {
                    input.target = this.getActiveTarget();
                }
            }
        }

        return input;
    }

    listSymbols()
    {
        for (let key in symbolNames)
        {
            console.rawLog(symbolNames[key] + `   ${key} `);
        }
    }

    applySymbolByName(context)
    {
        try
        {
            if (context.symbol && symbolNames[context.symbol])
            {
                context.symbol = symbolNames[context.symbol];
            }
        }
        catch (e)
        {

        }
    }

    /**
     * Convert the first parameter of a console.log to a Context object
     * @param options
     * @param defaultContext
     * @returns {*|{}}
     */
    convertToContext(options, defaultContext)
    {
        options = options || defaultContext;

        let context = options;

        // Flatten option object. For instance,
        // {something: "some1", something2: "some2", context: {lid: 3000, color: "purple"}}
        // Will become {something: "some1", something2: "some2", lid: 3000, color: "purple"}
        if (options.context && typeof options.context === "object")
        {
            const moreOptions = Object.assign({}, options);
            delete moreOptions.context;
            context = Object.assign({}, options.context, moreOptions);
        }

        context = Object.assign({}, defaultContext, context);
        delete context.context;

        return context;
    }

    /**
     * console.log with options set on the first parameter to dictate console log behaviours
     * @param options
     * @param args
     */
    log(options, ...args)
    {
        options = this.extractContextFromInput(options);

        // If the first parameter is not of context format,
        // We use the default context
        if (!this.isExtendedOptionsPassed(options))
        {
            if (!this.forceLidOn)
            {
                const defaultContext = this.generateDefaultContext();
                this.processOutput.apply(this, [defaultContext, options, ...args]);
                return;
            }

            if (!args || !args.length)
            {
                args = [options];
            }

            const newLid = generateLid(this.options.lidLenMax);
            options = {lid: newLid};
        }

        const someContext = this.generateDefaultContext();
        let context = this.convertToContext(options, someContext);

        if (context.raw)
        {
            ____AnaLogger.Console.log(...args);
            return;
        }

        if (this.resolveLineCall)
        {
            // If this.resolveErrorLineCall, the stack has already been set
            if (!this.resolveErrorLineCall)
            {
                context.stack = getInvocationLine();
            }
        }
        this.processOutput.apply(this, [context, ...args]);
    }

    error(options, ...args)
    {
        if (this.options.hideError)
        {
            return;
        }

        options = this.extractContextFromInput(options);

        // If the first parameter is not of context format,
        // We use the error context and display
        if (!this.isExtendedOptionsPassed(options))
        {
            if (!this.forceLidOn)
            {
                const defaultContext = this.generateErrorContext();
                this.processOutput.apply(this, [defaultContext, options, ...args]);
                return;
            }

            const newLid = generateLid(this.options.lidLenMax);
            options = {lid: newLid};
        }

        const errorContext = this.generateErrorContext();
        let context = this.convertToContext(options, errorContext);

        if (this.resolveErrorLineCall)
        {
            context.stack = getInvocationLine();
        }
        this.log(context, ...args);
    }

    overrideError()
    {
        if (!this.options.hideHookMessage)
        {
            ____AnaLogger.Console.log("AnaLogger: Hook placed on console.error");
        }
        this.#overridenMap.error = true;
        console.error = this.onDisplayError.bind(this);
    }

    attachConsole()
    {
        try
        {
            console.rawLog = ____AnaLogger.Console.log;
            console.raw = ____AnaLogger.Console.log;

            console.rawInfo = ____AnaLogger.Console.info;
            console.rawWarn = ____AnaLogger.Console.warn;
            console.rawError = ____AnaLogger.Console.error;

            console.logHistory = this.logHistory;

            console.logHistory = this.logHistory;
            COMMON_METHODS.forEach((name) =>
            {
                console[name] = function (...args)
                {
                    this[name](...args);
                }.bind(this);
            });

            return true;
        }
        catch (e)
        {
            console.error({lid: 4321}, e.message);
        }

        return false;
    }

    overrideConsole({log = true, info = true, warn = true, error = false} = {})
    {
        if (!this.options.hideHookMessage)
        {
            ____AnaLogger.Console.log("AnaLogger: Hook placed on console.log");
        }

        [{log}, {info}, {warn},].forEach(function (methodObj)
        {
            const methodName = Object.keys(methodObj)[0];
            if (methodObj[methodName])
            {
                this.#overridenMap[methodName] = true;
                console[methodName] = this.onDisplayLog.bind(this);
            }
        }.bind(this));

        if (error)
        {
            this.overrideError();
        }

        this.attachConsole();
    }

    removeOverrideError()
    {
        console.error = ____AnaLogger.Console.error;
        this.#overridenMap.error = false;
    }

    removeOverride({log = true, info = true, warn = true, error = false} = {})
    {
        if (log)
        {
            console.log = ____AnaLogger.Console.log;
            this.#overridenMap.log = false;
        }

        if (info)
        {
            console.info = ____AnaLogger.Console.info;
            this.#overridenMap.info = false;
        }

        if (warn)
        {
            console.warn = ____AnaLogger.Console.warn;
            this.#overridenMap.warn = false;
        }

        if (error)
        {
            this.removeOverrideError();
        }

    }

    info(...args)
    {
        return this.log(...args);
    }

    warn(...args)
    {
        return this.log(...args);
    }

    table(...args)
    {
        if (!this.#overridenMap.log)
        {
            ____AnaLogger.Console.table(...args);
            return;
        }

        const currentLog = console.log;
        console.log = ____AnaLogger.Console.log;
        ____AnaLogger.Console.table(...args);
        console.log = currentLog;
    }

    /**
     * Takes a screenshot of the specified DOM element.
     *
     * @param {Object} context - The context for the screenshot.
     * @param {string} context.selector - The CSS selector of the element to capture.
     * @param {number} context.quality - The quality of the screenshot (0 to 1).
     * @param {number} context.canvasHeight - The height of the canvas.
     * @param {number} context.canvasWidth - The width of the canvas.
     * @param {("Png"|"Jpeg"|"Svg"|"Blob"|"Canvas"|"PixelData")} context.imageType - The type of the image
     * @param {number} context.width Width in pixels to be applied to DOM node before rendering.
     * @param {number} context.height Height in pixels to be applied to the DOM node before rendering.
     * @param {number} context.pixelRatio
     */
    takeScreenshot(context = {selector: "body", quality: 0.95, canvasHeight: 480, canvasWidth: 640}) {
        return new Promise((resolve, reject) => {
            if (!this.isBrowser()) {
                return;
            }

            let errorMessage = "";
            if (!htmlToImage) {
                errorMessage = "MISSING_HTML_IMAGE_LIBRARY: htmlToImage is not defined. Please install it first.";
                ____AnaLogger.Console.error(errorMessage);
                reject(new Error());
                return;
            }

            const {selector, quality, canvasHeight, canvasWidth} = context;

            const $div = document.querySelector(selector);
            const options = {
                quality, canvasHeight, canvasWidth
            }

            htmlToImage
            .toPng($div, options)
            .then(function (context, imageData) {
                this.uploadDataToRemote(imageData, context, (serverResponse) => {
                    resolve({imageData, serverResponse});
                });
            }.bind(this, context))
            .catch(function (error) {
                errorMessage = `IMAGE_PROCESSING_FAILURE: ${error.message}`;
                ____AnaLogger.Console.error(errorMessage);
                reject(new Error(errorMessage));
            });
        });
    }


    alert(...args)
    {
        if (!this.isBrowser())
        {
            return this.log(...args);
        }

        let message;
        if (args && ((args[0] && args[0].hasOwnProperty("lid")) || this.isContextValid(args[0])))
        {
            const someContext = this.generateDefaultContext();
            let context = this.convertToContext(args[0], someContext);

            message = context.lid + ": " + args.slice(1).join(" | ");
        }
        else
        {
            message = args.join(" | ");
        }

        alert(message);
    }

    assert(condition, expected = true, ...args)
    {
        let result;

        try
        {
            if (typeof condition === "function")
            {
                result = condition(...args);
                if (result !== expected)
                {
                    this.error("Asset failed");
                    return false;
                }

                if (!this.options.hidePassingTests)
                {
                    this.log("SUCCESS: Assert passed");
                }
                return true;
            }

            if (condition !== expected)
            {
                this.error("Assert failed");
                return false;
            }

            if (!this.options.hidePassingTests)
            {
                this.log("SUCCESS: Assert passed");
            }
            return true;
        }
        catch (e)
        {
            this.error("Unexpected error in assert");
        }

        return false;
    }

    /**
     * Set default targets, contexts and log levels
     * @returns {boolean}
     */
    #initialiseDefault()
    {
        try
        {
            // Register default targets: ALL and USER
            this.setTargets(DEFAULT_LOG_TARGETS);

            // Register default log levels
            this.setLogLevels(DEFAULT_LOG_LEVELS);

            // Register default context
            this.setContexts(DEFAULT_LOG_CONTEXTS);
        }
        catch (e)
        {
            console.error({lid: 4321}, e.message);
        }

        return false;
    }

    /**
     * Set standard Analogger format
     * @example
     * // Output Example
     * // [14:01:06]    DEFAULT: (1060) ⚡  " ✔ My log ..."
     * @param activeTarget
     * @param override
     * @returns {boolean}
     */
    applyAnalogFormatting({activeTarget = "", override = false} = {})
    {
        try
        {
            const lidLenMax = 6;

            const LOG_CONTEXTS = {
                STANDARD: null,
                TEST    : {color: "#B18904", symbol: "diamonds"},
            };

            this.setDefaultContext(LOG_CONTEXTS.DEFAULT);

            activeTarget && this.setActiveTarget(activeTarget);

            this.setOptions({silent: false, hideError: false, hideHookMessage: true, lidLenMax});
            if (override)
            {
                this.overrideConsole();
                this.overrideError();
            }

            return true;
        }
        catch (e)
        {
            /* istanbul ignore next */
            console.error({lid: 3249}, e.message);
        }

        /* istanbul ignore next */
        return false;
    }

    applyPredefinedFormat(name = PREDEFINED_FORMATS.DEFAULT_FORMAT, {activeTarget = "", override = false} = {})
    {
        if (name === PREDEFINED_FORMATS.DEFAULT_FORMAT)
        {
            return this.applyAnalogFormatting({activeTarget, override});
        }
    }

    static generateInstance()
    {
        return new ____AnaLogger();
    }

    /**
     * Returns an AnaLogger instance
     * @returns {null}
     */
    static getInstance(num = 0)
    {
        if (!____AnaLogger.instanceCount)
        {
            return null;
        }
        return ____AnaLogger.#instances[num];
    }

    /**
     * Returns first existing AnaLogger instance,
     * otherwise create a new instance
     * @returns {*|____AnaLogger}
     */
    static generateMainInstance()
    {
        const mainInstance = ____AnaLogger.getInstance();
        if (!mainInstance)
        {
            return new ____AnaLogger();
        }

        return mainInstance;
    }

    /**
     * Override console.log and console.error
     */
    static startLogger()
    {
        const active = ____AnaLogger.generateMainInstance();
        active.applyPredefinedFormat(PREDEFINED_FORMATS.DEFAULT_FORMAT, {override: true});
    }

    static stopLogger()
    {
        const active = ____AnaLogger.generateMainInstance();
        active.removeOverride();
        active.removeOverrideError();
    }

    convertToUrl({
                     protocol = DEFAULT.protocol,
                     host = DEFAULT.host,
                     port = DEFAULT.port,
                     pathname = DEFAULT.pathname
                 } = {})
    {
        const url = new URL("http://localhost");
        url.protocol = protocol;
        url.host = host;
        url.port = port;
        if (pathname)
        {
            url.pathname = pathname;
        }

        return url.toString();
    }

    generateLogToRemoteUrl(logToRemoteUrl = null, {pathname = DEFAULT.pathname} = {})
    {
        if (typeof logToRemoteUrl === "string" || logToRemoteUrl instanceof String)
        {
            return logToRemoteUrl;
        }

        if (!this.isBrowser())
        {
            return null;
        }

        const protocol = this.options.protocol || window.location.protocol + "//";
        const host = this.options.host || window.location.host || DEFAULT.host;
        const port = this.options.port || DEFAULT.port;
        pathname = this.options.pathname || pathname;

        return this.convertToUrl({protocol, host, port, pathname});
    }

    /**
     * Install a plugin against the active instance
     * @param methodName
     * @param callback
     * @param pluginName
     */
    addPlugin(methodName, callback, pluginName = "")
    {
        pluginName = pluginName || methodName;
        this[methodName] = callback;

        ____AnaLogger.pluginTable[pluginName] = {
            type: PLUGIN_TYPE.LOCAL,
            methodName,
            callback
        };
    }

    /**
     * Install a plugin against the class (an instantiation with new is needed)
     * @param methodName
     * @param callback
     * @param pluginName
     */
    addGlobalPlugin(methodName, callback, pluginName)
    {
        ____AnaLogger[methodName] = callback;

        ____AnaLogger.pluginTable[pluginName] = {
            type: PLUGIN_TYPE.GLOBAL,
            methodName,
            callback
        };

    }

    getPluginList()
    {
        return Object.keys(____AnaLogger.pluginTable);
    }

    /**
     * At the moment, this method behaviour is equivalent to an eventual isPluginRegistered method
     * @param name
     * @returns {boolean}
     */
    validatePlugin(name)
    {
        if (____AnaLogger.pluginTable[name])
        {
            return true;
        }

        console.warn(`The plugin ${name} is not registered`);
        return false;
    }

}

// Export the class as default export
const __AnaLogger = ____AnaLogger;
module.exports = __AnaLogger;

// Export an instance
const ___anaLogger = ____AnaLogger.generateMainInstance();
module.exports.anaLogger = ___anaLogger;

// Export the class as named export
const _AnaLogger = ____AnaLogger;
module.exports.AnaLogger = _AnaLogger;

module.exports.DEFAULT_LOG_LEVELS = DEFAULT_LOG_LEVELS;
module.exports.DEFAULT_LOG_CONTEXTS = DEFAULT_LOG_CONTEXTS;
module.exports.DEFAULT_LOG_TARGETS = DEFAULT_LOG_TARGETS;

