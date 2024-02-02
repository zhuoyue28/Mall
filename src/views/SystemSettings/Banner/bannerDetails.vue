<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item @click="router.go(-1)" class=" cursor-pointer">轮播图管理</a-breadcrumb-item>
            <a-breadcrumb-item>
                {{ route.query.type == '1' ? '添加轮播图' : route.query.type == '2' ? '编辑轮播图' : '轮播图详情' }}
            </a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListContentClass'>

            <a-form :disabled="route.query.type == '3'" :model="data.formData" ref="formHeader" name="horizontal_login" autocomplete="off" style="width: 700px;"
                :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="轮播图标题" name="title" :rules="[{ required: true, message: '请输入轮播图标题' }]">
                    <a-input v-model:value="data.formData.title" placeholder="请输入" />
                </a-form-item>

                <a-form-item   label="轮播图" name="image" :rules="[{ required: true, message: '请上传轮播图' }]">
                    <a-upload  v-model:file-list="data.bannerfileList" name="file" list-type="picture-card"
                        class="avatar-uploader" :show-upload-list="false" action="/zyapi/admin/com/uploadeFile"
                        @change="methods.bannerhandleChange">
                        <a-image style="height: 100px;overflow-hidden"
                         v-if="data.formData.image" :src="data.formData.image" alt="avatar"
                         :preview="false"
                         />
                        <div v-else>
                            <loading-outlined v-if="data.banneruplogoLoading"></loading-outlined>
                            <plus-outlined v-else></plus-outlined>
                            <div class="ant-upload-text">上传</div>
                        </div>
                    </a-upload>
                </a-form-item>

                <a-form-item label="跳转链接" name="jump_url" >
                    <a-input v-model:value="data.formData.jump_url" placeholder="请输入" />
                </a-form-item>

                <a-form-item label="排序" name="sort" :rules="[{ required: true, message: '请输入排序' }]">
                    <!-- <a-input v-model:value="data.formData.sort" placeholder="请输入" /> -->
                    <!-- 数字输入框 -->
                    <a-input-number v-model:value="data.formData.sort" placeholder="请输入" min="1" />
                </a-form-item>

                <a-form-item>
                    <a-button class="ml-[120px]" type="primary" :disabled="route.query.type == '3'" @click="methods.submit"
                        :loading="data.submitLoading">提
                        交</a-button>
                    <a-button class="ml-[24px]" :disabled="false" type="default" @click="methods.goback">返 回</a-button>
                </a-form-item>

            </a-form>

        </div>
    </div>
</template>
<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { BannerFindData, BannerUpdate, BannerAdd } from '../../../request/api/banner'
import { useRouter, useRoute } from 'vue-router';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { UploadProps, UploadChangeParam } from 'ant-design-vue'

const formHeader = ref<FormInstance>()
const router = useRouter()
const route = useRoute()

// 变量
const data = reactive({
    formData: {
        title: '',
        sort: '',
        image: '',
        jump_url: '',
    },

    bannerfileList: ref<UploadProps['fileList']>([]),
    banneruplogoLoading: false,
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
                BannerUpdate({ ...data.formData, id: route.query.id }).then((res: any) => {
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
    bannerhandleChange(info: UploadChangeParam) {
        if (info.file.status === 'uploading') {
            data.banneruplogoLoading = true
            return
        }
        if (info.file.status === 'done') {
            data.banneruplogoLoading = false
            data.formData.image = info.file.response.data.path
            message.success('上传成功')
        }
    },
    goback() {
        router.go(-1)
    },
    getDetails() {
        BannerFindData({ id: route.query.id }).then(res => {
            if (res.code == 200) {
                data.formData = res.data
                data.bannerfileList = [{
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: res.data.image,
                }]
            }
        })
    }
})


// 生命周期
onMounted(() => {
    if (route.query.type == '2' || route.query.type == '3') {
        methods.getDetails()
    }
})


</script>
<style lang='scss' scoped></style>