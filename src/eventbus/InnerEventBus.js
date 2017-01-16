class InnerEventBus {

    constructor() {
        this.listeners = [];
    }

    addEventListener(name, callback, scope = window) {
        let argsLength = 4;
        let args = arguments.length > argsLength ? Array.prototype.slice.call(arguments, argsLength) : [];
        let listeners = this.listeners[name] || (this.listeners[name] = []);
        listeners.push({
            scope: scope,
            callback: callback,
            args: args
        });
    }

    /**
     * 移除特定事件监听器
     * @param name 监听事件的名称
     * @param callback 回调函数
     * @param scope 回到上下文
     */
    removeEventListener(name, callback, scope = window) {
        if (typeof this.listeners.name == "undefined") {
            return;
        }

        let newArray = [];
        for (let index = 0, len = this.listeners[name].length; index < len; index++) {
            let listener = this.listeners[name][index];
            if (!(listener.scope == scope && listener.callback == callback)) {
                newArray.push(listener);
            }
        }
        this.listeners[name] = newArray;
    }

    /**
     * 检查是否存在指定的事件监听器
     * @param name 监听器名称
     * @param callback 回调函数
     * @param scope 执行上下文
     * @returns {boolean} 监听器的存在性
     */
    hasEventListener(name, callback, scope = window) {
        if (typeof this.listeners.name == "undefined") {
            return false;
        }
        for (let index = 0, len = this.listeners[name].length; index < len; index++) {
            let listener = this.listeners[name][index];
            if ((scope ? listener.scope == scope : true) && listener.callback == callback) {
                return true;
            }
        }
        return false;
    }

    /**
     * 分发事件
     * @param name 事件名称
     */
    dispatch(name) {
        let args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
        this.$dispatchEvent(name, args);
    }

    /**
     * 分发事件
     * @param name 事件名称
     * @param data 事件数据
     */
    $dispatchEvent(name, data) {
        if (this.listeners && this.listeners[name]) {
            this.listeners[name].forEach((listener)=> {
                callListener(listener, data);
            });
        }
    }
}

//调用监听器方法
function callListener(listener, args) {
    listener.callback.apply(listener.scope || window, args.concat(listener.args));
}

export {InnerEventBus};