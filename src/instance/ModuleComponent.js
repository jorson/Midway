import {assert} from "../utils/assert";
import {MidwayComponent} from "./MidwayComponent";
import {stringUtils} from "../utils/stringUtils";
import {supportFunction} from "../utils/supportFunction";

let presenterInterface = {
    "controller": /^(processBeforeRun|processAfterRun)$/
};

/**
 * 模块组件实例类
 */
class ModuleComponent extends MidwayComponent {

    constructor() {
        super();
    }


}

/**
 * 创建Presenter对象
 */
function createPresenter(fn) {
    let presenter = {};
    try {
        var self = this;
        presenter = window[fn].call(window);
        //如果Presenter对象中包含__interface
        let _interfaces = [];
        if(presenter.__interface) {
            //查找所有__interface中的方法
            for(let name in presenter.__interface) {
                for(var key in presenterInterface) {
                    if(presenterInterface[key].test(name)) {
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