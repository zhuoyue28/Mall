<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item @click="$router.go(-1)" class=" cursor-pointer">优惠券管理</a-breadcrumb-item>
            <a-breadcrumb-item @click="$router.go(-1)" class=" cursor-pointer">停车券</a-breadcrumb-item>
            <a-breadcrumb-item>
                {{ route.query.type == '1' ? '新建停车券' : route.query.type == '2' ? '编辑停车券' : '停车券详情' }}
            </a-breadcrumb-item>
        </a-breadcrumb>
        <!-- <div class='tableListHeaderClass'>
        </div> -->
        <div class='tableListContentClass'>

            <a-form :disabled="route.query.type == '3'" :model="data.formState" ref="formState" name="horizontal_login"
                autocomplete="off" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" style="max-width: 900px;">
                <a-form-item label="优惠券名称" name="title" :rules="[{ required: true, message: '请输入店铺名称!' }]">
                    <a-input v-model:value="data.formState.title" placeholder="请输入优惠券名称" />
                </a-form-item>
                <a-form-item  label="优惠券内容" name="price"
                    :rules="[{ required: true, message: '优惠券内容!' }]">
                    <div class="flex items-center">
                        减：<a-form-item-rest>
                            <a-input-number placeholder="请输入" v-model:value="data.formState.price" :min="0" addon-after="元" />
                        </a-form-item-rest>
                    </div>
                </a-form-item>
                <a-form-item label="有效期，领取后" name="day" :rules="[{ required: true, message: '请输入有效期!' }]">
                    <a-input-number placeholder="请输入" v-model:value="data.formState.day" :min="1"  addon-after="天" />
                </a-form-item>
                <a-form-item label="兑换所需积分" name="use_score" :rules="[{ required: true, message: '请输入有效期!' }]">
                    <a-input-number placeholder="请输入兑换所需积分" v-model:value="data.formState.use_score" :min="0" addon-after="积分" />
                </a-form-item>
                <a-form-item label="使用规则" name="use_rule" :rules="[{ required: true, validator: data.detailsValidator }]">
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
import { parkingAdd,parkingUpdate,parkingFindData} from '@/request/api/coupon'
import { storeList } from '@/request/api/storelist'
import { comUploadeFile } from "../../request/api/activity"
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

const route = useRoute()
const router = useRouter()
const formState = ref<FormInstance>()//表单 ref
const data = reactive({
    formState: {
        title: '',//停车券名称
        price: ref<null | number>(null),//减
        day :  ref<null | number>(null),//有效期
        use_score: ref<null | number>(null),//兑换所需积分
        use_rule: '',//使用规则
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
        // if (data.formState.store_id == null) data.formState.store_id = 0
        if (route.query.type == '2') {
            formState.value!.validate().then(() => {
                data.submitLoading = true;
                parkingUpdate({ ...data.formState, id: route.query.id }).then(res => {
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
            parkingAdd({ ...data.formState }).then(res => {
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
            parkingFindData({ id: route.query.id }).then(res => {
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
