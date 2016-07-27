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
<script>
    export default {
        data () {
            return {
                list: null
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