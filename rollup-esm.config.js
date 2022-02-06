import {uglify} from "rollup-plugin-uglify";

export default [
    {
        input  : [
            "src/esm/quick-log.mjs",
        ],
        output : [
            {
                file  : "dist/quick-log-esm.min.mjs",
                format: "es"
            },
        ],
        plugins: [
            uglify(),
        ]
    },
];