<?xml version='1.0' encoding='UTF-8' ?>
<module>
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
                window.AddonAnswerFlowController_create = function () {
                    return new Presenter();
                }
            })();
        ]]>
    </script>
    <style></style>
</module>