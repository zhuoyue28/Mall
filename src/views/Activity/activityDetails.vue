<template>
    <div class="tableListClass">
        <a-breadcrumb>
            <a-breadcrumb-item @click="() => {
                router.go(-1)
            }
                ">活动管理</a-breadcrumb-item>
            <a-breadcrumb-item>
                {{ route.query.type == '1' ? '添加活动' : '编辑活动' }}
            </a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tableListContentClass">
            <a-form :model="data.form" ref="formref" name="horizontal_login" autocomplete="off">
                <a-form-item label="活动名称" name="name" :rules="[{ required: true, message: '请输入活动名称' }]">
                    <a-input style="width: 288px;" v-model:value="data.form.name" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="活动时间" name="time" :rules="[{ required: true, message: '请选择活动时间' }]">
                    <a-range-picker :placeholder="['开始时间', '结束时间']" v-model:value="data.form.time"
                        :show-time="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss" />
                </a-form-item>

                <a-form-item label="活动封面图" name="cover" :rules="[{ required: true, message: '请上传活动封面图' }]">
                    <a-upload v-model:file-list="data.fileList" name="file" list-type="picture-card" class="avatar-uploader"
                        :show-upload-list="false" action="/zyapi/admin/com/uploadeFile" @change="methods.handleChange">
                        <img style="height: 100px;" v-if="data.form.cover" :src="data.form.cover" alt="avatar" />
                        <div v-else>
                            <loading-outlined v-if="data.uplogoLoading"></loading-outlined>
                            <plus-outlined v-else></plus-outlined>
                            <div class="ant-upload-text">上传</div>
                        </div>
                    </a-upload>
                </a-form-item>
                <a-form-item label="活动轮播图" name="banner" :rules="[{ required: true, message: '请上传活动轮播图' }]">
                    <div class="max-w-[30%]">
                        <a-upload v-model:file-list="data.bannerfileList" name="file" list-type="picture"
                            class="upload-list-inline" :show-upload-list="true" action="/zyapi/admin/com/uploadeFile"
                            @change="methods.bannerhandleChange">
                            <a-button class="flex items-center">
                                <upload-outlined></upload-outlined>
                                上传
                            </a-button>
                        </a-upload>
                    </div>
                </a-form-item>
                <!-- 选择优惠券 -->
                <a-form-item label="选择优惠券" name="coupon_id" :rules="[{ required: true, message: '请选择优惠券' }]">
                    <a-select style="width: 288px;" v-model:value="data.form.coupon_id" placeholder="请选择" mode="multiple">
                        <a-select-option v-for="item in  data.couponList " :key="item.id" :value="item.id">{{ item.name
                        }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="活动详情" name="details" :rules="[{ required: true, validator: data.detailsValidator }]">
                    <div style="border: 1px solid #ccc;width: 900px;z-index: 10;">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                            mode="default" />
                        <Editor style="height: 500px; overflow-y: hidden;" v-model="data.form.details"
                            :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
                    </div>
                </a-form-item>
                <a-form-item>
                    <div class="pl-[100px] flex items-center">
                        <a-button class="mr-[24px]" type="primary" @click="methods.submit" :loading="data.submitLoading">提
                            交</a-button>
                        <a-button type="default" @click="() => { router.go(-1) }">取 消</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { UploadProps, UploadChangeParam } from 'ant-design-vue'
import { reactive, ref, onBeforeUnmount, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import type { FormInstance } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { comUploadeFile, activityAddOrEdit, activityDetails } from "../../request/api/activity"
import { couponList } from "../../request/api/coupon"

const route = useRoute()
const router = useRouter()
const formref = ref<FormInstance>();

const data = reactive({
    form: {
        name: '',
        time: ref<[Dayjs, Dayjs]>(),
        cover: '',
        details: '',
        banner: '',
        coupon_id: []
    },
    fileList: ref<UploadProps['fileList']>([]),
    bannerfileList: ref<UploadProps['fileList']>([]),
    uplogoLoading: false,
    banneruplogoLoading: false,
    detailsValidator: (rule: any, value: any, callback: any) => {
        if (value == '' || value == '<p><br></p>' || value == '<p></p>') {
            callback(new Error('请输入活动详情'))
        } else {
            callback()
        }
    },
    submitLoading: false,
    couponList: ref<any[]>([])
})

const methods = reactive({
    submit() {
        formref.value?.validate().then(() => {
            data.submitLoading = true
            let params = {
                name: data.form.name,
                start_time: dayjs(data.form.time?.[0]).format('YYYY-MM-DD HH:mm:ss'),
                end_time: dayjs(data.form.time?.[1]).format('YYYY-MM-DD HH:mm:ss'),
                cover: data.form.cover,
                banner: data.form.banner,
                details: data.form.details,
                coupon_id: data.form.coupon_id.join(',')
            }
            if (route.query.type == '1') {//添加
                activityAddOrEdit({ ...params }).then(res => {
                    if (res.code == 200) {
                        message.success('添加成功')
                        router.go(-1)
                        data.submitLoading = false
                    } else {
                        data.submitLoading = false
                    }
                }).catch(() => {
                    data.submitLoading = false
                })
            } else {
                activityAddOrEdit({ ...params, activity_id: route.query.id }).then(res => {
                    if (res.code == 200) {
                        message.success('编辑成功')
                        router.go(-1)
                        data.submitLoading = false
                    } else {
                        data.submitLoading = false
                    }
                }).catch(() => {
                    data.submitLoading = false
                })
            }
        }).catch(() => {
            console.log('error')
        })
    },
    handleChange(info: UploadChangeParam) {
        if (info.file.status === 'uploading') {
            data.uplogoLoading = true
            return
        }
        if (info.file.status === 'done') {
            data.uplogoLoading = false
            data.form.cover = info.file.response.data.path
            message.success('上传成功')
        }
    },
    bannerhandleChange(info: UploadChangeParam) {
        console.log(info, 'info');
        if (info.file.status === "removed") {
            data.form.banner = info.fileList.map((item: any) => item.response.data.path).join(',')
            console.log(data.form.banner, 'data.form.banner');
            message.success('删除成功')
            return
        }

        if (info.file.status === 'uploading') {
            return
        }
        if (info.file.status === 'done') {
            data.banneruplogoLoading = false
            data.form.banner = info.fileList.map((item: any) => item.response.data.path).join(',')
            console.log(data.form.banner, 'data.form.banner');
            message.success('上传成功')
        }
    },
})


type InsertFnType = (url: string, alt: string, href: string) => void
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

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



// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}


onMounted(() => {
    couponList({ page: 1, limit: 9999, source: 1, price: 1, type: '1,2,3' }).then(res => {
        if (res.code == 200) {
            data.couponList = res.data.data
        }
    })

    if (route.query.type != '1') {
        activityDetails({ activity_id: route.query.id }).then(res => {
            if (res.code == 200) {
                data.form.name = res.data.name
                data.form.time = [dayjs(res.data.start_time, 'YYYY/MM/DD'), dayjs(res.data.end_time, 'YYYY/MM/DD')]
                data.form.cover = res.data.cover
                let banner = res.data.banner
                let banner2: any = []
                banner.forEach((item: any) => {
                    banner2.push({
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: item,
                    })
                })
                data.bannerfileList = banner2
                data.form.banner = res.data.banner.join(',')
                data.form.details = res.data.details
                data.form.coupon_id = res.data.coupon_id
                data.fileList = [{
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: res.data.cover,
                }]
            }
        })
    }
})

</script>
<style lang="scss" scoped></style>
