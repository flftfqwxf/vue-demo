<template>
    <div class="row">
        <div class="col-md-12">
            <!--table-->
            <div class="row">
                <div class="col-md-12">
                    <div class="item" ms-controller="list">
                        <h4>表格样式33
                            <small>标题提示文字334</small>
                        </h4>
                        <div class="item-main">
                            <table class="table table-bordered table-hover">
                                <thead>
                                <tr>
                                    <th>{{nav1}} Name2</th>
                                    <th>Last Name2</th>
                                    <th>全名2</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="name in list">
                                    <td>{{name.firstName}}</td>
                                    <td>{{name.lastName}}</td>
                                    <td>{{name.fullName}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="pagination" v-pagination url="/api/mvvm/list2.json" page="1"></div>
                </div>
            </div>
            <!--table end-->
        </div>
    </div>
</template>
<style>
    /*使用别名引用CSS，必须在最开头加上【~】标识*/
    @import "~pagination";
    /*@import "../../../../../common/plugins/pagination/pagination.scss";*/
</style>
<script>
    import pagination from "../pagination/pagination.js"
//    import {loadBreadCrumb} from "../../vuex/actions"
    export default {
        data () {
            return {
                list: null,
                page:2
            }
        },
//        attached:function() {
////            this.loadBreadCrumb('list2')
//        }
//        ,
//        vuex:{
//            actions:{
//                loadBreadCrumb
//            }
//        }
    }
</script>