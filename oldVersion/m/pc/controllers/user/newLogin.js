; !
function(controller) {
    //use strict
    'use strict';
    controller.using(["jquery","tools","bootstrap","cookie","eValidate"]);
    
    controller.modules = {
        init: function() {
            setTimeout(function(){
        	$("[signin=login]").click();
            },10);
            
        }
    };

    controller.call();

} (new this.jSharp.controller());