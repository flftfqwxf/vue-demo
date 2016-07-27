<template>
    <div>
        <ul class="sel-condition text-gray-dark" id="message_status">
            <li class="{{opts.messageType=='' ? 'active' : ''}}" @click="switchMsg('')">全部消息<span>{{unread && unread.total}}</span></li>
            <li class="{{opts.messageType=='ORDER' ? 'active' : ''}}" @click="switchMsg('ORDER')">订单消息<span>{{unread &&unread.order}}</span></li>
            <li class="{{opts.messageType=='FINANCE' ? 'active' : ''}}" @click="switchMsg('FINANCE')">财务消息<span>{{unread &&unread.finance}}</span></li>
            <li class="{{opts.messageType=='SYSTEM'  ? 'active' : ''}}" @click="switchMsg('SYSTEM')">系统消息<span>{{unread &&unread.system}}</span></li>
        </ul>
        <div class="page-main">
            <ul class="mes_list">
                <li v-for="item in receiveList " class="mes_list_item {{item.read ? 'read' :'unread'}}">
                    <table>
                        <tr>
                            <td class="mes_icon"><i class="gm-icon gm-order-manage {{item.messageType==='order' ? 'mes_order' : item.messageType==='system' ? 'mes_admin' :'mes_money'}}"></i></td>
                            <td class="mes_info">
                                <div class="mes_title"><span class="mes_type">{{item.messageTypeValue}}</span>
                                    <span class="mes_time">{{item.msgTime}}</span></div>
                                <div class="mes_info">{{{item.message}}}</div>
                            </td>
                        </tr>
                    </table>
                </li>
            </ul>
            <div class="pagination" v-pagination="opts" v-show="isShow"></div>
            <div class="emptylist-placeholder" v-show="isEmpty">
                <i class="gm-icon gm-supposed"></i>
                <p class="base-fontColor">抱歉，无相关数据!</p>

            </div>
        </div>
    </div>
</template>
<style>
    @import "~pagination";
    @import "../../../../../common/module/message/css/message.css";
</style>
<script type="text/ecmascript-6">

    import pagination from "../pagination/pagination.js"
    import Dialog from "../common/dialog/dialog.vue"
    let url='/message/received.json'
    export default {
//        components:{
//            GridColumn: require('vue-desktop/lib/data/grid-column.vue'),
//            Grid: require('vue-desktop/lib/data/grid.vue')
//        },
        data(){
            return {
                receiveList : null,
                page: 1,
                unread: null,
                isShow:false,
                isEmpty:false,
                opts: {
                    locator:'receiveList',
                    url: url+'?messageType=' + '&_=' + Math.random(),
                    messageType: "",
                    callback: this.setunread
                }
            }
        },
        methods: {
            switchMsg: function (messageType) {
                this.opts.url = url+'?messageType=' + messageType + '&_=' + Math.random();
                this.opts.messageType = messageType;
            },
            setunread: function (data,pagination) {
                this.receiveList  = data.receiveList;
                this.unread = data.unread
                this.$router.go(this.$route.fullPath + '?page=' + pagination.pageNumber+'&messageType='+this.opts.messageType);
                this.receiveList.length>0 ?this.isEmpty=false :this.isEmpty=true
                this.receiveList.length>0 ?this.isShow=true :this.isShow=false
            }
        },
       created: function () {
           let pageurl=url+'?_=' + Math.random();
           let messageType=this.$route.query.messageType
           if (messageType) {
               pageurl+='&messageType='+messageType
               this.opts.url=pageurl;
               this.opts.messageType=messageType
           }
       }
    }
</script>
