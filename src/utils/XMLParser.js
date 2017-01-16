/**
 * @private
 * XML节点基类
 */
export class XMLNode {

    //节点类型，1：XML，2：XMLAttribute，3：XMLText
    constructor(nodeType, parent) {
        this.nodeType = nodeType;
        this.parent = parent;
    }
}

/**
 * @private
 * XML节点对象
 */
export class XML extends XMLNode {

    constructor(localName, parent, prefix, namespace, name) {
        super(1, parent);
        this.localName = localName;
        this.prefix = prefix;
        this.namespace = namespace;
        this.name = name;
        this.attributes = {};
        this.children = [];
    }
}

/**
 * @private
 * XML文本节点
 */
export class XMLText extends XMLNode {

    constructor(text, parent) {
        super(3, parent);
        this.text = text;
    }
}

let parser = new DOMParser();

/**
 * 将字符串解析为XML对象
 * @param text
 */
export function parse(text) {
    let xmlDoc = parser.parseFromString(text, "text/xml");
    let length = xmlDoc.childNodes.length;

    for (let i = 0; i < length; i++) {
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
export function parseNode(node, parent) {
    if (node.localName == "parsererror") {
        throw new Error(node.textContent);
    }
    let xml = new XML(node.localName, parent, node.prefix, node.namespaceURI, node.nodeName);
    let nodeAttributes = node.attributes;
    let attributes = xml.attributes;
    let length = nodeAttributes.length;
    for (let i = 0; i < length; i++) {
        let attributeNode = nodeAttributes[i];
        let name = attributeNode.name;
        if (name.indexOf("xmlns:") == 0) {
            continue;
        }
        attributes[name] = attributeNode.value;
        xml["$" + name] = attributeNode.value;
    }
    let childNodes = node.childNodes;
    length = childNodes.length;
    let children = xml.children;
    for (let i = 0; i < length; i++) {
        let childNode = childNodes[i];
        let nodeType = childNode.nodeType;
        let childXML = null;
        if (nodeType == 1) {
            childXML = parseNode(childNode, xml);
        }
        else if (nodeType == 3 || nodeType == 4) {
            let text = childNode.textContent.trim();
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