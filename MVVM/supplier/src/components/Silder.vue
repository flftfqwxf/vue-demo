<template>
    <div class="page-sidebar">
        <a href="index.html" class="logo"></a>
        <ul class="nav" id="nav">
            <li>
                <a v-link="{path:nav.path}" v-for="nav in navList">
                    <i class="gm-icon gm-peer-plan"></i>
                    <span>{{nav.navName}}</span>
                    <span class="label label-info pull-right" data-toggle="tooltip" data-placement="right" data-original-title="中文中文那种爱上空间等哈说肯定会阿卡还是啊">3</span>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      navList: '出团计划1'
    }
  },
    ready:function() {
        var _self=this;
        $.getJSON('/page/product/a.json').done(function (data) {
            if (data) {
                _self.navList =data.navList;
            }
        });
    }
}
</script>