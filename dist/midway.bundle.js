/**
 * Midway v1.0.0
 * (c) 2017 Jorson WHY
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Midway = factory());
}(this, (function () { 'use strict';

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
        this.attribute = {};
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
};

Launcher.prototype.init = function init () {
    this._loadModuleFile(this._launcher);
};

Launcher.prototype._loadModuleFile = function _loadModuleFile (moduleName) {
    var fullPath = this._modulePath + "/" + moduleName + ".mc";
    $.ajax({
        url: fullPath,
        method: "GET"
    }).then(function (data) {
        var xmlContent = parse(data);
        console.log(xmlContent);
    }).fail(function () {
        throw new Error("can't load module component file:" + fullPath);
    });
};

var Launcher$1 = {Launcher: Launcher};

return Launcher$1;

})));
