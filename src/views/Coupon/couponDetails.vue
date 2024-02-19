<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item @click="$router.go(-1)" class=" cursor-pointer">优惠券管理</a-breadcrumb-item>
            <a-breadcrumb-item @click="$router.go(-1)" class=" cursor-pointer">优惠券</a-breadcrumb-item>
            <a-breadcrumb-item>
                {{ route.query.type == '1' ? '新建商家劵' : route.query.type == '2' ? '编辑商家劵' : '优惠券详情' }}
            </a-breadcrumb-item>
        </a-breadcrumb>
        <!-- <div class='tableListHeaderClass'>
        </div> -->
        <div class='tableListContentClass'>

            <a-form :disabled="route.query.type == '3'" :model="data.formState" ref="formState" name="horizontal_login"
                autocomplete="off" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" style="max-width: 900px;">

                <a-form-item label="优惠券类型" name="type">
                    <a-radio-group v-model:value="data.formState.type" name="radioGroup">
                        <a-radio :value="1">满减劵</a-radio>
                        <a-radio :value="2">代金劵</a-radio>
                    </a-radio-group>
                </a-form-item>


                <a-form-item v-if="data.formState.type == 1" label="优惠券内容" name="full"
                    :rules="[{ required: true, message: '优惠券内容!' }]">
                    <div class="flex items-center">
                        满：<a-input-number v-model:value="data.formState.full" :min="0" addon-after="元" />
                        <span class="ml-[10px]">，</span>
                        减：<a-form-item-rest>
                            <a-input-number v-model:value="data.formState.reduce" :min="0" addon-after="元" />
                        </a-form-item-rest>
                    </div>
                </a-form-item>

                <a-form-item v-if="data.formState.type == 2" label="优惠券内容" name="reduce"
                    :rules="[{ required: true, message: '请输入优惠劵内容!' }]">
                    <div class="flex items-center">
                        代：<a-input-number v-model:value="data.formState.reduce" :min="0" addon-after="元" />
                    </div>                    
                </a-form-item>

                <!-- <a-form-item v-if="data.formState.type == 3" label="优惠券内容" name="full"
                    :rules="[{ required: true, message: '请输入优惠劵内容!' }]">
                    <div class="flex items-center">
                        <a-input-number v-model:value="data.formState.full" :min="0" addon-after="元" />
                        <span class="ml-[10px]">，</span>
                        团：
                        <a-form-item-rest>
                            <a-input-number v-model:value="data.formState.reduce" :min="0" addon-after="元" />
                        </a-form-item-rest>
                    </div>
                </a-form-item> -->


                <a-form-item label="店铺" name="join_store">
                    <a-radio-group v-model:value="data.formState.join_store" name="radioGroup">
                        <!-- <a-radio :value="0">全部</a-radio> -->
                        <a-radio :value="1">指定商家</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item v-if="data.formState.join_store == 1" label="选择店铺" name="store_id"
                    :rules="[{ required: true, message: '请选择店铺!' }]">
                    <a-select v-model:value="data.formState.store_id" placeholder="请选择店铺">
                        <a-select-option v-for="item in data.storeList" :key="item.id" :value="item.id">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="优惠券名称" name="name" :rules="[{ required: true, message: '请输入店铺名称!' }]">
                    <a-input v-model:value="data.formState.name" />
                </a-form-item>

                <a-form-item label="优惠券价格" name="price" :rules="[{ required: true, message: '请输入店铺价格!' }]">
                    <a-input-number v-model:value="data.formState.price" :min="1" :max="100" addon-after="元" />
                </a-form-item>

                <a-form-item label="有效期，领取后" name="valid_day" :rules="[{ required: true, message: '请输入有效期!' }]">
                    <a-input-number v-model:value="data.formState.valid_day" :min="1" :max="100" addon-after="天" />
                </a-form-item>

                <!-- 优惠券介绍 -->
                <!-- <a-form-item label="优惠券介绍" name="intro" :rules="[{ required: true, message: '请输入优惠券介绍!' }]">
                    <a-textarea v-model:value="data.formState.intro" />
                </a-form-item> -->

                <a-form-item label="优惠券分成" name="platform_rebate" :rules="[{ required: true, message: '请完整填写优惠劵分成' }]">
                    <div class="flex items-center">
                        店铺：<a-input-number v-model:value="data.formState.store_rebate" :min="1" :max="100" addon-after="%"
                            @change="methods.store_rebateChange" />
                        <span class="ml-[10px]">，</span>
                        平台：<a-form-item-rest>
                            <a-input-number :disabled="true" v-model:value="data.formState.platform_rebate" :min="1"
                                :max="100" addon-after="%" />
                        </a-form-item-rest>
                    </div>
                </a-form-item>

                <!-- 使用规则 -->
                <!-- <a-form-item label="优惠券规则" name="use_rule" :rules="[{ required: true, message: '请输入优惠券规则!' }]">
                    <a-textarea v-model:value="data.formState.use_rule" />
                </a-form-item> -->

                <a-form-item label="优惠券规则" name="use_rule" :rules="[{ required: true, validator: data.detailsValidator }]">
                    <div style="border: 1px solid #ccc;width: 900px;z-index: 10;">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                            mode="default" />
                        <Editor style="height: 500px; overflow-y: hidden;" v-model="data.formState.use_rule"
                            :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
                    </div>
                </a-form-item>

                <a-form-item class="pl-[100px]">
                    <a-button type="primary" @click="methods.submit" class="mr-[20px]" :loading="data.submitLoading">提
                        交</a-button>
                    <a-form-item-rest>
                        <a-button type="default" @click="methods.cancel">取 消</a-button>
                    </a-form-item-rest>
                </a-form-item>
            </a-form>

            <div class="pl-[100px]" v-if="route.query.type == '3'">
                <a-button type="default" @click="methods.cancel">返 回</a-button>
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref, shallowRef } from 'vue'
import { message, type FormInstance } from 'ant-design-vue';
import { couponAdd, couponDetails, couponEdit } from '@/request/api/coupon'
import { storeList } from '@/request/api/storelist'
import { comUploadeFile } from "../../request/api/activity"
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

const route = useRoute()
const router = useRouter()
const formState = ref<FormInstance>()//表单 ref

const data = reactive({
    formState: {
        type: 1,//优惠券类型
        full: ref<null | number>(null),//满
        reduce: ref<null | number>(null),//减
        join_store: 1,//店铺
        name: '',//优惠券名称
        price: ref<null | number>(null),//优惠券价格
        valid_day: ref<null | number>(null),//有效期
        intro: '',//优惠券介绍
        platform_rebate: ref<null | number>(null),//优惠券分成
        use_rule: '',//使用规则
        store_rebate: ref<null | number>(null),//店铺分成
        store_id: ref<any>(null),//店铺id
    },
    submitLoading: false,//提交loading
    storeList: ref<any>([]),//店铺列表
    detailsValidator: (rule: any, value: any) => {
        if (value == '' || value == '<p><br></p>' || value == '<p></p>') {
            return Promise.reject('请输入规则详情')
        } else {
            return Promise.resolve();
        }
    },
})

const methods = {
    submit() {//提交
        if (route.query.type == '3') return
        if (data.formState.store_id == null) data.formState.store_id = 0
        if (data.formState.type == 2) data.formState.full = null
        if (route.query.type == '2') {
            formState.value!.validate().then(() => {
                data.submitLoading = true;
                couponEdit({ ...data.formState, coupon_id: route.query.id, source: 2 }).then(res => {
                    console.log(res, 'res');
                    if (res.code == 200) {
                        message.success('编辑成功')
                        router.go(-1)
                    } else {
                        data.submitLoading = false;
                    }
                })
            })

            return
        }
        formState.value!.validate().then(() => {//验证表单
            data.submitLoading = true;
            couponAdd({ ...data.formState, source: 2 }).then(res => {
                console.log(res, 'res');
                if (res.code == 200) {
                    message.success('添加成功')
                    router.go(-1)
                } else {
                    data.submitLoading = false;
                }
            })
        })
    },
    cancel() {//取消
        router.go(-1)
    },
    handlePreview(file: any) {//预览图片
        console.log(file, 'file');
    },
    getDetails() {//获取详情
        if (route.query.type == '2' || route.query.type == '3') {
            couponDetails({ coupon_id: route.query.id }).then(res => {
                console.log(res, 'res');
                if (res.code == 200) {
                    data.formState = res.data
                }
            })
        } else {
            return
        }
    },
    getStoreList() {//获取店铺列表
        storeList({ page: 1, limit: 9999 }).then(res => {
            console.log(res, 'res店铺');
            if (res.code == 200) {
                data.storeList = res.data.data
            }
        })
    },
    store_rebateChange() {//店铺分成自动补全
        data.formState.platform_rebate = 100 - (data.formState.store_rebate ? data.formState.store_rebate : 0)
    }
}

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

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}


methods.getDetails()//获取详情
methods.getStoreList()//获取店铺列表

</script>
<style lang='scss' scoped></style>