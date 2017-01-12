/**
 * 用于转接ICPlayer事件总线的代理类
 */
class EventDispatcherProxy extends HashObject {
    addEventListener(name, type, callback, scope = window) {
    }

    removeEventListener(name, type) {
    }

    hasEventListener(name, type) {
        return false;
    }

    dispatchEvent(name, type, data) {
    }

}