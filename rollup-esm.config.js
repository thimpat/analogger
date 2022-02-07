import { nodeResolve } from '@rollup/plugin-node-resolve';
import {uglify} from "rollup-plugin-uglify";

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
            nodeResolve(),
            uglify(),
        ]
    },
];