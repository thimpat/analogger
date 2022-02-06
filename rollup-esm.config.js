import {uglify} from "rollup-plugin-uglify";

export default [
    {
        input  : [
            "src/esm/ana-logger.mjs",
        ],
        output : [
            {
                file  : "dist/ana-logger-esm.min.mjs",
                format: "es"
            },
        ],
        plugins: [
            uglify(),
        ]
    },
];