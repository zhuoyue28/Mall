<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item @click="$router.go(-1)" class=" cursor-pointer">店铺管理</a-breadcrumb-item>
            <a-breadcrumb-item>
                {{ route.query.type == '1' ? '新建店铺' : route.query.type == '2' ? '编辑店铺' : '店铺详情' }}
            </a-breadcrumb-item>
        </a-breadcrumb>
        <!-- <div class='tableListHeaderClass'>
        </div> -->
        <div class='tableListContentClass'>

            <a-form :disabled="route.query.type == '3'" :model="data.formState" ref="formState" name="horizontal_login"
                autocomplete="off" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" style="max-width: 700px;">
                <a-form-item label="店铺名称" name="name" :rules="[{ required: true, message: '请输入店铺名称!' }]">
                    <a-input v-model:value="data.formState.name" placeholder="请输入店铺名称" />
                </a-form-item>
                <a-form-item label="店铺LOGO" name="logo" :rules="[{ required: true, message: '请上传店铺LOGO!' }]">
                    <a-upload v-model:file-list="data.fileList" name="file" list-type="picture-card" class="avatar-uploader"
                        :show-upload-list="false" action="/zyapi/admin/com/uploadeFile" @change="methods.handleChange">
                        <img v-if="data.formState.logo" :src="data.formState.logo" alt="avatar" />
                        <div v-else>
                            <loading-outlined v-if="data.uplogoLoading"></loading-outlined>
                            <plus-outlined v-else></plus-outlined>
                            <div class="ant-upload-text">上传</div>
                        </div>
                    </a-upload>
                </a-form-item>

                <a-form-item label="店铺封面" name="cover" :rules="[{ required: true, message: '请上传店铺封面!' }]">
                    <a-upload v-model:file-list="data.coverfileList" name="file" list-type="picture-card"
                        class="avatar-uploader" :show-upload-list="false" action="/zyapi/admin/com/uploadeFile"
                        @change="methods.coverhandleChange">
                        <img v-if="data.formState.cover" :src="data.formState.cover" alt="avatar" />
                        <div v-else>
                            <loading-outlined v-if="data.upcoverLoading"></loading-outlined>
                            <plus-outlined v-else></plus-outlined>
                            <div class="ant-upload-text">上传</div>
                        </div>
                    </a-upload>
                </a-form-item>

                <a-form-item label="店铺地址" name="location" :rules="[{ required: true, message: '请输入店铺地址!' }]">
                    <a-input v-model:value="data.formState.location" placeholder="请输入店铺地址" />
                </a-form-item>
                <a-form-item label="店铺电话" name="telephone" :rules="[{ required: true, message: '请输入店铺电话!' }]">
                    <a-input v-model:value="data.formState.telephone" placeholder="请输入店铺电话" />
                </a-form-item>
                <a-form-item label="店铺电话2" name="telephone_two">
                    <a-input v-model:value="data.formState.telephone_two" placeholder="请输入店铺电话2" />
                </a-form-item>

                <a-form-item label="店铺人员手机" name="phone" :rules="[{ required: true, message: '请输入店铺手机!' }]">
                    <a-input v-model:value="data.formState.phone" placeholder="请输入店铺手机" />
                </a-form-item>
                <a-form-item label="店铺人员手机2" name="phone_two">
                    <a-input v-model:value="data.formState.phone_two" placeholder="请输入店铺手机2" />
                </a-form-item>
                <a-form-item label="店铺人员手机3" name="phone_three">
                    <a-input v-model:value="data.formState.phone_three" placeholder="请输入店铺手机3" />
                </a-form-item>

                <a-form-item label="营业时间" name="open_hours" :rules="[{ required: true, message: '请输入营业时间!' }]">
                    <a-input v-model:value="data.formState.open_hours" placeholder="请输入营业时间" />
                </a-form-item>

                <a-form-item label="排序" name="sort" :rules="[{ required: true, message: '请输入排序!' }]">
                    <a-input-number v-model:value="data.formState.sort" placeholder="请输入排序" />
                </a-form-item>


                <a-form-item label="店铺状态" name="switch">
                    <a-radio-group v-model:value="data.formState.switch" name="radioGroup">
                        <a-radio :value="1">启用</a-radio>
                        <a-radio :value="2">禁用</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item class="pl-[100px]">
                    <a-button type="primary" @click="methods.submit" class="mr-[20px]" :loading="data.submitLoading">提
                        交</a-button>
                    <a-button type="default" @click="methods.cancel">取 消</a-button>
                </a-form-item>
            </a-form>

            <div class="pl-[100px]">
                <a-button type="default" @click="methods.cancel">返 回</a-button>
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { message, type FormInstance } from 'ant-design-vue';
import { storeAddOrEdit, storeDetails } from '@/request/api/storelist'
import type { UploadProps, UploadChangeParam } from 'ant-design-vue';
const route = useRoute()
const router = useRouter()
const formState = ref<FormInstance>()//表单 ref

const data = reactive({
    formState: {
        name: '',//店铺名称
        logo: '',//logo
        cover: '',//封面
        open_hours: '',//营业时间
        location: '',//地址
        telephone: '',//电话
        telephone_two: '',//电话2
        phone: '',//手机
        phone_two: '',//手机2
        phone_three: '',//手机3
        sort: 0,//排序
        switch: '1',
    },
    fileList: ref<UploadProps['fileList']>([]),
    uplogoLoading: false,//上传图片loading
    coverfileList: ref<UploadProps['fileList']>([]),
    upcoverLoading: false,//上传图片loading
    submitLoading: false,//提交loading
    store_id: ref<any>(),//店铺id
})

const methods = {
    submit() {
        if (route.query.type == '3') return
        if (route.query.type == '2') {
            data.store_id = route.query.id
            formState.value?.validate().then(() => {
                data.submitLoading = true;
                storeAddOrEdit({ ...data.formState, store_id: data.store_id }).then(res => {
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
        formState.value?.validate().then(() => {
            data.submitLoading = true;
            storeAddOrEdit(data.formState).then(res => {
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
    cancel() {
        router.go(-1)
    },
    handlePreview(file: any) {
        console.log(file, 'file');
    },
    handleChange: (info: UploadChangeParam) => {// 上传图片 状态变更
        if (info.file.status === 'uploading') {
            data.uplogoLoading = true;
            return;
        }
        if (info.file.status === 'done') {
            data.uplogoLoading = false;
            data.formState.logo = info.file.response.data.path;
            message.success('上传成功');
        }
        if (info.file.status === 'error') {
            data.uplogoLoading = false;
            message.error('上传失败');
        }
    },
    coverhandleChange: (info: UploadChangeParam) => {// 上传图片 状态变更
        if (info.file.status === 'uploading') {
            data.upcoverLoading = true;
            return;
        }
        if (info.file.status === 'done') {
            data.upcoverLoading = false;
            data.formState.cover = info.file.response.data.path;
            message.success('上传成功');
        }
        if (info.file.status === 'error') {
            data.upcoverLoading = false;
            message.error('上传失败');
        }
    },
    getDetails() {
        if (route.query.type == '2' || route.query.type == '3') {
            storeDetails({ store_id: route.query.id }).then(res => {
                console.log(res, 'res');
                if (res.code == 200) {
                    data.formState = res.data
                    data.fileList = [{ uid: '-1', name: 'image.png', status: 'done', url: res.data.logo }]
                    data.coverfileList = [{ uid: '-1', name: 'image.png', status: 'done', url: res.data.cover }]
                }
            })
        } else {
            return
        }
    }
}


methods.getDetails()//获取详情

</script>
<style lang='scss' scoped></style>