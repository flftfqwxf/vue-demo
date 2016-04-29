;!function(controller) {
	//use strict
	'use strict';

	controller.modules={

			init : function(){				
				//初始化百度地图				
                this.map();	
                this.wx();
                this.side();     	 
                  
		    },

		    map:function(){
			    // 百度地图API功能
				var map = new BMap.Map("map");
				var point = new BMap.Point(104.072227,30.663456);
				map.centerAndZoom(point,12);
			    map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
			    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
			    map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
			    map.addControl(new BMap.OverviewMapControl()); //添加默认缩略地图控件				   
				// 创建地址解析器实例
				var myGeo = new BMap.Geocoder();
				var side=document.getElementById("J_side").innerHTML;
				// 将地址解析结果显示在地图上,并调整地图视野
				myGeo.getPoint(side, function(point){
					if (point) {
						map.centerAndZoom(point, 16);
						map.addOverlay(new BMap.Marker(point));
					}else{	
					    //判断用户输入的地址是否有效					
						$("#map").css("display","none");
						// alert("抱歉，您的地址地图没有解析到结果!");
					}
				}, "成都");
		    },
            // 微信显示影藏
		    wx:function(){
               $(".bannar_artic p a").hover(function(){
               	   $(this).find("img").toggle();
               })
		    },
		    //判断用户是否录入地址，若没有录入则隐藏该模块
		    side:function(){
		    	if($("#J_side").text()=="" || $("#J_side").text()==null){		    		
                   $(".contact_map").css("display","none");
		    	}
		    }		    
	};
	
	controller.call();

}(new this.jSharp.controller());		