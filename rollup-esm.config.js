import {nodeResolve} from "@rollup/plugin-node-resolve";
import {uglify} from "rollup-plugin-uglify";
import copy from "rollup-plugin-copy";

export default [
    {
        input  : [
            "src/esm/ana-logger.mjs",
        ],
        output : [
            {
                file  : "dist/index-esm.min.mjs",
                format: "es"
            },
        ],
        plugins: [
            copy({
                targets: [
                    {src         : "example/*.css",
                        dest     : "dist/",
                        transform: (contents) =>
                            contents.toString().replace(/\/\*#\s*sourceMappingURL.*\*\//g, "")
                    },
                ]
            }),
            nodeResolve(),
            uglify(),
        ]
    },
];