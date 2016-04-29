<template>
    <div class="row">
        <div class="col-md-12">
            <!--table-->
            <div class="row">
                <div class="col-md-12">
                    <div class="item" ms-controller="list">
                        <h4>表格样式
                            <small>标题提示文字4</small>
                        </h4>
                        <div class="item-main">
                            <table class="table table-bordered table-hover">
                                <thead>
                                <tr>
                                    <th>{{nav1}} Name</th>
                                    <th>Last Name</th>
                                    <th>全名</th>
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
                </div>
            </div>
            <!--table end-->
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
//    import {loadBreadCrumb} from '../../vuex/actions'
    export default {
        data () {
            return {
                list: null
            }
        },
        attached: function () {
            var _self=this;
            this.$http.get('/api/mvvm/list1.json',{name:"name1"}).then(function (res) {
                if (res.ok && res.data) {
                    _self.list =res.data.list;
                }
            }, function (res) {
//                alert(res)
            })
//            $.getJSON('/api/mvvm/list1.json',{name:"name1"}).done(function (data) {
//                if (data) {
//                    _self.list =data.list;
//                }
//            });
        },


    }
</script>


