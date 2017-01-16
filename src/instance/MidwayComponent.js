import {InnerEventBus} from "../eventbus/InnerEventBus";
import {stringUtils} from "../utils/stringUtils";

class MidwayComponent {
    constructor(config, parent) {
        this.unqiueId = stringUtils.uuid(8);
        this._events = {};
        this._eventbus = new InnerEventBus();
    }

    createController() {
        return {};
    }

    getController() {
        return this.controller || (this.controller = this.createController());
    }

    destroy() {
    }

    fireEvent(name) {
        InnerEventBus.prototype.dispatch.apply(this._eventbus, arguments);
    }

    addEventListener(name) {
        InnerEventBus.prototype.addEventListener(this._eventbus, arguments);
    }
}

export {MidwayComponent};