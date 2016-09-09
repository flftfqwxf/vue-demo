<template>
    <div style="height: 100%;">
        <validator name="validation1">
            <form id="formId" novalidate>
                <div class="item-main">
                    <div class="form-group post_btn">
                        <button class="btn btn-info fr btn-lg" @click.prevent="validateLogin">发表文章</button>
                    </div>
                    <div class="errors">
                        <div v-if="$validation1.title.required" class="alert alert-danger alert-dismissible" role="alert">
                            <i class="fa fa-times-circle"></i>
                            请输入标题
                        </div>
                        <div v-if="$validation1.topics.required" class="alert alert-danger alert-dismissible" role="alert">
                            <i class="fa fa-times-circle"></i>
                            请输入话题
                        </div>
                        <div v-if="$validation1.content.required" class="alert alert-danger alert-dismissible" role="alert">
                            <i class="fa fa-times-circle"></i>
                            请输入内容
                        </div>
                        <div v-if="postError && !$validation1.title.required && !$validation1.content.required && !$validation1.topics.required"
                             class="alert alert-danger alert-dismissible" role="alert">
                            <i class="fa fa-times-circle"></i>
                            {{postError}}
                        </div>
                    </div>
                    <div class="form-group has-feedback">
                        <input type="text" v-validate:title="['required']" v-model="formData.post_title" initial="off" placeholder="请输入文章标题,最多30个字符"
                               maxlength="30"
                               class="form-control input-lg post_title">
                        <span class="form-control-feedback">{{curNum}}/30</span>
                    </div>
                    <div class="form-group select_wrap">
                        <input type="hidden" v-validate:topics="['required']" v-model="formData.topics" initial="off">
                        <multiselect :options="selectOpts"
                                     :selected="selected"
                                     :multiple="true"
                                     :searchable="searchable"
                                     @search-change="asyncFind"
                                     :max="5"
                                     @tag="addTag"
                                     @update="updateSelected"
                                     placeholder="请输入话题,最多5个"
                                     label="topic_name"
                                     key="topic_name"
                                     :taggable="true"
                                     select-label="请选择话题"
                                     selected-label="已选择此话题"
                                     deselect-label="删除此话题"
                                     tag-placeholder=""
                        >
                            <span slot="maxElements">
                                最多只能输入5个话题
                            </span>
                        </multiselect>
                    </div>
                    <div class="form-group" style="height: 500px">
                        <input type="hidden" v-validate:content="['required']" v-model="formData.post_content" initial="off">
                        <ueditor :height="height" v-if="isInit" @ueditor-blur="ueditorBlur" :limit="5" :file-names.sync="fileNames" :options="options"
                                 upload-container="qnupload-container" v-ref:ueditor></ueditor>
                    </div>
                </div>
            </form>
        </validator>
    </div>
</template>
<style lang="sass">
    @import "article.scss";
</style>
<script>
    import Multiselect from 'vue-multiselect'
    import ueditor from '../../components/ueditor/ueditor.vue'
    import {addArticle} from '../../vuex/actions'
    require('jquery')
    //    window.UEDITOR_HOME_URL='/www/src/components/ueditor/ueditor-1.4.3.3/dist/utf8-php'
    export default {

        data() {
            return {
                selected: [],
                isLoading: false,
                searchable: true,
//                selectOpts: [],
                selectOpts: [],
                selectedCountries: [],
                isInit: false,
                formData: {
                    topics: '',
                    post_content: '',
                    post_title: ''
                },
                postError: '',
                options: {
                    uptoken: '',
                    maximumWords: 10000,//最多字符数
                    enableContextMenu: false
                    //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的重新定义
                    , toolbars: [[
                        // 'fullscreen', 'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'strikethrough', 'blockquote', 'hstyle', 'insertorderedlist', 'insertunorderedlist',
                        'link', 'horizontal', '|',
                        'insertimage', 'removeFormat'
                    ]]
                }, height: '400px'
            }
        },
        components: {
            Multiselect,
            ueditor
        },
        vuex: {
            actions: {
                addArticle
            },
            getters:{
                is_expert: ({user})=> {
                    return user.userInfo.is_expert
                }
            }

        },
        beforeDestroy(){
//            this.$refs.ueditor
        },
        ready: function () {
            var _this = this;
            //获取七牛上传 token
            this.$http.get('/api/website/articles/uptoken').then(function (res) {
                if (res.ok && res.data) {
                    _this.options.uptoken = res.data.data;
//                    console.log(_this.options.uptoken)
                    _this.isInit = true;
                }
            }, function (res) {
                alert('请求错误')
            })
        },
        methods: {
            ueditorBlur(editor){
                this.formData.post_content = editor.getContent();
            },
            updateSelected (newSelected) {
                this.selected = newSelected;
//                this.formData.topics=;
                this.asyncTopics();
            },
            asyncTopics(){
                var topics = [];
                this.selected.map((item, index)=> {
                    topics.push(item.topic_name)
                })
                this.formData.topics = topics.join(';')
            },
            asyncFind(query) {
                if (query.length === 0) {
                    this.selectOpts = [];
                    return false;
                } else {
                    this.isLoading = true
                    this.$http.get('/api/website/topics/list?keyword', {
                        keyword: query
                    }).then(resp => {
                        this.isLoading = false
                        this.selectOpts = resp.data.data
                    })
                }
            },
            addTag (newTag) {
                const tag = {
                    topic_name: newTag
                    // Just for example needs as we use Array of Objects that should have other properties filled.
                    // For primitive values you can simply push the tag into options and selected arrays.
                }
                this.selectOpts.push(tag)
                this.selected.push(tag)
                this.asyncTopics();
            },
            validateLogin: function () {
                var self = this;
                this.formData.post_content = $.trim(this.$refs.ueditor.getContent())
                this.$validate(true, function (e) {
                    if (self.$validation1.valid) {
                        self.addArticle(self.formData, self)
                    }
                })
//                console.log(this.$validation1)
            }
        }
    }
</script>
