import {ScriptRender} from "./ScriptRender";
import {ModuleComponent} from "../instance/ModuleComponent";
import {assert} from "../utils/assert";
import {stringUtils} from "../utils/stringUtils";

import * as $ from "jquery";
import * as _ from "lodash";

class ModuleRender {

    constructor() {
        this.createFunctionTemplate = "Addon${type}_create";
        this.scriptTemplate = "//# sourceURL=midway-${type}\r\n${script}";
    }

    /**
     * 解析外部
     * @param moduleXML
     */
    render(moduleXML) {
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
            if(item.children.length != 1) {
                return true;
            }
            if(item.name === "template") {
                //模板
                $view = $(item.children[0].text);
            } else if(item.name === "style") {
                //样式
                ScriptRender.addEmbedStyle(item.children[0].text);
            } else if(item.name === "model") {
                //模型
                $model = self._parseComponentModel(item.children[0].text);
            }
        });

        //将脚本加入页面中
        let createFunction = stringUtils.applyTemplate(this.createFunctionTemplate, {"type": name});
        ScriptRender.addEmbedScript(stringUtils.applyTemplate(this.scriptTemplate, {"type": createFunction, "script": script.children[0].text}));
    }

    _parseComponentModel(modelStr) {
        try {
            var model = JSON.parse(modelStr), parseModel = {};
            if($.isArray(model)) {

                _.each(model, (item) => {

                    if(item.name == undefined || item.name == ""
                        || item.value == undefined || item.value == "") {
                        return true;
                    }

                    if(parseModel[item.name]) {
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

export default {ModuleRender};