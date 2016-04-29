;!function(controller) {
	//use strict
	'use strict';
	controller.using("jquery");
	controller.using("eValidate");
	

	controller.modules={
		init : function(){

			this.event();

			this.successReg();


		},
		successReg:function(){
			var _this = this;
			$("#form-info").eValidate({
				submit:function(){
					
				}

			});
		},
		event:function(){
			var _this = this;
		}
	};
	
	controller.call();

}(new this.jSharp.controller());