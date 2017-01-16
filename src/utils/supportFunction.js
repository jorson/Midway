export var supportFunction = {
    runSequence: (fnConfigs, name)=> {
        let $promise = $.Deferred().resolve();
        let runIndex;

        fnConfigs.forEach((fnconfig, index) => {
            if ($.isFunction(fnconfig.fn)) {
                $promise = $promise.then(()=> {
                    try {
                        runIndex = index;
                        let callArgs = fnconfig.args || arguments;
                        if (fnconfig.isAppendArgs === true) {
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
    },

    execute: (instance, injections, args, isCheck)=> {
        //参数整理
        let singleExecuteName = '';
        let result = {};
        if (typeof injections === 'string') {
            singleExecuteName = injections;
            injections = {};
            injections[singleExecuteName] = args || [];
        }
        if (instance) {
            for (let name in injections) {
                let fn = instance[name];
                if ($.isFunction(fn)) {
                    let params = injections[name];
                    let callMethod = ($.isArray(params)) ? 'apply' : 'call';
                    result[name] = Function.prototype[callMethod].call(fn, instance, params);
                } else if (isCheck === true) {
                    logger.error("不存在[" + name + ']方法');
                }
            }
        }
        return (singleExecuteName) ? result[singleExecuteName] : result;
    },

    createDelegate: (fn, args, isAppendArgs, scope, exceptionHandler)=> {
        return () => {
            //如果创建的时候没有输入参数，使用调用的参数
            let callArgs = args || arguments;
            if (isAppendArgs === true) {
                //arguments数组化
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }
            try {
                return fn.apply(scope || window, callArgs);
            } catch (e) {
                if ($.isFunction(exceptionHandler)) {
                    return exceptionHandler(e);
                } else {
                    throw e;
                }
            }
        };
    },

    defer: (millis, fn, args, appendArgs, scope) => {
        let callFn = functionHelper.createDelegate(fn, args, appendArgs, scope);
        if (millis > 0) {
            return window.setTimeout(callFn, millis);
        }
        //直接调用，返回0的timerId
        callFn();
        return 0;
    },

    createPromiseThen: (deferred, fn, args, isAppendArgs, scope)=> {
        if (!$.isFunction(deferred.reject)) {
            scope = isAppendArgs;
            isAppendArgs = args;
            args = fn;
            fn = deferred;
            deferred = $.Deferred();
        }
        return this.createDelegate(fn, args, isAppendArgs, scope, function (e) {
            deferred.reject(e);
            return deferred.promise();
        });
    },
};