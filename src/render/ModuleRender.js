import {ScriptRender} from "./ScriptRender";
import {ModuleComponent} from "../instance/ModuleComponent";
import {assert} from "../utils/assert";
import {stringUtils} from "../utils/stringUtils";
import {supportFunction} from "../utils/supportFunction";
import {requestParams} from "../utils/Request"

class ModuleRender {

    constructor() {
        this.createFunctionTemplate = "Addon${type}_create";
        this.scriptTemplate = "//# sourceURL=midway-${type}\r\n${script}";
        this.componentDOMTemplate = "<div class='mc_${presenter}' id='${id}'></div>";
    }

    /**
     * 解析外部
     * @param moduleXML 解析
     * @param renderTo 渲染的位置
     */
    render(moduleXML, renderTo = undefined) {
        //获取Module的名称
        assert(moduleXML.attributes["name"] == undefined, "module name can't null");
        let name = moduleXML.attributes["name"];

        //获取脚本部分
        let script = _.find(moduleXML.children, (item)=> {
            return item.name === "script" && item.children.length == 1;
        });
        assert(script === undefined, "component script can't null");

        let self = this, $model = {}, $view = undefined;
        _.each(moduleXML.children, (item) => {
            if (item.children.length != 1) {
                return true;
            }
            if (item.name === "template") {
                //模板
                $view = $(item.children[0].text);
            } else if (item.name === "style") {
                //样式
                ScriptRender.addEmbedStyle(item.children[0].text);
            } else if (item.name === "model") {
                //模型
                $model = self._parseComponentModel(item.children[0].text);
            }
        });

        //将脚本加入页面中
        let createFunction = stringUtils.applyTemplate(this.createFunctionTemplate, {"type": name});
        ScriptRender.addEmbedScript(stringUtils.applyTemplate(this.scriptTemplate, {
            "type": createFunction,
            "script": script.children[0].text
        }));
        //构建Component
        var mc = this._renderComponent({
            id: stringUtils.uuid(6),
            name: name,
            enterFn: createFunction,
            model: $model,
            view: $view,
            renderTo: renderTo
        });
    }

    _renderComponent(config) {
        let deferred = $.Deferred();
        let promise = deferred.resolve();
        let presenter, element;
        let self = this;
        //设置组件的渲染对象
        let container = config.renderTo ? $(config.renderTo) : $(document.body);
        try {
            //创建组件的Presenter对象
            presenter = createPresenter.call(this, config.enterFn);
            return promise
                .then(()=> {
                    //构建容器状态
                    element = $(stringUtils.applyTemplate(self.componentDOMTemplate, {
                        "presenter": config.name,
                        "id": config.uuid
                    }));
                    element.append(config.view);
                    container.append(element);
                })
                .done(()=> {
                    return new ModuleComponent({
                        uuid: config.uuid,
                        presenter: presenter,
                        model: config.model,
                        view: element
                    });
                });
        } catch (e) {

        }
    }

    _parseComponentModel(modelStr) {
        try {
            var model = JSON.parse(modelStr), parseModel = {};
            if ($.isArray(model)) {

                _.each(model, (item) => {

                    if (item.name == undefined || item.name == ""
                        || item.value == undefined || item.value == "") {
                        return true;
                    }

                    if (parseModel[item.name]) {
                        return true;
                    }

                    switch (item.type) {
                        case "string":
                            parseModel[item.name] = item.value;
                            break;
                        case "json":
                            try {
                                parseModel[item.name] = JSON.parse(item.value);
                            } catch (e) {
                                assert(true, "can't parse string to json object!");
                            }
                            break;
                        case "boolean":
                            parseModel[item.name] = item.value.toLower() === "true";
                            break;
                        case "integer":
                            parseModel[item.name] = parseInt(item.value);
                            break;
                    }
                });
            }
            return parseModel;
        } catch (e) {
            assert(true, "can't parse model as JSON object!");
        }
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
    } catch (e) {
        console.error("create presenter [" + fn + "] error!");
    }

    return presenter;
}


export {ModuleRender};