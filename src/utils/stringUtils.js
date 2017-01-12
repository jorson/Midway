let templateRegExp = /\$\{(.+?)\}/g;
let hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";

export var stringUtils = {
    applyTemplate: function (template, attrs) {
        return template.replace(templateRegExp, ($0, $1) => {
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
}