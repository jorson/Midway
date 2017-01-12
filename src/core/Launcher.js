import {assert} from "../utils/assert";
import {parse} from "../utils/XMLParser";

import ScriptRender from "../render/ScriptRender";

class Launcher{

    constructor(options = {}) {
        assert(options == void 0, "init options can't null");
        assert(options.el === undefined, "init options must contain 'el' property");
        assert(options.launcher === undefined, "init options must contain 'launcher' property");

        const {
            el = options.el,
            launcher = options.launcher,
            modulePath = options.modulePath ? options.modulePath : "components"
        } = options;

        this._launcher = options.launcher;
        this._modulePath = modulePath;
    }

    start() {
        if(window.$) {
            let container = $(el);
            assert(container === undefined, "container is NULL!");
            this._container = container;
        }
        this._loadModuleFile(this._launcher);
    }

    //加载模块文件
    _loadModuleFile(moduleName) {
        let fullPath = this._modulePath + "/" + moduleName + ".mc";
        $.ajax({
            url: fullPath,
            method: "GET"
        }).then(function (data) {
            let xmlContent = parse(data);
            console.log(xmlContent);
        }).fail(function () {
            throw new Error("can't load module component file:" + fullPath);
        });
    }
}

export default {Launcher};