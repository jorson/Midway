import {InnerEventBus} from "../eventbus/InnerEventBus";
import {stringUtils} from "../utils/stringUtils";

class MidwayComponent {
    constructor(config, parent) {
        this.id = stringUtils.uuid(8);
        this._events = {};
        this._eventbus = new InnerEventBus();
    }
}