//出境游目的地
var abroad_areas=[{"areaName":"热门","areaId":null,"areaItem":[{"cityName":"泰国","cityPinyin":"TaiGuo","cityJianpin":""},{"cityName":"法国","cityPinyin":"FaGuo","cityJianpin":""},{"cityName":"美国","cityPinyin":"MeiGuo","cityJianpin":""},{"cityName":"日本","cityPinyin":"RiBen","cityJianpin":""},{"cityName":"韩国","cityPinyin":"HanGuo","cityJianpin":""},{"cityName":"瑞士","cityPinyin":"RuiShi","cityJianpin":""},{"cityName":"香港","cityPinyin":"XiangGang","cityJianpin":""},{"cityName":"马来西亚","cityPinyin":"MaLaiXiYa","cityJianpin":""},{"cityName":"台湾","cityPinyin":"TaiWan","cityJianpin":""},{"cityName":"东京","cityPinyin":"DongJing","cityJianpin":""},{"cityName":"巴黎","cityPinyin":"BaLi","cityJianpin":""},{"cityName":"洛杉矶","cityPinyin":"LuoShanJi","cityJianpin":""},{"cityName":"马尔代夫","cityPinyin":"MaErDaiFu","cityJianpin":""},{"cityName":"澳大利亚","cityPinyin":"AoDaLiYa","cityJianpin":""},{"cityName":"普吉岛","cityPinyin":"PuJiDao","cityJianpin":""},{"cityName":"大阪","cityPinyin":"DaBan","cityJianpin":""},{"cityName":"罗马","cityPinyin":"LuoMa","cityJianpin":""},{"cityName":"威尼斯","cityPinyin":"WeiNiSi","cityJianpin":""},{"cityName":"法兰克福","cityPinyin":"FaLanKeFu","cityJianpin":""},{"cityName":"首尔","cityPinyin":"ShouEr","cityJianpin":""},{"cityName":"苏梅岛","cityPinyin":"SuMeiDao","cityJianpin":""},{"cityName":"迪拜","cityPinyin":"DiBai","cityJianpin":""},{"cityName":"毛里求斯","cityPinyin":"MaoLiQiuSi","cityJianpin":""}]},{"areaName":"港澳台","areaItem":[{"cityName":"香港","cityPinyin":"XiangGang","cityJianpin":""},{"cityName":"澳门","cityPinyin":"AoMen","cityJianpin":""},{"cityName":"台湾","cityPinyin":"TaiWan","cityJianpin":""}]},{"areaName":"东亚南亚","areaItem":[{"cityName":"泰国","cityPinyin":"TaiGuo","cityJianpin":""},{"cityName":"马来西亚","cityPinyin":"MaLaiXiYa","cityJianpin":""},{"cityName":"新加坡","cityPinyin":"XinJiaPo","cityJianpin":""},{"cityName":"越南","cityPinyin":"YueNan","cityJianpin":""},{"cityName":"马尔代夫","cityPinyin":"MaErDaiFu","cityJianpin":""},{"cityName":"菲律宾","cityPinyin":"FeiLvBin","cityJianpin":""},{"cityName":"文莱","cityPinyin":"WenLai","cityJianpin":""},{"cityName":"柬埔寨","cityPinyin":"JianPuZhai","cityJianpin":""},{"cityName":"斯里兰卡","cityPinyin":"SiLiLanKa","cityJianpin":""},{"cityName":"老挝","cityPinyin":"LaoWo","cityJianpin":""},{"cityName":"印度","cityPinyin":"YinDu","cityJianpin":""},{"cityName":"尼泊尔","cityPinyin":"NiBoEr","cityJianpin":""},{"cityName":"不丹","cityPinyin":"BuDan","cityJianpin":""},{"cityName":"缅甸","cityPinyin":"MianDian","cityJianpin":""},{"cityName":"曼谷","cityPinyin":"ManGu","cityJianpin":""},{"cityName":"巴厘岛","cityPinyin":"BaLiDao","cityJianpin":""},{"cityName":"苏梅岛","cityPinyin":"SuMeiDao","cityJianpin":""},{"cityName":"普吉岛","cityPinyin":"PuJiDao","cityJianpin":""},{"cityName":"清迈","cityPinyin":"QingMai","cityJianpin":""},{"cityName":"芽庄","cityPinyin":"YaZhuang","cityJianpin":""},{"cityName":"岘港","cityPinyin":"XianGang","cityJianpin":""},{"cityName":"甲米","cityPinyin":"JiaMi","cityJianpin":""},{"cityName":"芭提雅","cityPinyin":"BaTiYa","cityJianpin":""},{"cityName":"波德申","cityPinyin":"BoDeShen","cityJianpin":""},{"cityName":"兰卡威","cityPinyin":"LanKaWei","cityJianpin":""},{"cityName":"吉隆坡","cityPinyin":"JiLongPo","cityJianpin":""},{"cityName":"琅勃拉邦","cityPinyin":"LangBoLaBang","cityJianpin":""},{"cityName":"多哈","cityPinyin":"DuoHa","cityJianpin":""},{"cityName":"柬埔寨","cityPinyin":"JianPuZhai","cityJianpin":""},{"cityName":"长滩岛","cityPinyin":"ChangTanDao","cityJianpin":""},{"cityName":"河内","cityPinyin":"HeNa","cityJianpin":""}]},{"areaName":"日韩","areaItem":[{"cityName":"日本","cityPinyin":"RiBen","cityJianpin":""},{"cityName":"韩国","cityPinyin":"HanGuo","cityJianpin":""},{"cityName":"济州岛","cityPinyin":"JiZhouDao","cityJianpin":""},{"cityName":"首尔","cityPinyin":"ShouEr","cityJianpin":""},{"cityName":"东京","cityPinyin":"DongJing","cityJianpin":""},{"cityName":"本州","cityPinyin":"BenZhou","cityJianpin":""},{"cityName":"大阪","cityPinyin":"DaBan","cityJianpin":""},{"cityName":"琉球古王国","cityPinyin":"LiuQiuGuWangGuo","cityJianpin":""},{"cityName":"北海道","cityPinyin":"BeiHaiDao","cityJianpin":""},{"cityName":"奈良","cityPinyin":"NaiLiang","cityJianpin":""},{"cityName":"名古屋","cityPinyin":"MingGuWu","cityJianpin":""},{"cityName":"鹿儿岛","cityPinyin":"LuErDao","cityJianpin":""},{"cityName":"静冈","cityPinyin":"JingGang","cityJianpin":""},{"cityName":"京都","cityPinyin":"JingDu","cityJianpin":""},{"cityName":"福冈","cityPinyin":"FuGang","cityJianpin":""},{"cityName":"神户","cityPinyin":"ShenHu","cityJianpin":""},{"cityName":"江原道","cityPinyin":"JiangYuanDao","cityJianpin":""},{"cityName":"日本","cityPinyin":"RiBen","cityJianpin":""},{"cityName":"长崎","cityPinyin":"ChangQi","cityJianpin":""},{"cityName":"釜山","cityPinyin":"FuShan","cityJianpin":""},{"cityName":"仁川","cityPinyin":"RenChuan","cityJianpin":""},{"cityName":"京畿道","cityPinyin":"JingJiDao","cityJianpin":""},{"cityName":"冲绳","cityPinyin":"ChongSheng","cityJianpin":""}]},{"areaName":"欧洲","areaItem":[{"cityName":"法国","cityPinyin":"FaGuo","cityJianpin":""},{"cityName":"意大利","cityPinyin":"YiDaLi","cityJianpin":""},{"cityName":"西班牙","cityPinyin":"XiBanYa","cityJianpin":""},{"cityName":"英国","cityPinyin":"YingGuo","cityJianpin":""},{"cityName":"德国","cityPinyin":"DeGuo","cityJianpin":""},{"cityName":"匈牙利","cityPinyin":"XiongYaLi","cityJianpin":""},{"cityName":"瑞士","cityPinyin":"RuiShi","cityJianpin":""},{"cityName":"挪威","cityPinyin":"NuoWei","cityJianpin":""},{"cityName":"土耳其","cityPinyin":"TuErQi","cityJianpin":""},{"cityName":"荷兰","cityPinyin":"HeLan","cityJianpin":""},{"cityName":"奥匈捷","cityPinyin":"AoXiongJie","cityJianpin":""},{"cityName":"捷克","cityPinyin":"JieKe","cityJianpin":""},{"cityName":"波兰","cityPinyin":"BoLan","cityJianpin":""},{"cityName":"奥地利","cityPinyin":"AoDiLi","cityJianpin":""},{"cityName":"比利时","cityPinyin":"BiLiShi","cityJianpin":""},{"cityName":"芬兰","cityPinyin":"FenLan","cityJianpin":""},{"cityName":"梵蒂冈","cityPinyin":"FanDiGang","cityJianpin":""},{"cityName":"俄罗斯","cityPinyin":"ELuoSi","cityJianpin":""},{"cityName":"摩洛哥","cityPinyin":"MoLuoGe","cityJianpin":""},{"cityName":"葡萄牙","cityPinyin":"PuTaoYa","cityJianpin":""},{"cityName":"斯洛伐克","cityPinyin":"SiLuoFaKe","cityJianpin":""},{"cityName":"爱沙尼亚","cityPinyin":"AiShaNiYa","cityJianpin":""},{"cityName":"希腊","cityPinyin":"XiLa","cityJianpin":""},{"cityName":"瑞典","cityPinyin":"RuiDian","cityJianpin":""}]},{"areaName":"美洲","areaItem":[{"cityName":"美国","cityPinyin":"MeiGuo","cityJianpin":""},{"cityName":"加拿大","cityPinyin":"JiaNaDa","cityJianpin":""},{"cityName":"巴西","cityPinyin":"BaXi","cityJianpin":""},{"cityName":"古巴","cityPinyin":"GuBa","cityJianpin":""},{"cityName":"阿根廷","cityPinyin":"AGenTing","cityJianpin":""},{"cityName":"墨西哥","cityPinyin":"MoXiGe","cityJianpin":""},{"cityName":"哥斯达黎加","cityPinyin":"GeSiDaLiJia","cityJianpin":""},{"cityName":"智利","cityPinyin":"ZhiLi","cityJianpin":""},{"cityName":"秘鲁","cityPinyin":"MiLu","cityJianpin":""},{"cityName":"夏威夷","cityPinyin":"XiaWeiYi","cityJianpin":""},{"cityName":"迈阿密","cityPinyin":"MaiAMi","cityJianpin":""},{"cityName":"纽约","cityPinyin":"NiuYue","cityJianpin":""},{"cityName":"华盛顿","cityPinyin":"HuaShengDun","cityJianpin":""},{"cityName":"西雅图","cityPinyin":"XiYaTu","cityJianpin":""},{"cityName":"奥兰多","cityPinyin":"AoLanDuo","cityJianpin":""},{"cityName":"巴拿马","cityPinyin":"BaNaMa","cityJianpin":""},{"cityName":"洛杉矶","cityPinyin":"LuoShanJi","cityJianpin":""},{"cityName":"拉斯维加斯","cityPinyin":"LaSiWeiJiaSi","cityJianpin":""},{"cityName":"费城","cityPinyin":"FeiCheng","cityJianpin":""},{"cityName":"波士顿","cityPinyin":"BoShiDun","cityJianpin":""},{"cityName":"里约","cityPinyin":"LiYue","cityJianpin":""}]},{"areaName":"非洲中东","areaItem":[{"cityName":"埃及","cityPinyin":"AiJi","cityJianpin":""},{"cityName":"希腊","cityPinyin":"XiLa","cityJianpin":""},{"cityName":"迪拜","cityPinyin":"DiBai","cityJianpin":""},{"cityName":"阿联酋","cityPinyin":"ALianQiu","cityJianpin":""},{"cityName":"南非","cityPinyin":"NanFei","cityJianpin":""},{"cityName":"毛里求斯","cityPinyin":"MaoLiQiuSi","cityJianpin":""},{"cityName":"以色列","cityPinyin":"YiSeLie","cityJianpin":""},{"cityName":"约旦","cityPinyin":"YueDan","cityJianpin":""},{"cityName":"肯尼亚","cityPinyin":"KenNiYa","cityJianpin":""},{"cityName":"伊朗","cityPinyin":"YiLang","cityJianpin":""},{"cityName":"非洲","cityPinyin":"FeiZhou","cityJianpin":""},{"cityName":"土耳其","cityPinyin":"TuErQi","cityJianpin":""}]},{"areaName":"澳洲新西兰","areaItem":[{"cityName":"澳大利亚","cityPinyin":"AoDaLiYa","cityJianpin":""},{"cityName":"新西兰","cityPinyin":"XinXiLan","cityJianpin":""},{"cityName":"凯恩斯","cityPinyin":"KaiEnSi","cityJianpin":""},{"cityName":"奥克兰","cityPinyin":"AoKeLan","cityJianpin":""},{"cityName":"斐济","cityPinyin":"FeiJi","cityJianpin":""},{"cityName":"悉尼","cityPinyin":"XiNi","cityJianpin":""},{"cityName":"墨尔本","cityPinyin":"MoErBen","cityJianpin":""},{"cityName":"维多利亚","cityPinyin":"WeiDuoLiYa","cityJianpin":""},{"cityName":"基督城","cityPinyin":"JiDuCheng","cityJianpin":""}]}];
	
//国内游目的地
var domestic_areas=[{"areaName":"热门","areaId":null,"areaItem":[{"cityName":"三亚","cityPinyin":"SanYa","cityJianpin":""},{"cityName":"海口","cityPinyin":"HaiKou","cityJianpin":""},{"cityName":"丽江","cityPinyin":"LiJiang","cityJianpin":""},{"cityName":"昆明","cityPinyin":"KunMing","cityJianpin":""},{"cityName":"大理","cityPinyin":"DaLi","cityJianpin":""},{"cityName":"西双版纳","cityPinyin":"XiShuangBanNa","cityJianpin":""},{"cityName":"西藏","cityPinyin":"XiCang","cityJianpin":""},{"cityName":"上海","cityPinyin":"ShangHai","cityJianpin":""},{"cityName":"延安","cityPinyin":"YanAn","cityJianpin":""},{"cityName":"青岛","cityPinyin":"QingDao","cityJianpin":""},{"cityName":"内蒙古","cityPinyin":"NaMengGu","cityJianpin":""},{"cityName":"张家界","cityPinyin":"ZhangJiaJie","cityJianpin":""},{"cityName":"新疆","cityPinyin":"XinJiang","cityJianpin":""},{"cityName":"苏州","cityPinyin":"SuZhou","cityJianpin":""},{"cityName":"南京","cityPinyin":"NanJing","cityJianpin":""},{"cityName":"大连","cityPinyin":"DaLian","cityJianpin":""},{"cityName":"宁夏","cityPinyin":"NingXia","cityJianpin":""},{"cityName":"青海","cityPinyin":"QingHai","cityJianpin":""},{"cityName":"贵州","cityPinyin":"GuiZhou","cityJianpin":""},{"cityName":"桂林","cityPinyin":"GuiLin","cityJianpin":""},{"cityName":"厦门","cityPinyin":"XiaMen","cityJianpin":""},{"cityName":"北京","cityPinyin":"BeiJing","cityJianpin":""},{"cityName":"西安","cityPinyin":"XiAn","cityJianpin":""},{"cityName":"杭州","cityPinyin":"HangZhou","cityJianpin":""},{"cityName":"重庆","cityPinyin":"ZhongQing","cityJianpin":""},{"cityName":"浙江","cityPinyin":"ZheJiang","cityJianpin":""},{"cityName":"东北三省","cityPinyin":"DongBeiSanSheng","cityJianpin":""}]},{"areaName":"云南","areaItem":[{"cityName":"丽江","cityPinyin":"LiJiang","cityJianpin":""},{"cityName":"昆明","cityPinyin":"KunMing","cityJianpin":""},{"cityName":"香格里拉","cityPinyin":"XiangGeLiLa","cityJianpin":""},{"cityName":"西双版纳","cityPinyin":"XiShuangBanNa","cityJianpin":""},{"cityName":"泸沽湖","cityPinyin":"LuGuHu","cityJianpin":""},{"cityName":"腾冲","cityPinyin":"TengChong","cityJianpin":""},{"cityName":"瑞丽","cityPinyin":"RuiLi","cityJianpin":""}]},{"areaName":"海南","areaItem":[{"cityName":"三亚","cityPinyin":"SanYa","cityJianpin":""},{"cityName":"海口","cityPinyin":"HaiKou","cityJianpin":""},{"cityName":"亚龙湾","cityPinyin":"YaLongWan","cityJianpin":""},{"cityName":"大东海","cityPinyin":"DaDongHai","cityJianpin":""},{"cityName":"海棠湾","cityPinyin":"HaiTangWan","cityJianpin":""},{"cityName":"蜈支洲岛","cityPinyin":"WuZhiZhouDao","cityJianpin":""},{"cityName":"天涯海角","cityPinyin":"TianYaHaiJiao","cityJianpin":""}]},{"areaName":"福建","areaItem":[{"cityName":"厦门","cityPinyin":"XiaMen","cityJianpin":""},{"cityName":"福州","cityPinyin":"FuZhou","cityJianpin":""},{"cityName":"鼓浪屿","cityPinyin":"GuLangYu","cityJianpin":""},{"cityName":"永定土楼","cityPinyin":"YongDingTuLou","cityJianpin":""},{"cityName":"武夷山","cityPinyin":"WuYiShan","cityJianpin":""},{"cityName":"南靖土楼","cityPinyin":"NanJingTuLou","cityJianpin":""}]},{"areaName":"四川","areaItem":[{"cityName":"九寨沟","cityPinyin":"JiuZhaiGou","cityJianpin":""},{"cityName":"成都","cityPinyin":"ChengDu","cityJianpin":""},{"cityName":"峨眉山","cityPinyin":"EMeiShan","cityJianpin":""},{"cityName":"乐山","cityPinyin":"LeShan","cityJianpin":""},{"cityName":"青城山","cityPinyin":"QingChengShan","cityJianpin":""},{"cityName":"海螺沟","cityPinyin":"HaiLuoGou","cityJianpin":""},{"cityName":"都江堰","cityPinyin":"DuJiangYan","cityJianpin":""}]},{"areaName":"华东","areaItem":[{"cityName":"杭州","cityPinyin":"HangZhou","cityJianpin":""},{"cityName":"上海","cityPinyin":"ShangHai","cityJianpin":""},{"cityName":"千岛湖","cityPinyin":"QianDaoHu","cityJianpin":""},{"cityName":"乌镇","cityPinyin":"WuZhen","cityJianpin":""},{"cityName":"黄山","cityPinyin":"HuangShan","cityJianpin":""},{"cityName":"普陀山","cityPinyin":"PuTuoShan","cityJianpin":""},{"cityName":"南京","cityPinyin":"NanJing","cityJianpin":""},{"cityName":"苏州","cityPinyin":"SuZhou","cityJianpin":""}]},{"areaName":"西藏","areaItem":[{"cityName":"拉萨","cityPinyin":"LaSa","cityJianpin":""},{"cityName":"布达拉宫","cityPinyin":"BuDaLaGong","cityJianpin":""},{"cityName":"雅鲁藏布江","cityPinyin":"YaLuCangBuJiang","cityJianpin":""},{"cityName":"羊卓雍措","cityPinyin":"YangZhuoYongCuo","cityJianpin":""},{"cityName":"珠峰","cityPinyin":"ZhuFeng","cityJianpin":""},{"cityName":"日喀则","cityPinyin":"RiKaZe","cityJianpin":""}]},{"areaName":"广西","areaItem":[{"cityName":"桂林","cityPinyin":"GuiLin","cityJianpin":""},{"cityName":"漓江","cityPinyin":"LiJiang","cityJianpin":""},{"cityName":"北海","cityPinyin":"BeiHai","cityJianpin":""},{"cityName":"阳朔","cityPinyin":"YangShuo","cityJianpin":""},{"cityName":"南宁","cityPinyin":"NanNing","cityJianpin":""},{"cityName":"龙脊梯田","cityPinyin":"LongJiTiTian","cityJianpin":""},{"cityName":"涠洲岛","cityPinyin":"WeiZhouDao","cityJianpin":""}]},{"areaName":"西北","areaItem":[{"cityName":"敦煌","cityPinyin":"DunHuang","cityJianpin":""},{"cityName":"嘉峪关","cityPinyin":"JiaYuGuan","cityJianpin":""},{"cityName":"兰州","cityPinyin":"LanZhou","cityJianpin":""},{"cityName":"莫高窟","cityPinyin":"MoGaoKu","cityJianpin":""},{"cityName":"沙坡头","cityPinyin":"ShaPoTou","cityJianpin":""},{"cityName":"张掖","cityPinyin":"ZhangYe","cityJianpin":""},{"cityName":"西宁","cityPinyin":"XiNing","cityJianpin":""},{"cityName":"青海湖","cityPinyin":"QingHaiHu","cityJianpin":""},{"cityName":"银川","cityPinyin":"YinChuan","cityJianpin":""},{"cityName":"中卫","cityPinyin":"ZhongWei","cityJianpin":""},{"cityName":"乌鲁木齐","cityPinyin":"WuLuMuQi","cityJianpin":""},{"cityName":"天池","cityPinyin":"TianChi","cityJianpin":""},{"cityName":"吐鲁番","cityPinyin":"TuLuFan","cityJianpin":""},{"cityName":"喀纳斯","cityPinyin":"KaNaSi","cityJianpin":""}]},{"areaName":"北京","areaItem":[{"cityName":"天安门","cityPinyin":"TianAnMen","cityJianpin":""},{"cityName":"故宫","cityPinyin":"GuGong","cityJianpin":""},{"cityName":"北海公园","cityPinyin":"BeiHaiGongYuan","cityJianpin":""},{"cityName":"后海","cityPinyin":"HouHai","cityJianpin":""},{"cityName":"鸟巢","cityPinyin":"NiaoChao","cityJianpin":""},{"cityName":"水立方","cityPinyin":"ShuiLiFang","cityJianpin":""},{"cityName":"颐和园","cityPinyin":"YiHeYuan","cityJianpin":""}]},{"areaName":"山东","areaItem":[{"cityName":"烟台","cityPinyin":"YanTai","cityJianpin":""},{"cityName":"威海","cityPinyin":"WeiHai","cityJianpin":""},{"cityName":"济南","cityPinyin":"JiNan","cityJianpin":""},{"cityName":"青岛","cityPinyin":"QingDao","cityJianpin":""},{"cityName":"泰山","cityPinyin":"TaiShan","cityJianpin":""},{"cityName":"日照","cityPinyin":"RiZhao","cityJianpin":""},{"cityName":"崂山","cityPinyin":"LaoShan","cityJianpin":""},{"cityName":"枣庄","cityPinyin":"ZaoZhuang","cityJianpin":""}]},{"areaName":"湖南","areaItem":[{"cityName":"张家界","cityPinyin":"ZhangJiaJie","cityJianpin":""},{"cityName":"天门山","cityPinyin":"TianMenShan","cityJianpin":""},{"cityName":"黄石","cityPinyin":"HuangShi","cityJianpin":""},{"cityName":"凤凰","cityPinyin":"FengHuang","cityJianpin":""},{"cityName":"长沙","cityPinyin":"ChangSha","cityJianpin":""},{"cityName":"红石林","cityPinyin":"HongShiLin","cityJianpin":""},{"cityName":"韶山","cityPinyin":"ShaoShan","cityJianpin":""},{"cityName":"湘西","cityPinyin":"XiangXi","cityJianpin":""}]},{"areaName":"广东","areaItem":[{"cityName":"深圳","cityPinyin":"ShenChou","cityJianpin":""},{"cityName":"广州","cityPinyin":"GuangZhou","cityJianpin":""},{"cityName":"珠海","cityPinyin":"ZhuHai","cityJianpin":""},{"cityName":"汕头","cityPinyin":"ShanTou","cityJianpin":""},{"cityName":"大亚湾","cityPinyin":"DaYaWan","cityJianpin":""},{"cityName":"长隆欢乐世界","cityPinyin":"ChangLongHuanLeShiJie","cityJianpin":""},{"cityName":"丹霞山","cityPinyin":"DanXiaShan","cityJianpin":""}]},{"areaName":"重庆","areaItem":[{"cityName":"三峡","cityPinyin":"SanXia","cityJianpin":""},{"cityName":"武隆","cityPinyin":"WuLong","cityJianpin":""},{"cityName":"大足石刻","cityPinyin":"DaZuShiKe","cityJianpin":""},{"cityName":"白帝城","cityPinyin":"BaiDiCheng","cityJianpin":""},{"cityName":"小三峡","cityPinyin":"XiaoSanXia","cityJianpin":""},{"cityName":"神女溪","cityPinyin":"ShenNvXi","cityJianpin":""}]},{"areaName":"内蒙古","areaItem":[{"cityName":"呼伦贝尔","cityPinyin":"HuLunBeiEr","cityJianpin":""},{"cityName":"鄂尔多斯","cityPinyin":"EErDuoSi","cityJianpin":""},{"cityName":"满洲里","cityPinyin":"ManZhouLi","cityJianpin":""},{"cityName":"阿尔山","cityPinyin":"AErShan","cityJianpin":""},{"cityName":"赤峰","cityPinyin":"ChiFeng","cityJianpin":""},{"cityName":"额尔古纳","cityPinyin":"EErGuNa","cityJianpin":""}]},{"areaName":"山西","areaItem":[{"cityName":"太原","cityPinyin":"TaiYuan","cityJianpin":""},{"cityName":"平遥古城","cityPinyin":"PingYaoGuCheng","cityJianpin":""},{"cityName":"五台山","cityPinyin":"WuTaiShan","cityJianpin":""},{"cityName":"云冈石窟","cityPinyin":"YunGangShiKu","cityJianpin":""},{"cityName":"大同","cityPinyin":"DaTong","cityJianpin":""},{"cityName":"乔家大院","cityPinyin":"QiaoJiaDaYuan","cityJianpin":""}]},{"areaName":"陕西","areaItem":[{"cityName":"西安","cityPinyin":"XiAn","cityJianpin":""},{"cityName":"延安","cityPinyin":"YanAn","cityJianpin":""},{"cityName":"华山","cityPinyin":"HuaShan","cityJianpin":""},{"cityName":"兵马俑","cityPinyin":"BingMaYong","cityJianpin":""},{"cityName":"华清池","cityPinyin":"HuaQingChi","cityJianpin":""},{"cityName":"法门寺","cityPinyin":"FaMenSi","cityJianpin":""}]},{"areaName":"湖北","areaItem":[{"cityName":"宜昌","cityPinyin":"YiChang","cityJianpin":""},{"cityName":"武汉","cityPinyin":"WuHan","cityJianpin":""},{"cityName":"三峡","cityPinyin":"SanXia","cityJianpin":""},{"cityName":"黄鹤楼","cityPinyin":"HuangHeLou","cityJianpin":""},{"cityName":"武当山","cityPinyin":"WuDangShan","cityJianpin":""},{"cityName":"神农架","cityPinyin":"ShenNongJia","cityJianpin":""},{"cityName":"恩施","cityPinyin":"EnShi","cityJianpin":""}]},{"areaName":"江西","areaItem":[{"cityName":"婺源","cityPinyin":"MouYuan","cityJianpin":""},{"cityName":"庐山","cityPinyin":"LuShan","cityJianpin":""},{"cityName":"南昌","cityPinyin":"NanChang","cityJianpin":""},{"cityName":"景德镇","cityPinyin":"JingDeZhen","cityJianpin":""},{"cityName":"三清山","cityPinyin":"SanQingShan","cityJianpin":""},{"cityName":"龙虎山","cityPinyin":"LongHuShan","cityJianpin":""},{"cityName":"井冈山","cityPinyin":"JingGangShan","cityJianpin":""}]},{"areaName":"河南","areaItem":[{"cityName":"龙门石窟","cityPinyin":"LongMenShiKu","cityJianpin":""},{"cityName":"云台山","cityPinyin":"YunTaiShan","cityJianpin":""},{"cityName":"郑州","cityPinyin":"ZhengZhou","cityJianpin":""},{"cityName":"开封","cityPinyin":"KaiFeng","cityJianpin":""},{"cityName":"洛阳","cityPinyin":"LuoYang","cityJianpin":""},{"cityName":"少林寺","cityPinyin":"ShaoLinSi","cityJianpin":""}]},{"areaName":"河北","areaItem":[{"cityName":"秦皇岛","cityPinyin":"QinHuangDao","cityJianpin":""},{"cityName":"承德","cityPinyin":"ChengDe","cityJianpin":""},{"cityName":"木兰围场","cityPinyin":"MuLanWeiChang","cityJianpin":""},{"cityName":"坝上草原","cityPinyin":"BaShangCaoYuan","cityJianpin":""}]},{"areaName":"东北","areaItem":[{"cityName":"哈尔滨","cityPinyin":"HaErBin","cityJianpin":""},{"cityName":"长白山","cityPinyin":"ChangBaiShan","cityJianpin":""},{"cityName":"五大连池","cityPinyin":"WuDaLianChi","cityJianpin":""},{"cityName":"金石滩","cityPinyin":"JinShiTan","cityJianpin":""},{"cityName":"亚布力","cityPinyin":"YaBuLi","cityJianpin":""},{"cityName":"大连","cityPinyin":"DaLian","cityJianpin":""},{"cityName":"长春","cityPinyin":"ChangChun","cityJianpin":""}]},{"areaName":"贵州","areaItem":[{"cityName":"贵阳","cityPinyin":"GuiYang","cityJianpin":""},{"cityName":"黄果树","cityPinyin":"HuangGuoShu","cityJianpin":""},{"cityName":"荔波","cityPinyin":"LiBo","cityJianpin":""},{"cityName":"梵净山","cityPinyin":"FanJingShan","cityJianpin":""},{"cityName":"遵义","cityPinyin":"ZunYi","cityJianpin":""},{"cityName":"黔东南","cityPinyin":"QianDongNan","cityJianpin":""},{"cityName":"赤水","cityPinyin":"ChiShui","cityJianpin":""},{"cityName":"镇远","cityPinyin":"ZhenYuan","cityJianpin":""}]}];
	
//周边游目的地
var weekend_areas=[
	{"areaName":"热门","areaId":2293,"areaItem":[{"cityName":"稻城","cityPinyin":"DaoCheng","cityJianpin":""},{"cityName":"甘孜","cityPinyin":"GanZi","cityJianpin":""},{"cityName":"黄龙","cityPinyin":"HuangLong","cityJianpin":""},{"cityName":"九寨沟","cityPinyin":"JiuZhaiGou","cityJianpin":""},{"cityName":"毕棚沟","cityPinyin":"BiPengGou","cityJianpin":""},{"cityName":"海螺沟","cityPinyin":"HaiLuoGou","cityJianpin":""},{"cityName":"峨眉山","cityPinyin":"EMeiShan","cityJianpin":""},{"cityName":"武隆","cityPinyin":"WuLong","cityJianpin":""},{"cityName":"西岭雪山","cityPinyin":"XiLingXueShan","cityJianpin":""},{"cityName":"都江堰","cityPinyin":"DuJiangYan","cityJianpin":""},{"cityName":"乐山","cityPinyin":"LeShan","cityJianpin":""},{"cityName":"熊猫基地","cityPinyin":"XiongMiaoJiDi","cityJianpin":""},{"cityName":"泸沽湖","cityPinyin":"LuGuHu","cityJianpin":""},{"cityName":"蜀南竹海","cityPinyin":"ShuNanZhuHai","cityJianpin":""}]},
	{"areaName":"热门","areaId":12,"areaItem":[{"cityName":"鸟巢水立方","cityPinyin":"","cityJianpin":""},{"cityName":"古北水镇","cityPinyin":"","cityJianpin":""},	{"cityName":"五台山","cityPinyin":"","cityJianpin":""},{"cityName":"承德","cityPinyin":"","cityJianpin":""},{"cityName":"杜莎夫人蜡像馆","cityPinyin":"","cityJianpin":""},{"cityName":"天安门","cityPinyin":"","cityJianpin":""},{"cityName":"圆明园","cityPinyin":"","cityJianpin":""},{"cityName":"故宫","cityPinyin":"","cityJianpin":""},{"cityName":"八达岭长城","cityPinyin":"","cityJianpin":""},{"cityName":"慕田峪长城","cityPinyin":"","cityJianpin":""},{"cityName":"颐和园","cityPinyin":"","cityJianpin":""},{"cityName":"天坛","cityPinyin":"","cityJianpin":""},{"cityName":"南锣鼓巷","cityPinyin":"","cityJianpin":""},{"cityName":"天津","cityPinyin":"","cityJianpin":""},{"cityName":"秦皇岛","cityPinyin":"","cityJianpin":""},{"cityName":"石家庄","cityPinyin":"","cityJianpin":""}]},
	{"areaName":"热门","areaId":802,"areaItem":[{"cityName":"迪斯尼","cityPinyin":"","cityJianpin":""},{"cityName":"东方明珠","cityPinyin":"","cityJianpin":""},	{"cityName":"野生动物园","cityPinyin":"","cityJianpin":""},{"cityName":"横店影视城","cityPinyin":"","cityJianpin":""},{"cityName":"西塘","cityPinyin":"","cityJianpin":""},{"cityName":"乌镇","cityPinyin":"","cityJianpin":""},{"cityName":"千岛湖","cityPinyin":"","cityJianpin":""},{"cityName":"绍兴","cityPinyin":"","cityJianpin":""},{"cityName":"江苏","cityPinyin":"","cityJianpin":""},{"cityName":"华山","cityPinyin":"","cityJianpin":""},{"cityName":"景德镇","cityPinyin":"","cityJianpin":""},{"cityName":"山东","cityPinyin":"","cityJianpin":""},{"cityName":"安徽","cityPinyin":"","cityJianpin":""},{"cityName":"江西","cityPinyin":"","cityJianpin":""}]},
	{"areaName":"热门","areaId":1958,"areaItem":[{"cityName":"黄埔军校","cityPinyin":"","cityJianpin":""},{"cityName":"中山纪念堂","cityPinyin":"","cityJianpin":""},	{"cityName":"深圳","cityPinyin":"","cityJianpin":""},{"cityName":"珠海","cityPinyin":"","cityJianpin":""},{"cityName":"长隆","cityPinyin":"","cityJianpin":""},{"cityName":"佛山","cityPinyin":"","cityJianpin":""},{"cityName":"江门","cityPinyin":"","cityJianpin":""},{"cityName":"佛冈","cityPinyin":"","cityJianpin":""},{"cityName":"台山","cityPinyin":"","cityJianpin":""},{"cityName":"韶关","cityPinyin":"","cityJianpin":""},{"cityName":"惠州","cityPinyin":"","cityJianpin":""}]},
	{"areaName":"热门","areaId":2251,"areaItem":[{"cityName":"野生动物园","cityPinyin":"","cityJianpin":""},{"cityName":"乐和乐都主题公园","cityPinyin":"","cityJianpin":""},	{"cityName":"仙女山","cityPinyin":"","cityJianpin":""},{"cityName":"乌江画廊","cityPinyin":"","cityJianpin":""},{"cityName":"黑山谷","cityPinyin":"","cityJianpin":""},{"cityName":"四川","cityPinyin":"","cityJianpin":""},{"cityName":"大足石刻","cityPinyin":"","cityJianpin":""},{"cityName":"蜀南竹海","cityPinyin":"","cityJianpin":""},{"cityName":"九寨黄龙","cityPinyin":"","cityJianpin":""}]},
	{"areaName":"热门","areaId":939,"areaItem":[{"cityName":"千岛湖","cityPinyin":"","cityJianpin":""},{"cityName":"横店影视城","cityPinyin":"","cityJianpin":""},{"cityName":"乌镇","cityPinyin":"","cityJianpin":""},{"cityName":"西溪湿地","cityPinyin":"","cityJianpin":""},{"cityName":"天目湖","cityPinyin":"","cityJianpin":""},{"cityName":"西塘","cityPinyin":"","cityJianpin":""},{"cityName":"莫干山","cityPinyin":"","cityJianpin":""},{"cityName":"上海","cityPinyin":"","cityJianpin":""},{"cityName":"黄山","cityPinyin":"","cityJianpin":""},{"cityName":"庐山","cityPinyin":"","cityJianpin":""},{"cityName":"无锡","cityPinyin":"","cityJianpin":""},{"cityName":"绍兴","cityPinyin":"","cityJianpin":""}]},
	{"areaName":"热门","areaId":821,"areaItem":[{"cityName":"总统府","cityPinyin":"","cityJianpin":""},{"cityName":"中山陵","cityPinyin":"","cityJianpin":""},{"cityName":"扬州","cityPinyin":"","cityJianpin":""},{"cityName":"太湖湿地公园","cityPinyin":"","cityJianpin":""},{"cityName":"上海","cityPinyin":"","cityJianpin":""},{"cityName":"夫子庙","cityPinyin":"","cityJianpin":""},{"cityName":"周庄古镇","cityPinyin":"","cityJianpin":""},{"cityName":"九华山","cityPinyin":"","cityJianpin":""},{"cityName":"南京","cityPinyin":"","cityJianpin":""},{"cityName":"杭州","cityPinyin":"","cityJianpin":""},{"cityName":"无锡","cityPinyin":"","cityJianpin":""},{"cityName":"镇江","cityPinyin":"","cityJianpin":""},{"cityName":"南通","cityPinyin":"","cityJianpin":""}]}
					];
/*var proWeekend_areas={"provinceName":"四川","provinceId":2293},
{"provinceName":"北京","provinceId":12},
{"provinceName":"上海","provinceId":802},
{"provinceName":"广东","provinceId":1958},
{"provinceName":"重庆","provinceId":2251},
{"provinceName":"浙江","provinceId":939},
{"provinceName":"江苏","provinceId":821},*/
var area=$('[name="areaId"]').val();
	if(area){
		area=parseInt(area);
	}else{
		area=2293;
	}
$(window).load(function(){
	var winHeight =$(window).height();
    var headHeight =$(".h_top").height();
    var footHeight = 0;
    var dh = winHeight - footHeight-headHeight;
    $("#noResult").css({"min-height":(dh)+"px"});
    $(".gmui-page").css({"min-height":winHeight+"px"});
    $(".beforeSearch").css({"min-height":(dh)+"px"});
    $(".selectTripDay option:eq(0)").attr("selected","selected");
});
//每个栏目目的地下的目的地的字母分组
function group(obj){
	for(var i=0;i<obj.length;i++){
		var item=obj[i].areaItem;
		var itemName=obj[i].areaName;
		var tmp=new Array();
		for(var j=0;j<item.length;j++){
			var indexChar=item[j].cityJianpin.substr(0,1);
			if(!(indexChar in obj[i])) {
				obj[i][indexChar] = new Array();
			}
			obj[i][indexChar].charName=indexChar;
			obj[i][indexChar].push(item[j]);
			
		}
	}
	return obj;
}

//拼接各个目的地
function appendHtml(obj,objType){
	var html="";
	for(var i=0;i<obj.length;i++){
		if(obj[i].areaName == objType){
			for (var key in obj[i]) {
				if(key != 'areaItem' && key !='areaName'){
					//html+='<li class="charName">'+key+'</li>';//拼接拼音
					for(var city in obj[i][key]){
						if(city != "charName"){
							var cityName = obj[i][key][city].cityName;
							html+='<li data-id="'+cityName+'" data-name="destination" data-bn-ipg="">'+cityName+'</li>';
						}
					}
				}
			}
		}
	}
	$(".destination-list").html(html);
}
//目的地地区分类
function areaType(obj,$objClass){
	var html="";
	for(var i=0;i<obj.length;i++){
		var areaName=obj[i]['areaName'];
		var areaItem=obj[i]['areaItem'];
		if(areaName === '热门'){
			html+='<li data-name="destination" class="current"><span class="sub-title">'+areaName+'</span></li>';
		}else{
			html+='<li><span class="sub-title">'+areaName+'</span></li>';
		}
	}
	$objClass.append(html);
}

//处理周边游
function weekendAreas(obj,$objClass){
	var html="";
	for(var i=0;i<obj.length;i++){
		var areaName=obj[i]['areaName'],
		areaItem=obj[i]['areaItem'],
		areaId=obj[i]['areaId'];
		if(area === areaId){
			html+='<li data-name="destination" class="current"><span class="sub-title" data-id="'+areaId+'">'+areaName+'</span></li>';
			break;
		}
	}
	$objClass.append(html);
}

//拼接周边游各个目的地
function appendWeekend(obj,objId){
	var html="";
	for(var i=0;i<obj.length;i++){
		if(obj[i].areaId == objId){
			for (var key in obj[i]) {
				if(key != 'areaItem' && key !='areaName'){
					//html+='<li class="charName">'+key+'</li>';//拼接拼音
					for(var city in obj[i][key]){
						if(city != "charName"){
							var cityName = obj[i][key][city].cityName;
							html+='<li data-id="'+cityName+'" data-name="destination" data-bn-ipg="">'+cityName+'</li>';
						}
					}
				}
			}
		}
	}
	$(".destination-list").html(html);
}

(function ($) {
    var $ul = $("#ulList"), $ulList = $("#ulList"),
        $loading = $("#loading").on("click", loadData),
        $noMore = $("#noMore"),
        $noResult = $("#noResult"),
        $beforeSearch = $(".beforeSearch");
    	params = {size: 10, sort: 0},
        page = 1,
        leftHeight = 0,
        rightHeight = 0;
        //出境游的字母分组
    	var area_group=[];
    	
    //状态标识，用于判断当前操作是否为筛选
    var isFilter = false;
    (function () {
    	//轮播
        window.swipObjdelay = 0;
        var $swip = $('#mySwipe'), $bullets = $("li", "#mySwipePage"), width = 2 * Math.floor($swip.width());
        $("img", $swip).each(function () {
            this.src = $(this).attr("data-org") + "@" + width + "w_240h_1e_60q"
        }).length > 0 ? $swip.show() : "";
        var swipLen = $swip.find(".swipe-wrap li").length;
        if (swipLen) {
            var swipObj = $swip.Swipe({
                auto: 3000,
                continuous: true,
                speed: 600,
                callback: function (pos) {
                    if (pos >= swipLen) {
                        pos = pos - swipLen;
                    }
                    $bullets.removeClass("on");
                    $bullets.eq(pos).addClass("on");
                    swipObjdelay = 0;
                }, touchEndCallBack: function () {
                    swipObjdelay = 5000;
                }
            }).data('Swipe');
        }
        
        
        //根据请求的路径判断选中的状态
        var pathname=window.location.pathname;
        var $destination=$(".destination");
        var $destinationList=$(".destination-list");
        var objType="热门";
        if(pathname =="/abroad"){
            $(".selectNav-list li").removeClass("selected");
            //加载目的地数据
            area_group=group(abroad_areas);
        	areaType(area_group,$destination);
        	appendHtml(area_group,objType);
        	$("li[rel='abroad']").addClass("selected").append('<i class="gmIcon gm-success"></i>');
        }
        if(pathname =="/domestic"){
            $(".selectNav-list li").removeClass("selected");
            //加载目的地数据
            area_group=group(domestic_areas);
        	areaType(area_group,$destination);
        	appendHtml(area_group,objType);
        	$("li[rel='domestic']").addClass("selected").append('<i class="gmIcon gm-success"></i>');
        }
        if(pathname =="/around"){
            $(".selectNav-list li").removeClass("selected");
            //加载目的地数据
            area_group=group(weekend_areas);
        	weekendAreas(area_group,$destination);	
        	appendWeekend(area_group,area);
        	$("li[rel='around']").addClass("selected").append('<i class="gmIcon gm-success"></i>');
        }
        
    })();
    (function () {
        var $filter = $("#topFilter"),
            $filterDrap = $(".lmTopFilterDrop"),
            $filterMask = $("#topFilterMask1,#topFilterMask2");

        function filterClose() {
            $filterDrap.hide();
            $filterMask.hide();
            $("html").css({"overflow-y":"auto"});
            $('li', $filter).removeClass('current');
        }
        
        //目的地筛选
        $(".destination").on("click","li",function(){
        	if($(this).index() == 0){//点击全部目的地
        		$(this).removeClass("current");
        		$(this).siblings().removeClass("current");
        		$(this).next().addClass("current");
        		$(".destination-list").scrollTop(0);
        		appendHtml(area_group,"热门");
        	}else{//点击其它
        		$(".destination li").removeClass("current");
        		$(this).siblings().removeClass("current");
        		$(this).addClass("current");
        		var objType=$(this).find(".sub-title").text();
        		$(".destination-list").scrollTop(0);
        		appendHtml(area_group,objType);
        	}
        });
        
        //筛选
        $filter.on("click", "li", function (e) {
            if ($(this).is(".disabled")){
                return false;
            }
            //操作行程天数时
            if($(this).attr("data-id") == 'topFilterDays'){
            	$filterMask.hide();
	            $filterDrap.hide();
            }else{
                $filterMask.show();
	            $filterDrap.hide();
	            $(this).siblings().find(".gmIcon").removeClass("gm-arrow-up").addClass("gm-arrow-full");
	            $(this).siblings(".current").removeClass("current").addClass("no_current");
	            var target = $(this).removeClass("no_current").addClass("current").attr("data-id");
	            $(this).find(".gmIcon").removeClass("gm-arrow-full").addClass("gm-arrow-up");
	            var $tar = $("#" + target).show();
	            var tarHeight=document.documentElement.clientHeight - ($tar.offset().top - $(window).scrollTop())-40;
	            $("#topFilterDestination").height(tarHeight);
	            $("html").css({"overflow":"hidden"});
            }
            return false;
        });
       
        
        //多项筛选条件
        $(".lmTopFilters").on("click", "li[data-id]", function () {
            var $this = $(this), name = $this.attr("data-name"), value = $this.attr("data-id");
            $(".lmTopFilter li[data-id]").removeClass("no_current");
            if (params[name] != value) {
                params[name] = value;
                loadData(true, true);
            	$("li.current span", $filter).text($this.text());
                $("li.current").find(".gmIcon").removeClass("gm-arrow-up").addClass("gm-arrow-full");
                if(name == "destination" && $this.text()=='全部目的地'){
                   //点击全部目的地不做任何操作
                }else{
                    $this.addClass("current").siblings(".current").removeClass("current");
                }
        	}
            filterClose();
            return false;
        });
        
        //行程天数选择
        $(".selectTripDay").change(function(){
        	$(this).parent().parent().removeClass("current");
        	var name=$(this).attr("data-name");
        	var value=$("option:selected").attr("data-id");
        	params[name]=value;
        	loadData(true, true);
        });
        
        //滚动加载数据
        $(window).on("scroll", onScroll);
        
        //日期格式化
        Date.prototype.format = function (format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(), //day
                "h+": this.getHours(), //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                "S": this.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }
        
        //日期筛选
        $("#confirmDate").on("click", function () {
            var from = "", to = "", text = "", format = function (v) {
                return v.replace(/-/g, ".").substring(5);
            };
            $(this).siblings(".date_input").find("input").each(function () {
                var name = $(this).attr("data-name"), value = this.value;//$(this).attr("data-value");
                params[name] = value || "";
                if ($(this).attr("rel") == "from"){
                    from = value;
                }
                else{
                    to = value;
                }
            });
            var today = new Date();
            today = today.format("yyyy-MM-dd").toString();
            today = new Date(today.replace(/-/g, "/"));
            var dateFrom = new Date(from.replace(/-/g, "/"));
            var dateTo = new Date(to.replace(/-/g, "/"));
            if (from && to) {
                if (from > to) {
                    $(".erro").text("最晚出发时间不能早于最早出发时间！");
                    return;
                }
                if (dateFrom < today) {
                    $(".erro").text("出发时间不能早于当前日期！");
                    return;
                }
                $(".erro").text("");
                text = format(from) + "-" + format(to);
            }
            else {
                if (from) {
                    if (dateFrom < today) {
                        $(".erro").text("出发时间不能早于当前日期！");
                        return;
                    }
                    text = "最早" + format(from);
                    $(".erro").text("");
                }
                if (to) {
                    if (dateTo < today) {
                        $(".erro").text("出发时间不能早于当前日期！");
                        return;
                    }
                    text = "最晚" + format(to);
                    $(".erro").text("");
                }
            }
            if (text){
                text += "出发";
            }
            else{
                text = "出发时间";
            }
            loadData(true, true);
            $(".lmTopFilter li").find(".gmIcon").removeClass("gm-arrow-up").addClass("gm-arrow-full");
            $(".lmTopFilter li").siblings("li").removeClass("no_current");
            $("li.current span", $filter).text(text).removeClass("current");
            filterClose();
        })
        $filterMask.on("click", function () {
            $(".lmTopFilter li").find(".gmIcon").removeClass("gm-arrow-up").addClass("gm-arrow-full");
            $(".lmTopFilter li").siblings("li").removeClass("no_current");
            filterClose();
        });
    })();
    var scrollTimer;
    //滚动加载事件
    function onScroll() {
        scrollTimer && clearTimeout(scrollTimer);
        if ($loading.is(":visible")) {
            scrollTimer = setTimeout(function () {
                var bottom = $loading.offset().top;
                var scrollTop = $(window).scrollTop();
                var windowHeight = $(window).height();
                if (scrollTop >= bottom - windowHeight) {
                    if (page < 4) {
                        loadData();
                    } else {
                        $loading.find("div").html("点击加载更多");
                    }
                }
            }, 400);
        }
    }
    function getRandom(num1, num2) {
        if (num2)
            return Math.floor((num2 - num1) * Math.random()) + num1;
        return Math.floor(num1 * Math.random());
    }
    
    //加载数据
    var timer;
    function loadData(query, filter) {
        if ($loading.find("div").hasClass("loading")) {
            return false;
        }
        isFilter = filter;
        if (query === true) {
            page = 1;
            $("#ulList").html("");
        }
        $noResult.add($noMore).hide();
        $loading.show().find("div").addClass("loading");
        $loading.show().find("div").html('<span class="onLoad"><img src="http://static.gmmtour.com/m/theme/manage/images/loading.gif" />加载中，请稍后...</span>');
        params["page"] = page++;
        clearTimeout(timer);
        //var urljson = locationPrefix + "/search.json?fromdistributor="+distributorId;
        $.getJSON("/search.json", params, function (d) {
            $loading.find("div").removeClass("loading");
            if(page>3){
            	timer=setTimeout(function(){
            		$loading.find("div").html('点击加载更多');
            	},400);
            }
            //在异步获取到产品总数后将重新初始化微信分享
            try {
                if (d.pagination) {
                    wx.ready(function () {
                        weixinShareSDK.reSetShareNumAndShare(d.pagination.count);
                    })
                }
            } catch (e) {
            }
            var prevHeight = 0, len = d.items && d.items.length;//rd1 = getRandom(5), rd2 = 5 + getRandom(5),
            if (!len) {
                var result = $ulList.html();
                var menu = $("#topFilterLines .oneList li:eq(1)").html();
                if (query === true) {
                    $ul.hide();
                    $noResult.show();
                    $beforeSearch.hide();
                } else {
                    $noResult.hide();
                    $noMore.show();
                }
                $loading.hide();
                return;
            }
            $ul.show();
            if (len < params.size) {
                $beforeSearch.hide();
                $noMore.show();
                $loading.hide();
            }
            var width = Math.floor($("#ulList").width() / 2) - 10;
            var height = Math.floor(width * 0.7);
            $.each(d.items, function (i) {
                var img = this.product.coverImage.url + "@";
                img += width + "w_" + height + "h_1e_60q";
                prevHeight = height;
                this["img"] = img;
                this["height"] = height;
                var num = Math.floor(getRandom(1, 6));
                var bgColor = "";
                if (num == 1) {
                    bgColor = "#ec9696";
                }
                if (num == 2) {
                    bgColor = "#ecd796";
                }
                if (num == 3) {
                    bgColor = "#96ecdd";
                }
                if (num == 4) {
                    bgColor = "#96c0ec";
                }
                if (num == 5) {
                    bgColor = "#b7a6f4";
                }
                this["bg"] = bgColor;
                this.product.recentDates = this.product.recentDates.replace(/\//g,"、");
                $("#ulList").append(template("tpl_list_li", this));
            })
        }).fail(function () {
            $ul.add($loading).add($noMore).hide();
            $noResult.show();
            var result = $ulList.html();
            var menu = $("#topFilterLines .oneList li:eq(1)").html();
            if (result == "" && menu == undefined) {
                $(".lmTopFilters").hide();
            }
        });
    }

    var $topMenu = $("#topMenu").on("click", "li", function () {
      location.href = $("a", this).attr("rel");
    })
    $("body>input").each(function () {
        params[this.name] = this.value;
        if (this.name == "column") {
            $("#columnText").text($("li[rel=" + this.value + "]", $topMenu).text());
        }
    });
    
    //搜索页面的js处理
    var search = $.trim($("#keyword2").val());
    params.keyword = search;
    if (params.keyword != "") {
        $beforeSearch.hide();
        loadData(true);
    }
    var $searchBtn = $("#searchBtn");
    if (!$searchBtn.length) {
        $beforeSearch.hide();
    }
	var winHeight =$(window).height();
    var headHeight =$(".h_top").height();
    var footHeight = 0;
    var dh = winHeight - footHeight-headHeight;
    $(".main").css({"min-height":(dh)+"px"});
    if(params.keyword != ""){
    	$(".search_input").val(params.keyword);
    }
    
    if ($searchBtn.length) {
        $searchBtn.click(function () {
        	$(".search_input").val();
            $beforeSearch.hide();
            var keyword = $.trim($(".search_input").val());
            if (keyword == "") {
                $noResult.hide();
                $beforeSearch.show();
                return;
            } else {
            	//locationPrefix + "/search-input?keyword=" + keyword+"&fromdistributor="+distributorId;
                window.location.href = "/search-input?keyword=" + keyword;
                params.keyword = keyword;
            }
        });
    } else {
        loadData(true);
    }
})(jQuery);
		