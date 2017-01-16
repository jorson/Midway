import {assert} from "../utils/assert";
import {parse} from "../utils/XMLParser";

import {ModuleRender} from "../render/ModuleRender";

let moduleRender = new ModuleRender();

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
        this._el = options.el;
    }

    start() {
        if(window.$) {
            let container = $(this._el);
            assert(container === undefined, "container is NULL!");

            this._loadModuleFile(this._launcher)
                .done((moduleConfig) => {
                    moduleRender.render(moduleConfig, container);
                });

        }
    }

    //加载模块文件
    _loadModuleFile(moduleName) {
        let fullPath = this._modulePath + "/" + moduleName + ".mc";
        return $.ajax({
            url: fullPath,
            method: "GET"
        }).then(function (data) {
            return parse(data);
        }).fail(function () {
            throw new Error("can't load module component file:" + fullPath);
        });
    }
}

export default {Launcher};