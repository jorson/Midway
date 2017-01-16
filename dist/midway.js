/**
 * Midway v1.0.0
 * (c) 2017 Jorson WHY
 * @license MIT
 */
'use strict';

require('jquery');
require('lodash');

function assert (condition, msg) {
    if (condition) { throw new Error(("[midway] " + msg)) }
}

/**
 * @private
 * XML节点基类
 */
var XMLNode = function XMLNode(nodeType, parent) {
    this.nodeType = nodeType;
    this.parent = parent;
};

/**
 * @private
 * XML节点对象
 */
var XML = (function (XMLNode) {
    function XML(localName, parent, prefix, namespace, name) {
        XMLNode.call(this, 1, parent);
        this.localName = localName;
        this.prefix = prefix;
        this.namespace = namespace;
        this.name = name;
        this.attributes = {};
        this.children = [];
    }

    if ( XMLNode ) XML.__proto__ = XMLNode;
    XML.prototype = Object.create( XMLNode && XMLNode.prototype );
    XML.prototype.constructor = XML;

    return XML;
}(XMLNode));

/**
 * @private
 * XML文本节点
 */
var XMLText = (function (XMLNode) {
    function XMLText(text, parent) {
        XMLNode.call(this, 3, parent);
        this.text = text;
    }

    if ( XMLNode ) XMLText.__proto__ = XMLNode;
    XMLText.prototype = Object.create( XMLNode && XMLNode.prototype );
    XMLText.prototype.constructor = XMLText;

    return XMLText;
}(XMLNode));

var parser = new DOMParser();

/**
 * 将字符串解析为XML对象
 * @param text
 */
function parse(text) {
    var xmlDoc = parser.parseFromString(text, "text/xml");
    var length = xmlDoc.childNodes.length;

    for (var i = 0; i < length; i++) {
        var node = xmlDoc.childNodes[i];
        if (node.nodeType == 1) {
            return parseNode(node, null);
        }
    }
    return null;
}

/**
 * 解析一个节点
 */
function parseNode(node, parent) {
    if (node.localName == "parsererror") {
        throw new Error(node.textContent);
    }
    var xml = new XML(node.localName, parent, node.prefix, node.namespaceURI, node.nodeName);
    var nodeAttributes = node.attributes;
    var attributes = xml.attributes;
    var length = nodeAttributes.length;
    for (var i = 0; i < length; i++) {
        var attributeNode = nodeAttributes[i];
        var name = attributeNode.name;
        if (name.indexOf("xmlns:") == 0) {
            continue;
        }
        attributes[name] = attributeNode.value;
        xml["$" + name] = attributeNode.value;
    }
    var childNodes = node.childNodes;
    length = childNodes.length;
    var children = xml.children;
    for (var i$1 = 0; i$1 < length; i$1++) {
        var childNode = childNodes[i$1];
        var nodeType = childNode.nodeType;
        var childXML = null;
        if (nodeType == 1) {
            childXML = parseNode(childNode, xml);
        }
        else if (nodeType == 3 || nodeType == 4) {
            var text = childNode.textContent.trim();
            if (text) {
                childXML = new XMLText(text, xml);
            }
        }
        if (childXML) {
            children.push(childXML);
        }
    }
    return xml;
}

var _head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

var ScriptRender = {
    /**
     * 添加外部的URL引用
     * @param url 外部URL地址
     */
    addStyle: function (url){
        if ( url === void 0 ) url = undefined;

        assert(url === undefined, "style url is undefined");
        var element = document.createElement('link');
        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('type', 'text/css');
        element.setAttribute('href', url);
        _head.appendChild(element);
        return element;
    },
    /**
     * 添加外部Javascript引用
     * @param url 外部JS地址
     */
    addJavascript: function (url) {
        if ( url === void 0 ) url = undefined;

        assert(url === undefined, "script url is undefined");
        var deferred = $.Deferred();
        var script = document.createElement("script");

        script.async = true;
        script.src = url;
        script.onerror = function (){
            console.error("javascript load failure!, URL=" + url);
            deferred.resolve();
        };
        script.onload = script.onreadystatechange = function (_, isAbort){
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                script = null;
                if (!isAbort) {
                    deferred.resolve();
                } else {
                    deferred.resolve();
                    console.error("load javascript abort!, URL=" + url);
                }
            }
        };

        _head.insertBefore(script, _head.firstChild);
        return deferred.promise();
    },
    addEmbedStyle: function (code) {
        var element = document.createElement("style");
        if (element.styleSheet) {
            element.styleSheet.cssText = code;
        } else {
            element.innerHTML = code;
        }
        _head.appendChild(element);
    },
    addEmbedScript: function (code){
        var element = document.createElement("script");
        element.setAttribute("language", "Javascript");
        element.text = code;
        _head.appendChild(element);
    }
};

var InnerEventBus = function InnerEventBus() {
    this.listeners = [];
};

InnerEventBus.prototype.addEventListener = function addEventListener (name, callback, scope) {
        if ( scope === void 0 ) scope = window;

    var argsLength = 4;
    var args = arguments.length > argsLength ? Array.prototype.slice.call(arguments, argsLength) : [];
    var listeners = this.listeners[name] || (this.listeners[name] = []);
    listeners.push({
        scope: scope,
        callback: callback,
        args: args
    });
};

/**
 * 移除特定事件监听器
 * @param name 监听事件的名称
 * @param callback 回调函数
 * @param scope 回到上下文
 */
InnerEventBus.prototype.removeEventListener = function removeEventListener (name, callback, scope) {
        var this$1 = this;
        if ( scope === void 0 ) scope = window;

    if (typeof this.listeners.name == "undefined") {
        return;
    }

    var newArray = [];
    for (var index = 0, len = this.listeners[name].length; index < len; index++) {
        var listener = this$1.listeners[name][index];
        if (!(listener.scope == scope && listener.callback == callback)) {
            newArray.push(listener);
        }
    }
    this.listeners[name] = newArray;
};

/**
 * 检查是否存在指定的事件监听器
 * @param name 监听器名称
 * @param callback 回调函数
 * @param scope 执行上下文
 * @returns {boolean} 监听器的存在性
 */
InnerEventBus.prototype.hasEventListener = function hasEventListener (name, callback, scope) {
        var this$1 = this;
        if ( scope === void 0 ) scope = window;

    if (typeof this.listeners.name == "undefined") {
        return false;
    }
    for (var index = 0, len = this.listeners[name].length; index < len; index++) {
        var listener = this$1.listeners[name][index];
        if ((scope ? listener.scope == scope : true) && listener.callback == callback) {
            return true;
        }
    }
    return false;
};

/**
 * 分发事件
 * @param name 事件名称
 */
InnerEventBus.prototype.dispatch = function dispatch (name) {
    var args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
    this.$dispatchEvent(name, args);
};

/**
 * 分发事件
 * @param name 事件名称
 * @param data 事件数据
 */
InnerEventBus.prototype.$dispatchEvent = function $dispatchEvent (name, data) {
    if (this.listeners && this.listeners[name]) {
        this.listeners[name].forEach(function (listener){
            callListener(listener, data);
        });
    }
};

//调用监听器方法
function callListener(listener, args) {
    listener.callback.apply(listener.scope || window, args.concat(listener.args));
}

var templateRegExp = /\$\{(.+?)\}/g;
var hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";

var stringUtils = {
    applyTemplate: function (template, attrs) {
        return template.replace(templateRegExp, function ($0, $1) {
            return attrs[$1] || $0;
        })
    },
    createReg: function (array) {
        return (array.length) ? new RegExp('^(' + array.join("|") + ')$') : /^$/;
    },
    uuid: function (len) {
        var uuids = [];
        for (var i = 0; i < len; i++) {
            uuids[i] = hexDigits.substr(Math.floor(Math.random() * 36), 1);
        }
        return uuids.join('');
    }
};

var MidwayComponent = function MidwayComponent(config, parent) {
    this.unqiueId = stringUtils.uuid(8);
    this._events = {};
    this._eventbus = new InnerEventBus();
};

MidwayComponent.prototype.createController = function createController () {
    return {};
};

MidwayComponent.prototype.getController = function getController () {
    return this.controller || (this.controller = this.createController());
};

MidwayComponent.prototype.destroy = function destroy () {
};

MidwayComponent.prototype.fireEvent = function fireEvent (name) {
    InnerEventBus.prototype.dispatch.apply(this._eventbus, arguments);
};

MidwayComponent.prototype.addEventListener = function addEventListener (name) {
    InnerEventBus.prototype.addEventListener(this._eventbus, arguments);
};

var arguments$1 = arguments;
var this$1 = window;
var supportFunction = {
    runSequence: function (fnConfigs, name){
        var $promise = $.Deferred().resolve();
        var runIndex;

        fnConfigs.forEach(function (fnconfig, index) {
            if ($.isFunction(fnconfig.fn)) {
                $promise = $promise.then(function (){
                    try {
                        runIndex = index;
                        var callArgs = fnconfig.args || arguments$1;
                        if (fnconfig.isAppendArgs === true) {
                            callArgs = Array.prototype.slice.call(arguments$1, 0);
                            callArgs = callArgs.concat(fnConfig.args);
                        }
                        return fnConfig.fn.apply(fnConfig.scope || window, callArgs);
                    } catch (e) {
                        return $.Deferred(function (deferred) {
                            deferred.reject(e);
                        });
                    }
                }, function (message) {
                    return message;
                });
            }
        });

        return $promise.fail(function (e) {
            console.error("execute %s, number of %d error", name || "task", ++runIndex, e || "");
        });
    },

    execute: function (instance, injections, args, isCheck){
        //参数整理
        var singleExecuteName = '';
        var result = {};
        if (typeof injections === 'string') {
            singleExecuteName = injections;
            injections = {};
            injections[singleExecuteName] = args || [];
        }
        if (instance) {
            for (var name in injections) {
                var fn = instance[name];
                if ($.isFunction(fn)) {
                    var params = injections[name];
                    var callMethod = ($.isArray(params)) ? 'apply' : 'call';
                    result[name] = Function.prototype[callMethod].call(fn, instance, params);
                } else if (isCheck === true) {
                    logger.error("不存在[" + name + ']方法');
                }
            }
        }
        return (singleExecuteName) ? result[singleExecuteName] : result;
    },

    createDelegate: function (fn, args, isAppendArgs, scope, exceptionHandler){
        return function () {
            //如果创建的时候没有输入参数，使用调用的参数
            var callArgs = args || arguments$1;
            if (isAppendArgs === true) {
                //arguments数组化
                callArgs = Array.prototype.slice.call(arguments$1, 0);
                callArgs = callArgs.concat(args);
            }
            try {
                return fn.apply(scope || window, callArgs);
            } catch (e) {
                if ($.isFunction(exceptionHandler)) {
                    return exceptionHandler(e);
                } else {
                    throw e;
                }
            }
        };
    },

    defer: function (millis, fn, args, appendArgs, scope) {
        var callFn = functionHelper.createDelegate(fn, args, appendArgs, scope);
        if (millis > 0) {
            return window.setTimeout(callFn, millis);
        }
        //直接调用，返回0的timerId
        callFn();
        return 0;
    },

    createPromiseThen: function (deferred, fn, args, isAppendArgs, scope){
        if (!$.isFunction(deferred.reject)) {
            scope = isAppendArgs;
            isAppendArgs = args;
            args = fn;
            fn = deferred;
            deferred = $.Deferred();
        }
        return this$1.createDelegate(fn, args, isAppendArgs, scope, function (e) {
            deferred.reject(e);
            return deferred.promise();
        });
    },
};

var this$1$1 = window;
var requestParams = {
    params: {},
    get: function (){
        return this$1$1.params;
    }
};

var search = location.search;
search = search.substr(1, search.length);
var params = search.split('&');
params.forEach(function (name){
    var p = name.split("=");
    var key = p[0];
    if(key) {
        requestParams.params[key] = decodeURIComponent(p[1]);
    }
});

var lifecycle = {
    run: ["run"],
    show: ["pageShow"],
    destroy: ["destroy"]
};

/**
 * 模块组件实例类
 */
var ModuleComponent = (function (MidwayComponent$$1) {
    function ModuleComponent(options) {
        if ( options === void 0 ) options = {};

        MidwayComponent$$1.call(this);

        assert(options == void 0, "module component options can't NULL");
        var uuid = options.uuid; if ( uuid === void 0 ) uuid = options.uuid ? options.uuid : stringUtils.uuid(6);
        var presenter = options.presenter; if ( presenter === void 0 ) presenter = options.presenter;
        var model = options.model; if ( model === void 0 ) model = options.model;
        var view = options.view; if ( view === void 0 ) view = (options.view instanceof jQuery) ? options.view : undefined;

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

    if ( MidwayComponent$$1 ) ModuleComponent.__proto__ = MidwayComponent$$1;
    ModuleComponent.prototype = Object.create( MidwayComponent$$1 && MidwayComponent$$1.prototype );
    ModuleComponent.prototype.constructor = ModuleComponent;

    ModuleComponent.prototype.runLifecycle = function runLifecycle (name) {
        assert(lifecycle[name] === undefined, "can't found lifecycle");

        var self = this;
        var taskList = [];
        lifecycle[name].forEach(function (lifecycleName){
            taskList.push({
                fn: self._presenter[lifecycleName],
                args: [self._view, self._model],
                scope: self._presenter,
                name: self._uuid + ":" + lifecycleName
            });
        });
        return supportFunction.runSequence(taskList, "run component lifecycle");
    };

    ModuleComponent.prototype.runInterface = function runInterface (name, args) {
        if (this._presenter && this._presenter.__interface) {
            return supportFunction.execute(this._presenter.__interface, name, args);
        }
    };

    ModuleComponent.prototype.destroy = function destroy () {
        if (this._view) {
            this._view.remove();
        }
        this.runLifecycle("destroy");
    };

    return ModuleComponent;
}(MidwayComponent));

var ModuleRender = function ModuleRender() {
    this.createFunctionTemplate = "Addon${type}_create";
    this.scriptTemplate = "//# sourceURL=midway-${type}\r\n${script}";
    this.componentDOMTemplate = "<div class='mc_${presenter}' id='${id}'></div>";
};

/**
 * 解析外部
 * @param moduleXML 解析
 * @param renderTo 渲染的位置
 */
ModuleRender.prototype.render = function render (moduleXML, renderTo) {
        if ( renderTo === void 0 ) renderTo = undefined;

    //获取Module的名称
    assert(moduleXML.attributes["name"] == undefined, "module name can't null");
    var name = moduleXML.attributes["name"];

    //获取脚本部分
    var script = _.find(moduleXML.children, function (item){
        return item.name === "script" && item.children.length == 1;
    });
    assert(script === undefined, "component script can't null");

    var self = this, $model = {}, $view = undefined;
    _.each(moduleXML.children, function (item) {
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
    var createFunction = stringUtils.applyTemplate(this.createFunctionTemplate, {"type": name});
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
};

ModuleRender.prototype._renderComponent = function _renderComponent (config) {
    var deferred = $.Deferred();
    var promise = deferred.resolve();
    var presenter, element;
    var self = this;
    //设置组件的渲染对象
    var container = config.renderTo ? $(config.renderTo) : $(document.body);
    try {
        //创建组件的Presenter对象
        presenter = createPresenter.call(this, config.enterFn);
        return promise
            .then(function (){
                //构建容器状态
                element = $(stringUtils.applyTemplate(self.componentDOMTemplate, {
                    "presenter": config.name,
                    "id": config.uuid
                }));
                element.append(config.view);
                container.append(element);
            })
            .done(function (){
                return new ModuleComponent({
                    uuid: config.uuid,
                    presenter: presenter,
                    model: config.model,
                    view: element
                });
            });
    } catch (e) {

    }
};

ModuleRender.prototype._parseComponentModel = function _parseComponentModel (modelStr) {
    try {
        var model = JSON.parse(modelStr), parseModel = {};
        if ($.isArray(model)) {

            _.each(model, function (item) {

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
};

/**
 * 创建Presenter对象
 */
function createPresenter(fn) {
    assert(window[fn] == undefined, "presenter enter function is NULL;" + fn);

    var presenter = {};
    try {
        var self = this;
        presenter = window[fn].call(window);
        //如果Presenter对象中包含__interface
        var _interfaces = [];
        if (presenter.__interface) {
            //查找所有__interface中的方法
            for (var name in presenter.__interface) {
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

var moduleRender = new ModuleRender();

var Launcher = function Launcher(options) {
    if ( options === void 0 ) options = {};

    assert(options == void 0, "init options can't null");
    assert(options.el === undefined, "init options must contain 'el' property");
    assert(options.launcher === undefined, "init options must contain 'launcher' property");

    var el = options.el; if ( el === void 0 ) el = options.el;
    var launcher = options.launcher; if ( launcher === void 0 ) launcher = options.launcher;
    var modulePath = options.modulePath; if ( modulePath === void 0 ) modulePath = options.modulePath ? options.modulePath : "components";

    this._launcher = options.launcher;
    this._modulePath = modulePath;
    this._el = options.el;
};

Launcher.prototype.start = function start () {
    if(window.$) {
        var container = $(this._el);
        assert(container === undefined, "container is NULL!");

        this._loadModuleFile(this._launcher)
            .done(function (moduleConfig) {
                moduleRender.render(moduleConfig, container);
            });

    }
};

//加载模块文件
Launcher.prototype._loadModuleFile = function _loadModuleFile (moduleName) {
    var fullPath = this._modulePath + "/" + moduleName + ".mc";
    return $.ajax({
        url: fullPath,
        method: "GET"
    }).then(function (data) {
        return parse(data);
    }).fail(function () {
        throw new Error("can't load module component file:" + fullPath);
    });
};

var Launcher$1 = {Launcher: Launcher};

module.exports = Launcher$1;
