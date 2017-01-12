const buble = require("rollup-plugin-buble");
const replace = require("rollup-plugin-replace");
const version = "1.0.0";
var path = require("path");

module.exports = {

    entry: path.join(__dirname, "src/core/Launcher.js"),
    dest: path.join(__dirname, "dist/midway.bundle.js"),
    format: "umd",
    moduleName: "Midway",
    plugins: [
        replace({__VERSION__: version}),
        buble()
    ],
    banner:
        `/**
 * Midway v${version}
 * (c) ${new Date().getFullYear()} Jorson WHY
 * @license MIT
 */`
};