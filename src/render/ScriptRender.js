import {assert} from "../utils/assert";

class ScriptRender {

    constructor() {
        this._head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    }

    /**
     * 添加外部的URL引用
     * @param url 外部URL地址
     */
    addStyle(url = undefined) {
        assert(url === undefined, "style url is undefined");
        let element = document.createElement('link');
        element.setAttribute('rel', 'stylesheet');
        element.setAttribute('type', 'text/css');
        element.setAttribute('href', url);
        head.appendChild(element);
        return element;
    }

    /**
     * 添加外部Javascript引用
     * @param url 外部JS地址
     */
    addJavascript(url = undefined) {
        assert(url === undefined, "script url is undefined");
        let deferred = $.Deferred();
        let script = document.createElement("script");

        script.async = true;
        script.src = url;
        script.onerror = ()=> {
            console.error("javascript load failure!, URL=" + url);
            deferred.resolve();
        };
        script.onload = script.onreadystatechange = (_, isAbort)=> {
            if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                script = null;
                if(!isAbort) {
                    deferred.resolve();
                } else {
                    deferred.resolve();
                    console.error("load javascript abort!, URL=" + url);
                }
            }
        };

        this._head.insertBefore(script, this._head.firstChild);
        return deferred.promise();
    }

    addEmbedStyle(code) {
        var element = document.createElement("style");
        if (element.styleSheet) {
            element.styleSheet.cssText = code;
        } else {
            element.innerHTML = code;
        }
        this._head.appendChild(element);
    }

    addEmbedScript(code) {
        let element = document.createElement("script");
        element.setAttribute("language", "Javascript");
        element.text(code);
        this._head.appendChild(element);
    }
}

export default {ScriptRender};