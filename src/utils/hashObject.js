var __define = this.__define || function (o, p, g, s) {
        Object.defineProperty(o, p, {configurable: true, enumerable: true, get: g, set: s})
    };
var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) {
                d[p] = b[p];
            }
        }
        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };

export var $hashCount = 1;

export class HashObject {

    public constructor() {
        this.$hashCode = $hashCount++;
    }

    public get hashCode() {
        return this.$hashCode;
    }
}