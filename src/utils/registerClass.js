export function registerClass(classDefinition, className, interfaceNames) {
    let prototype = classDefinition.prototype;
    prototype.__class__ = className;
    let types = [className];
    if (interfaceNames) {
        types = types.concat(interfaceNames);
    }
    let superTypes = prototype.__types__;
    if (prototype.__types__) {
        let length = superTypes.length;
        for (let i = 0; i < length; i++) {
            let name = superTypes[i];
            if (types.indexOf(name) == -1) {
                types.push(name);
            }
        }
        prototype.__types__ = types;
    }
}

export function is(instance, typeName) {
    if (!instance || typeof instance != "object") {
        return false;
    }
    let prototype = Object.getPrototypeOf(instance);
    let types = prototype ? prototype.__types__ : null;
    if (!types) {
        return false;
    }
    return (types.indexOf(typeName) !== -1);
}