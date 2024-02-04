<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>积分管理</a-breadcrumb-item>
            <a-breadcrumb-item>积分设置</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListContentClass'>

            <a-form :model="data.formData" ref="formHeader" name="horizontal_login" autocomplete="off"
                style="width: 1000px;" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <div class=" text-[16px] font-[600] mb-[24px]"> 停车缴费(根据用户停车实缴金额积分)</div>
                <a-form-item label="发放规则" name="car_price" :rules="[{ required: true, message: '请填写完整发放规则' }]">
                    <div class="flex items-center">
                        用户每消费：<a-input-number v-model:value="data.formData.car_price" :min="1" addon-after="元" />
                        <span class="ml-[10px]">，</span>
                        将获得：<a-form-item-rest>
                            <a-input-number v-model:value="data.formData.car_score" :min="1" addon-after="积分" />
                        </a-form-item-rest>
                    </div>
                </a-form-item>
                <div class=" text-[16px] font-[600] mb-[24px]"> 优惠券使用(根据用户优惠券购买金额积分)</div>
                <a-form-item label="发放规则" name="coupon_price" :rules="[{ required: true, message: '请填写完整发放规则' }]">
                    <div class="flex items-center">
                        用户每消费：<a-input-number v-model:value="data.formData.coupon_price" :min="1" addon-after="元" />
                        <span class="ml-[10px]">，</span>
                        将获得：<a-form-item-rest>
                            <a-input-number v-model:value="data.formData.coupon_score" :min="1" addon-after="积分" />
                        </a-form-item-rest>
                    </div>
                </a-form-item>

                <a-form-item label="积分说明规则" name="score_rule" :rules="[{ required: true, validator: data.detailsValidator }]">
                    <div style="border: 1px solid #ccc;width: 900px;z-index: 10;">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                            mode="default" />
                        <Editor style="height: 500px; overflow-y: hidden;" v-model="data.formData.score_rule"
                            :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
                    </div>
                </a-form-item>

                <a-form-item label="自助积分规格" name="self_score_rule"
                    :rules="[{ required: true, validator: data.detailsValidator }]">
                    <div style="border: 1px solid #ccc;width: 900px;z-index: 10;">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef2" :defaultConfig="toolbarConfig"
                            mode="default" />
                        <Editor style="height: 500px; overflow-y: hidden;" v-model="data.formData.self_score_rule"
                            :defaultConfig="editorConfig2" mode="default" @onCreated="handleCreated2" />
                    </div>
                </a-form-item>

                <a-form-item>
                    <div class="w-full flex">
                        <div class="flex-[6]"></div>
                        <div class="flex-[18]">
                            <a-button class="" type="primary"  @click="methods.submit"
                                :loading="data.submitLoading">提 交</a-button>
                        </div>
                    </div>
                </a-form-item>

            </a-form>

        </div>
    </div>
</template>
<script lang='ts' setup>
import { reactive, ref, onBeforeUnmount, shallowRef } from 'vue'
import { onMounted } from 'vue'
import { ScoreAdd, ScoreFindData } from '../../request/api/Score'
import { comUploadeFile } from "../../request/api/activity"
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
        score_rule: '',
        car_price: '',
        car_score: '',
        coupon_price: '',
        coupon_score: '',
        self_score_rule: '',
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
            // 只有编辑一种情况
            ScoreAdd(data.formData).then((res: any) => {
                if (res.code == 200) {
                    message.success('编辑成功')
                    data.submitLoading = false
                    methods.getDetails()
                } else {
                    data.submitLoading = false
                }
            }).catch(() => {
                data.submitLoading = false
            })
        })

    },

    goback() {
        router.go(-1)
    },
    getDetails() {
        ScoreFindData({ id: route.query.id }).then(res => {
            if (res.code == 200) {
                data.formData = res.data
                console.log(data.formData, 'data.formData!!!!!!!!!!!!!!!!!!!');
            }
        })
    }

})

type InsertFnType = (url: string, alt: string, href: string) => void
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const editorRef2 = shallowRef()

const toolbarConfig = {}

// 编辑器配置
const editorConfig = { // TS 语法
    placeholder: '请输入内容...',
    readOnly: false,
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

// 编辑器配置
const editorConfig2 = { // TS 语法
    placeholder: '请输入内容...',
    readOnly: false,
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
    const editor2 = editorRef2.value
    if (editor == null) {
        console.log(1);
    } else {
        editor.destroy()
    }
    if (editor2 == null) {
        console.log(2);
    } else {
        editor2.destroy()
    }

})

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
const handleCreated2 = (editor: any) => {
    editorRef2.value = editor // 记录 editor 实例，重要！
}



// 生命周期
onMounted(() => {
    methods.getDetails()
})


</script>
<style lang='scss' scoped></style>