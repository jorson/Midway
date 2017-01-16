const buble = require("rollup-plugin-buble");
const replace = require("rollup-plugin-replace");
const version = "1.0.0";
var path = require("path");

module.exports = {

    entry: path.join(__dirname, "src/core/Launcher.js"),
    targets:[
        {dest: path.join(__dirname, "dist/midway.js"), format: "cjs"},
        {dest: path.join(__dirname, "dist/midway.es.js"), format: "es"},
        {dest: path.join(__dirname, "dist/midway.umd.js"), format: "umd"}
    ],
    format: "umd",
    moduleName: "Midway",
    external: ['jquery', 'lodash'],
    plugins: [
        replace({__VERSION__: version}),
        buble()
    ],
    context: 'window',
    banner:
        `/**
 * Midway v${version}
 * (c) ${new Date().getFullYear()} Jorson WHY
 * @license MIT
 */`
};