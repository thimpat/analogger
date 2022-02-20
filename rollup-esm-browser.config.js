import {nodeResolve} from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
// import {uglify} from "rollup-plugin-uglify";

export default [
    {
        input  : [
            "generated/browser/src/cjs/ana-logger.mjs",
        ],
        output : [
            {
                file  : "dist/analogger-esm-browser.min.mjs",
                format: "es"
            },
        ],
        plugins: [
            copy({
                targets: [
                    {
                        src      : "example/*.css",
                        dest     : "dist/",
                        transform: (contents) =>
                            contents.toString().replace(/\/\*#\s*sourceMappingURL.*\*\//g, "")
                    },
                ]
            }),
            // nodeResolve(),
            // uglify(),
        ]
    },
];