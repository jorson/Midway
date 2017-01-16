import {assert} from "../utils/assert";
import {MidwayComponent} from "./MidwayComponent";
import {stringUtils} from "../utils/stringUtils";
import {supportFunction} from "../utils/supportFunction";

import * as $ from "jquery";
import * as _ from "lodash";
import {requestParams} from "../utils/Request";

let presenterInterface = {
    "controller": /^(processBeforeRun|processAfterRun)$/
};

let lifecycle = {
    run: ["run"],
    show: ["pageShow"],
    destroy: ["destroy"]
};

/**
 * 模块组件实例类
 */
class ModuleComponent extends MidwayComponent {

    constructor(options = {}) {
        super();

        assert(options == void 0, "module component options can't NULL");
        const {
            uuid = options.uuid ? options.uuid : stringUtils.uuid(6),
            presenter = options.presenter,
            model = options.model,
            view = (options.view instanceof jQuery) ? options.view : undefined
        } = options;

        this._uuid = options.uuid;
        this._model = options.model;
        this._presenter = options.presenter;
        this._view = options.view;
        //执行初始的生命周期
        supportFunction.execute(this._presenter, {
            "setPlayerController": this.getController(),
            "setUrlParams": requestParams.get()
            //"setBasePath": baseUrl
        });
    }

    runLifecycle(name) {
        assert(lifecycle[name] === undefined, "can't found lifecycle");

        let self = this;
        let taskList = [];
        lifecycle[name].forEach((lifecycleName)=> {
            taskList.push({
                fn: self._presenter[lifecycleName],
                args: [self._view, self._model],
                scope: self._presenter,
                name: self._uuid + ":" + lifecycleName
            })
        });
        return supportFunction.runSequence(taskList, "run component lifecycle");
    }

    runInterface(name, args) {
        if (this._presenter && this._presenter.__interface) {
            return supportFunction.execute(this._presenter.__interface, name, args);
        }
    }

    destroy() {
        if (this._view) {
            this._view.remove();
        }
        this.runLifecycle("destroy");
    }
}

export {ModuleComponent};