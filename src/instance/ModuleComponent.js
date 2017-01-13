import {assert} from "../utils/assert";
import {MidwayComponent} from "./MidwayComponent";
import {stringUtils} from "../utils/stringUtils";
import {supportFunction} from "../utils/supportFunction";

import * as $ from "jquery";
import * as _ from "lodash";

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
            uuid = options.uuid ? options.uuid : stringUtils.uuid(6)
            presenter = options.presenter,
            model = options.model,
            view = $.isPlainObject() options.view
        } = options;

        this._enterFn = options.enterFn;
        this._model = options.model;
    }

    runLifecycle(name) {
        assert(lifecycle[name] === undefined, "can't found lifecycle");

        let self = this;
        let taskList = [];
        lifecycle[name].forEach((lifecycleName)=> {
            taskList.push({
            })
        });
    }

    runInterface(name, args) {

    }
}

/**
 * 创建Presenter对象
 */
function createPresenter(fn) {
    assert(window[fn] == undefined, "presenter enter function is NULL;" + fn);

    let presenter = {};
    try {
        var self = this;
        presenter = window[fn].call(window);
        //如果Presenter对象中包含__interface
        let _interfaces = [];
        if (presenter.__interface) {
            //查找所有__interface中的方法
            for (let name in presenter.__interface) {
                for (var key in presenterInterface) {
                    if (presenterInterface[key].test(name)) {
                        _interfaces.push(key);
                    }
                }
            }
        }
        this._interface = stringUtils.createReg(_interfaces);

        supportFunction.execute(presenter, {
            "setPlayerController": self.getController(),
            "setUrlParams": request.get(),
            "setBasePath": baseUrl
        })
    } catch (e) {
        console.error("create presenter [" + fn + "] error!");
    }

    return presenter;
}


export default {ModuleComponent};