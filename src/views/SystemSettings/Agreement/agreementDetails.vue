<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item @click="router.go(-1)" class=" cursor-pointer">轮播图管理</a-breadcrumb-item>
            <a-breadcrumb-item>
                {{ route.query.type == '1' ? '添加协议' : route.query.type == '2' ? '编辑协议' : '协议详情' }}
            </a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListContentClass'>

            <a-form :model="data.formData" ref="formHeader" name="horizontal_login" autocomplete="off" style="width: 700px;"
                :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">

                <a-form-item label="协议详情" name="details" :rules="[{ required: true, validator: data.detailsValidator }]">
                    <div style="border: 1px solid #ccc;width: 900px;z-index: 10;">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                            mode="default" />
                        <Editor style="height: 500px; overflow-y: hidden;" v-model="data.formData.text"
                            :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
                    </div>
                </a-form-item>


                <a-form-item>
                    <a-button class="ml-[120px]" type="primary" :disabled="route.query.type == '3'" @click="methods.submit"
                        :loading="data.submitLoading">提
                        交</a-button>
                    <a-button class="ml-[24px]" type="default" @click="methods.goback">返 回</a-button>
                </a-form-item>

            </a-form>

        </div>
    </div>
</template>
<script lang='ts' setup>
import { reactive, ref, onBeforeUnmount, shallowRef } from 'vue'
import { onMounted } from 'vue'
import { AgreementFindData, AgreementUpdate, BannerAdd } from '../../../request/api/banner'
import { comUploadeFile } from "../../../request/api/activity"
import { useRouter, useRoute } from 'vue-router';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

const formHeader = ref<FormInstance>()
const router = useRouter()
const route = useRoute()

// 变量
const data = reactive({
    formData: {
        text: ''
    },
    detailsValidator: (rule: any, value: any, callback: any) => {
        if (value == '' || value == '<p><br></p>' || value == '<p></p>') {
            callback(new Error('请输入协议详情'))
        } else {
            callback()
        }
    },
    submitLoading: false,

})

// 方法
const methods = reactive({
    submit() {
        formHeader.value?.validate().then(() => {
            // console.log(data.formData, 'data.formData');
            data.submitLoading = true
            if (route.query.type == '1') {
                BannerAdd(data.formData).then((res: any) => {
                    if (res.code == 200) {
                        message.success('添加成功')
                        data.submitLoading = false
                        router.go(-1)
                    } else {
                        data.submitLoading = false
                    }

                }).catch(() => {
                    data.submitLoading = false
                })
            } else {
                AgreementUpdate({ ...data.formData, id: route.query.id }).then((res: any) => {
                    if (res.code == 200) {
                        message.success('修改成功')
                        data.submitLoading = false
                        router.go(-1)
                    } else {
                        data.submitLoading = false
                    }

                }).catch(() => {
                    data.submitLoading = false
                })
            }
        }).catch(() => {
            message.error('请完善信息')
        })
    },

    goback() {
        router.go(-1)
    },
    getDetails() {
        AgreementFindData({ id: route.query.id }).then(res => {
            if (res.code == 200) {
                console.log(res.data, 'res.data--------');
                data.formData = {
                    text: res.data.text
                }
            }
        })
    }
})

type InsertFnType = (url: string, alt: string, href: string) => void
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const toolbarConfig = {}

// 编辑器配置
const editorConfig = { // TS 语法
    placeholder: '请输入内容...',
    readOnly: route.query.type == '3' ? true : false,
    MENU_CONF: {
        // 配置上传图片
        uploadImage: {
            async customUpload(file: File, insertFn: InsertFnType) { // TS 语法
                // async customUpload(file, insertFn) { // JS 语法
                // file 即选中的文件
                // 自己实现上传，并得到图片 url alt href
                // 最后插入图片
                // insertFn(url, alt, href)
                const formData = await new FormData()
                formData.append('file', file)
                comUploadeFile(formData).then(res => {
                    insertFn(res.data.path, '', '')
                })
            }
        },
        // 配置上传视频
        uploadVideo: {
            async customUpload(file: File, insertFn: InsertFnType) { // TS 语法
                // async customUpload(file, insertFn) { // JS 语法
                // file 即选中的文件
                // 自己实现上传，并得到图片 url alt href
                // 最后插入图片
                // insertFn(url, alt, href)
                const formData = await new FormData()
                formData.append('file', file)
                comUploadeFile(formData).then(res => {
                    insertFn(res.data.path, '', '')
                })
            }
        },
    },
}



// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}


// 生命周期
onMounted(() => {
    if (route.query.type == '2' || route.query.type == '3') {
        methods.getDetails()
    }
})


</script>
<style lang='scss' scoped></style>