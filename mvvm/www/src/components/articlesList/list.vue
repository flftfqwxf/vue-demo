<template>
    <div>
        <div v-if="is_expert==0">
            <span style="font-size: 32px">您的账号没有认证安全号，还不能发布文章</span>
        </div>
        <div v-if="is_expert==1">
            <div class="clearfix">
                <form action="" @submit.prevent="search">
                    <div class="form-group has-feedback fl">
                        <input type="text" class="form-control " v-model="keyword" placeholder="搜索您的文章">
                        <span class="fa fa-search form-control-feedback"></span>
                        <!-- <span class="gmIcon gm-plain form-control-feedback"></span> -->
                    </div>
                </form>
                <a v-link="{path:'article/add'}" class="btn btn-info fr btn-lg">发表文章</a>
            </div>
            <div>
                <ul class="sel-condition text-gray-dark" id="message_status">
                    <li>文章总数:{{totalCount}}</li>
                    <li class="{{sort==0 ? 'active' : ''}}" @click="switchMsg(0)">时间最近</li>
                    <li class="{{sort==1  ? 'active' : ''}}" @click="switchMsg(1)">被赞最多</li>
                    <li class="{{sort==2  ? 'active' : ''}}" @click="switchMsg(2)">评论最多</li>
                </ul>
                <div class="page-main">
                    <div class="news_item pic_and_txt_item" v-for="item in list">
                        <a v-link="{path:'/article/'+item.post_id}">
                            <template v-if="item.attachments.length>0">
                                <img alt="" :src="item.attachments[0].thumbnail">
                            </template>
                            <template v-else>
                                <img alt="" :src="defaultImg">
                            </template>
                        </a>
                        <div class="txt_info">
                            <p class="info_title">
                                <a v-link="{path:'/article/'+item.post_id}">{{item.post_title}}</a></p>
                            <span class="news_count">
                            <i class="fa fa-clock-o"></i> {{item.created_time}}
                            <i class="fa fa-eye"></i> {{item.view_count}}
                            <i class="fa fa-thumbs-o-up"></i> {{item.vote_count}}
                            <i class="fa fa-commenting-o"></i> {{item.comment_count}}
                        </span>
                            <span class="oper_wrap">
                            <i class="fa fa-edit" v-link="{path:'/article/editor/'+item.post_id}"></i>
                            <i class="fa fa-trash-o" @click="openDelete(item.post_title,item.post_id)"></i>
                        </span>
                        </div>
                    </div>
                    <div class="pagination" v-pagination="opts" v-show="isShow"></div>
                    <div class="emptylist-placeholder" v-show="isEmpty">
                        <i class="gm-icon gm-supposed"></i>
                        <p class="base-fontColor">抱歉，无相关数据!</p>
                    </div>
                </div>
            </div>
            <modal :show.sync="isDelete">
                <div slot="modal-header" class="modal-header">
                    <h4 class="modal-title">删除文章</h4>
                </div>
                <div slot="modal-body" class="modal-body">您确认要删除文章:《{{deleteTitle}}》吗?</div>
                <div slot="modal-footer" class="modal-footer">
                    <button type="button" class="btn btn-info" @click="deleteArticle(articleId)">删除</button>
                    <button type="button" class="btn btn-default" @click="isDelete = false">取消</button>
                </div>
            </modal>
        </div>
    </div>
</template>
<style lang="sass" scoped>
    @import "~www-pagination";
    @import "message.scss";
</style>
<script type="text/ecmascript-6">
    require('jquery')
    import pagination from "../pagination/pagination.js"
    const dataSource = '/api/website/users/articles'
    import modal from 'strap/Modal.vue'
    const pageSize = 5;
    export default {
        vuex: {
            getters: {
                is_expert: ({user})=> {
                    return user.userInfo.is_expert
                }
            }
        },
        components: {
            modal
        },
        data(){
            var _this = this;
            return {
                alertType: 'success',
                deleteMsg: '删除成功',
                isDelete: false,
                articleId: 0,
                deleteTitle: '',
                defaultImg: require('./noPic.png'),
                list: null,
                page: 1,
                unread: null,
                isShow: false,
                isEmpty: false,
                sort: 0,
                keyword: '',
                totalCount: 0,
                opts: {
                    pageSize: pageSize,
                    locator: 'data.list',
                    dataSource: dataSource + '?&_=' + Math.random(),
                    callback: this.showPage,
                    getTotalPageByResponse: function (data) {
                        this.rawData = data.data.list;
                        var pageCount = Math.floor(data.data.total_count / pageSize);
                        data.data.total_count % pageSize !== 0 && pageCount++;
                        _this.totalCount = data.data.total_count;
                        return pageCount
                    }
                }
            }
        },
        methods: {
            switchMsg: function (sort) {
                this.sort = sort;
                this.opts.dataSource = this.getUrl(this.sort, this.keyword);
            },
            showPage: function (data, pagination) {
                this.list = data;
                var url = this.$route.fullPath + '?page=' + pagination.pageNumber + '&sort=' + this.sort;
                url += '&keyword=' + this.keyword
                this.$router.go(url);
                this.list.length > 0 ? this.isEmpty = false : this.isEmpty = true
                this.list.length > 0 ? this.isShow = true : this.isShow = false
            },
            getUrl(sort = 0, keyword = ''){
                //获取URL时隐藏分页,避免在AJAX过程中分页效果 数据闪动情况
                this.isShow = false;
                let url = dataSource + '?_=' + Math.random();
                if (sort) {
                    url += '&sort=' + sort
                }
                if (keyword) {
                    url += '&keyword=' + keyword
                }
                return url;
            },
            search(){
                this.opts.dataSource = this.getUrl(this.sort, this.keyword);
            },
            openDelete(title, id){
                this.isDelete = true;
                this.deleteTitle = title;
                this.articleId = id;
            },
            deleteArticle(id){
                this.isDelete = false;
                var _this = this, alertOpts = {};
                this.$http.delete('/api/website/articles/destroy?post_id=' + id).then(function (res) {
                    if (res.ok && res.data) {
                        if (res.data.code == 1) {
                            alertOpts.alertType = 'success';
                            alertOpts.tipsMsg = res.data.data;
                            _this.search();
                        } else {
                            alertOpts.alertType = 'danger';
                            alertOpts.tipsMsg = '删除失败,错误信息:' + res.data.data;
                        }
                        _this.$dispatch('openTips', alertOpts)
                    }
                }, function (res) {
                    alertOpts.alertType = 'danger';
                    alertOpts.tipsMsg = '删除失败,请重试';
                    _this.$dispatch('openTips', alertOpts)
                })
            },
            edit(){
            }
        },
        created: function () {
            this.sort = Math.ceil(this.$route.query.sort) || 0
            this.keyword = this.$route.query.keyword || ""
            this.opts.dataSource = this.getUrl(this.sort, this.keyword);
        }
    }
</script>
