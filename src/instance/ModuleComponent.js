import {assert} from "../utils/assert";
import {HashObject} from "../utils/hashObject";

/**
 * 模块组件实例类
 */
class ModuleComponent extends HashObject {

    constructor(options = {}) {
        super();
        assert(options == void 0, "component options can't null");
        assert(options.instance == void 0, "property instance can't null");

        const {
            model = options.model ? options.model : [],
            script = options.script,
            style = options.style ? options.style : null,
            template = options.template ? options.template : null
        } = options;

        this._model = options.model;
        this._instance = options.instance;
        this._style = options
    }
}

export default {ModuleComponent};