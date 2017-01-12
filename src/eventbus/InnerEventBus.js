class InnerEventBus {
    private listeners;

    public constructor() {
        this.listeners = [];
    }

    addEventListener(name, type, callback, scope = window) {
        let argsLength = 4;
        let args = arguments.length > argsLength ? Array.prototype.slice.call(arguments, argsLength) : [];
        let listeners = this.listeners[type] || (this.listeners[type] = []);
        listeners.push({
            scope: scope,
            type: type,
            callback: callback,
            args: args
        });
    }

    removeEventListener(name, type) {

    }

    hasEventListener(name, type) {
        return false;
    }

    dispatchEvent(name, type, data) {
    }
}

export default {InnerEventBus};