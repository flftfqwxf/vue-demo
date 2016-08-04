<template>
    <div class="page-sidebar">
        <a href="index.html" class="logo"></a>
        <ul class="nav" id="nav">
            <li v-link="{path:nav.path,activeClass: 'open' ,exact: true }" v-for="nav in navList">
                <a href="{{nav.path}}">
                    <i class="gm-icon gm-peer-plan"></i>
                    <span>{{nav.navName}}</span>
                    <span class="label label-info pull-right" data-toggle="tooltip" data-placement="right" data-original-title="中文中文那种爱上空间等哈说肯定会阿卡还是啊">3</span>
                </a>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import {loadTop} from "../vuex/actions"
    export default {

        vuex: {
            getters: {
                navList: state=>state.navList,
                filteredMessages: state => {
                    return state.navList.filter(navList => {
                        console.log(33)
                        return navList
                    })
                }
            },
            actions:{
                loadTop
            }
        },

        // data () {
        //     return {
        //         // note: changing this line won't causes changes
        //         // with hot-reload because the reloaded component
        //         // preserves its current state and we are modifying
        //         // its initial state.
        //         navList: '出团计划1'
        //     }
        // },
        ready:function() {
            var _self=this;
            this.loadTop()
        }
    }
</script>