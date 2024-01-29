<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item @click="$router.go(-1)" class=" cursor-pointer">优惠卷管理</a-breadcrumb-item>
            <a-breadcrumb-item @click="$router.go(-1)" class=" cursor-pointer">优惠卷</a-breadcrumb-item>
            <a-breadcrumb-item>
                {{ route.query.type == '1' ? '新建商家劵' : route.query.type == '2' ? '编辑商家劵' : '优惠卷详情' }}
            </a-breadcrumb-item>
        </a-breadcrumb>
        <!-- <div class='tableListHeaderClass'>
        </div> -->
        <div class='tableListContentClass'>

            <a-form :disabled="route.query.type == '3'" :model="data.formState" ref="formState" name="horizontal_login"
                autocomplete="off" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" style="max-width: 900px;">

                <a-form-item label="优惠卷类型" name="type">
                    <a-radio-group v-model:value="data.formState.type" name="radioGroup">
                        <a-radio :value="1">满减劵</a-radio>
                        <a-radio :value="2">代金劵</a-radio>
                        <a-radio :value="3">团购劵</a-radio>
                    </a-radio-group>
                </a-form-item>


                <a-form-item v-if="data.formState.type == 1" label="优惠卷内容" name="full"
                    :rules="[{ required: true, message: '优惠卷内容!' }]">
                    <div class="flex items-center">
                        满：<a-input-number v-model:value="data.formState.full" :min="0" addon-after="元" />
                        <span class="ml-[10px]">，</span>
                        减：<a-form-item-rest>
                            <a-input-number v-model:value="data.formState.reduce" :min="0" addon-after="元" />
                        </a-form-item-rest>
                    </div>
                </a-form-item>

                <a-form-item v-if="data.formState.type == 2" label="优惠卷内容" name="reduce"
                    :rules="[{ required: true, message: '请输入优惠劵内容!' }]">

                    <a-input-number v-model:value="data.formState.reduce" :min="0" addon-after="元" />

                </a-form-item>

                <a-form-item v-if="data.formState.type == 3" label="优惠卷内容" name="full"
                    :rules="[{ required: true, message: '请输入优惠劵内容!' }]">
                    <div class="flex items-center">
                        <a-input-number v-model:value="data.formState.full" :min="0" addon-after="元" />
                        <span class="ml-[10px]">，</span>
                        团：
                        <a-form-item-rest>
                            <a-input-number v-model:value="data.formState.reduce" :min="0" addon-after="元" />
                        </a-form-item-rest>
                    </div>
                </a-form-item>


                <a-form-item label="店铺" name="join_store">
                    <a-radio-group v-model:value="data.formState.join_store" name="radioGroup">
                        <a-radio :value="0">全部</a-radio>
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

                <a-form-item label="优惠卷名称" name="name" :rules="[{ required: true, message: '请输入店铺名称!' }]">
                    <a-input v-model:value="data.formState.name" />
                </a-form-item>

                <a-form-item label="优惠卷价格" name="price" :rules="[{ required: true, message: '请输入店铺价格!' }]">
                    <a-input-number v-model:value="data.formState.price" :min="1" :max="100" addon-after="元" />
                </a-form-item>

                <a-form-item label="有效期，领取后" name="valid_day" :rules="[{ required: true, message: '请输入有效期!' }]">
                    <a-input-number v-model:value="data.formState.valid_day" :min="1" :max="100" addon-after="天" />
                </a-form-item>

                <!-- 优惠卷介绍 -->
                <a-form-item label="优惠卷介绍" name="intro" :rules="[{ required: true, message: '请输入优惠卷介绍!' }]">
                    <a-textarea v-model:value="data.formState.intro" />
                </a-form-item>

                <a-form-item label="优惠卷分成" name="platform_rebate" :rules="[{ required: true, message: '请完整填写优惠劵分成' }]">
                    <div class="flex items-center">
                        店铺：<a-input-number v-model:value="data.formState.store_rebate" :min="1" :max="100"
                            addon-after="%" />
                        <span class="ml-[10px]">，</span>
                        平台：<a-form-item-rest>
                            <a-input-number v-model:value="data.formState.platform_rebate" :min="1" :max="100"
                                addon-after="%" />
                        </a-form-item-rest>
                    </div>
                </a-form-item>

                <!-- 使用规则 -->
                <a-form-item label="优惠卷规则" name="use_rule" :rules="[{ required: true, message: '请输入优惠卷规则!' }]">
                    <a-textarea v-model:value="data.formState.use_rule" />
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
import { reactive, ref } from 'vue'
import { message, type FormInstance } from 'ant-design-vue';
import { couponAdd, couponDetails, couponEdit } from '@/request/api/coupon'
import { storeList } from '@/request/api/storelist'

const route = useRoute()
const router = useRouter()
const formState = ref<FormInstance>()//表单 ref

const data = reactive({
    formState: {
        type: 1,//优惠卷类型
        full: ref<null | number>(null),//满
        reduce: ref<null | number>(null),//减
        join_store: 0,//店铺
        name: '',//优惠卷名称
        price: ref<null | number>(null),//优惠卷价格
        valid_day: ref<null | number>(null),//有效期
        intro: '',//优惠卷介绍
        platform_rebate: ref<null | number>(null),//优惠卷分成
        use_rule: '',//使用规则
        store_rebate: ref<null | number>(null),//店铺分成
        store_id: ref<any>(null),//店铺id
    },
    submitLoading: false,//提交loading
    storeList: ref<any>([]),//店铺列表
})

const methods = {
    submit() {
        if (route.query.type == '3') return
        if (data.formState.store_id == null) data.formState.store_id = 0
        if (data.formState.type == 2) data.formState.full = null
        if (route.query.type == '2') {
            formState.value?.validate().then(() => {
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
        formState.value?.validate().then(() => {
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
    cancel() {
        router.go(-1)
    },
    handlePreview(file: any) {
        console.log(file, 'file');
    },
    getDetails() {
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
    getStoreList() {
        storeList({ page: 1, limit: 9999 }).then(res => {
            console.log(res, 'res店铺');
            if (res.code == 200) {
                data.storeList = res.data.data
            }
        })
    }
}


methods.getDetails()//获取详情
methods.getStoreList()//获取店铺列表

</script>
<style lang='scss' scoped></style>