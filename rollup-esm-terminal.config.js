import {nodeResolve} from "@rollup/plugin-node-resolve";
import {uglify} from "rollup-plugin-uglify";

export default [
    {
        input  : [
            "generated/terminal/src/cjs/ana-logger.mjs",
        ],
        output : [
            {
                file  : "dist/analogger-esm-terminal.min.mjs",
                format: "es"
            },
        ],
        plugins: [
            nodeResolve(),
            uglify(),
        ]
    },
];