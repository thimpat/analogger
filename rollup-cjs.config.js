import del from "rollup-plugin-delete";
import commonjs from "@rollup/plugin-commonjs";
import {uglify} from "rollup-plugin-uglify";

export default [
    {
        input  : [
            "src/cjs/ana-logger.cjs",
        ],
        output : [
            {
                file  : "dist/ana-logger-cjs.min.cjs",
                format: "cjs"
            },
        ],
        plugins: [
            del({
                targets: ["dist/*"]
            }),
            commonjs({
                ignoreDynamicRequires: true,
            }),
            uglify(),
        ]
    },
];