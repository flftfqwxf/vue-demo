(function($,w){
	var sight_item_tmpl = '<tr pname="sights" index="{index}"><td><input type="hidden" name="index" value="{index}"/><input type="hidden" name="sight.id" value={id}><input type="hidden" name="sightName" value="{sightName}"/><span class="left_icon">{index}</span></td><td width="414px">&nbsp;&nbsp;{sightName}</td><td width="60px"><select name="visitWay"><option value="内观">内观</option><option value="外观">外观</option></select></td><td class="relativetd"><input name="playTime" value="{playTime}" class="validate[custom[integer],max[20]]" style="height:24px;width:26px;">小时<span class="del_sights_item">X</span></td></tr>';
	w.Product = w.Product || {};
	w.Product.sight = function(ctx){
		this.ctx = ctx;
		var $table = $("table.sights",ctx);
		this.addItem = function(data){
			var tpl = sight_item_tmpl;
			var index = getItemLength() + 1;
			if(data){
				data["index"] = index;
			}else{
				data = {"index":index};
			}
			var $new = $(Product.utils.tmpl(tpl,data));
			if(data.visitWay == "外观")
				$new.find("option[value='外观']").attr("selected",true);
			$table.show().append($new);
		}
		function updateIndex(){
			$table.find("tr").each(function(i){
				$(this).attr("index",i+1).find(".left_icon").text(i+1)
			})
		}
		function getItemLength(){
			return $table.find("tr").length;
		}
		var thiz = this;
		function _addItem(){
			if(!$(this).validationEngine('validate')){
				thiz.addItem({sightName:this.value});
				this.value = "";
			}
			return false;
		}
		$(ctx).on("click",".del_sights_item",function(){
			$(this).closest("tr").remove();
			updateIndex();
		}).on("keydown",".sight_add",function(e){
			if(e.keyCode == 13){
				return _addItem.call(this)
			}
		}).on("create",".sight_add",function(){
			return _addItem.call(this)
		}).on("blur",".sight_add",function(){
			var thiz = this;
			setTimeout(function(){
				thiz.value="";
			},300);
		})
	}
})(jQuery,window)
