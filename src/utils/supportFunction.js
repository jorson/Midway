export function runSequence(fnConfigs, name) {
    let $promise = $.Deferred().resolve();
    let runIndex;

    fnConfigs.forEach((fnconfig, index) => {
        if($.isFunction(fnconfig.fn)) {
            $promise = $promise.then(()=> {
                try {
                    runIndex = index;
                    let callArgs = fnconfig.args || arguments;
                    if(fnconfig.isAppendArgs === true) {
                        callArgs = Array.prototype.slice.call(arguments, 0);
                        callArgs = callArgs.concat(fnConfig.args);
                    }
                    return fnConfig.fn.apply(fnConfig.scope || window, callArgs);
                 } catch (e) {
                    return $.Deferred((deferred) => {
                        deferred.reject(e);
                    });
                }
            }, (message) => {
                return message;
            });
        }
    });

    return $promise.fail((e) => {
        console.error("execute %s, number of %d error", name || "task", ++runIndex, e || "");
    });
}