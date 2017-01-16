<?xml version='1.0' encoding='UTF-8' ?>
<module name="DemoModule">
    <model>
        <![CDATA[
            [
                {
                    "name": "question_id",
                    "displayName": "题目ID",
                    "type": "string",
                    "value": "question_id",
                    "isLocalized": false
                }
            ]
        ]]>
    </model>
    <template>
        <![CDATA[
            <div><h1>Hello Component</h1><button>Click Me</button></div>
        ]]>
    </template>
    <script>
        <![CDATA[
            (function() {
                var Presenter = function() {
                }
                Presenter.prototype.sayHello = function() {
                    console.log("Hello Component");
                }
                Presenter.prototype.setPlayerController = function(controller) {
                    console.log("From Component", controller);
                }
                Presenter.prototype.setUrlParams = function(params) {
                    console.log("From Component", params);
                }
                window.AddonDemoModule_create = function () {
                    return new Presenter();
                }
            })();
        ]]>
    </script>
    <style></style>
</module>