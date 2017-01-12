import {ScriptRender} from "./ScriptRender";
import {ModuleComponent} from "../instance/ModuleComponent";
import {assert} from "../utils/assert";

class ModuleRender {

    constructor() {
        this.scriptRender = new ScriptRender();
    }

    /**
     * 解析外部
     * @param moduleXML
     */
    render(moduleXML) {
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
                self.scriptRender.addEmbedStyle(item.children[0].text);
            } else if(item.name === "model") {
                //模型

            }
        });

        //将脚本加入页面中
        this.scriptRender.addEmbedScript(script.children[0].text);

        let component = new ModuleComponent({

        });
    }

    _parseComponentModel(modelStr) {
        try {
            var model = JSON.parse(modelStr), parseModel = {};
            if($.isArray(model)) {
                _.each(model, (item) => {
                    switch ()
                });
            }
            return parseModel;
        } catch (e) {
            assert(true, "can't parse model as JSON object!");
        }
    }
}

export default {ModuleRender};