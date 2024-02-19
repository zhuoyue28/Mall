<template>
    <div class="tableListClass">
        <a-breadcrumb>
            <a-breadcrumb-item @click="$router.go(-1)" class="cursor-pointer">优惠券管理</a-breadcrumb-item>
            <a-breadcrumb-item @click="$router.go(-1)" class="cursor-pointer">优惠券</a-breadcrumb-item>
            <a-breadcrumb-item>
                {{
                    route.query.type == '1'
                    ? '新建平台劵'
                    : route.query.type == '2'
                        ? '编辑平台劵'
                        : '优惠券详情'
                }}
            </a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tableListContentClass">
            <a-form :disabled="route.query.type == '3'" :model="data.formState" ref="formState" name="horizontal_login"
                autocomplete="off" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" style="max-width: 900px">
                <a-form-item label="优惠券类型" name="type">
                    <a-radio-group v-model:value="data.formState.type" name="radioGroup">
                        <a-radio :value="1">满减劵</a-radio>
                        <a-radio :value="2">代金劵</a-radio>
                        <a-radio :value="3">无门槛券</a-radio>
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

                <a-form-item v-if="data.formState.type == 3" label="优惠券内容" name="reduce"
                    :rules="[{ required: true, message: '请输入优惠劵内容!' }]">
                    <a-input-number v-model:value="data.formState.reduce" :min="0" addon-after="元" />
                </a-form-item>

                <a-form-item label="优惠券名称" name="name" :rules="[{ required: true, message: '请输入店铺名称!' }]">
                    <a-input v-model:value="data.formState.name" />
                </a-form-item>

                <a-form-item label="优惠券价格" name="price" :rules="[{ required: true, message: '请输入店铺价格!' }]">
                    <a-input-number v-model:value="data.formState.price" :min="0" addon-after="元"
                        @blur="methods.priceblur" />
                </a-form-item>

                <a-form-item label="有效期，领取后" name="valid_day" :rules="[{ required: true, message: '请输入有效期!' }]">
                    <a-input-number v-model:value="data.formState.valid_day" :min="1" addon-after="天" />
                </a-form-item>

                <a-form-item v-if="data.formState.type == 3" label="优惠券发放数量：" name="grant_num"
                    :rules="[{ required: true, message: '请输入优惠券发放数量!' }]">
                    <a-input-number v-model:value="data.formState.grant_num" :min="1" addon-after="个" />
                </a-form-item>

                <a-form-item v-if="data.formState.type == 3" label="优惠券领取数量限制：" name="get_limit"
                    :rules="[{ required: true, message: '请输入优惠券领取数量限制!' }]">
                    <a-input-number v-model:value="data.formState.get_limit" :min="1" addon-after="个" />
                </a-form-item>



                <!-- 优惠券介绍 -->
                <!-- <a-form-item label="优惠券介绍" name="intro" :rules="[{ required: true, message: '请输入优惠券介绍!' }]">
                    <a-textarea v-model:value="data.formState.intro" />
                </a-form-item> -->

                <!-- <a-form-item label="优惠券分成" name="platform_rebate" :rules="[{ required: true, message: '请完整填写优惠劵分成' }]">
                    <div class="flex items-center">
                        店铺：<a-input-number v-model:value="data.formState.store_rebate" :min="1" :max="100"
                            addon-after="%" />
                        <span class="ml-[10px]">，</span>
                        平台：<a-form-item-rest>
                            <a-input-number v-model:value="data.formState.platform_rebate" :min="1" :max="100"
                                addon-after="%" />
                        </a-form-item-rest>
                    </div>
                </a-form-item> -->

                <a-form-item label="店铺" name="join_store">
                    <a-radio-group v-model:value="data.formState.join_store" name="radioGroup"
                        @change="methods.joinStoreChange">
                        <a-radio :value="0">全部</a-radio>
                        <a-radio :value="1">指定商家</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="选择店铺" name="store_arr">
                    <div class="my-[12px]" v-if="data.formState.join_store == 1">
                        <a-button type="primary" @click="methods.addStore">添加店铺</a-button>
                    </div>
                    <a-table :columns="Number(data.formState.price) ? data.storeColumns : data.storeColumns2"
                        :dataSource="data.store_arr" :loading="data.storeLoading" :pagination="true" rowKey="store_id">
                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.dataIndex == 'platform_rebate'">
                                <a-form-item-rest>
                                    <a-input-number :disabled="true" v-model:value="record.platform_rebate" :min="0"
                                        addon-after="%" />
                                </a-form-item-rest>
                            </template>
                            <template v-if="column.dataIndex == 'store_rebate'">
                                <a-form-item-rest>
                                    <a-input-number
                                        @change="(val: any) => { methods.storeRebatechange(val, column, index) }"
                                        v-model:value="record.store_rebate" :min="0" addon-after="%" />
                                </a-form-item-rest>
                            </template>
                            <template v-if="column.dataIndex == 'store_perk'">
                                <a-form-item-rest>
                                    <a-input-number v-model:value="record.store_perk" :min="0" addon-after="元" />
                                    {{ record.type == 1 ? '%' : '' }}
                                </a-form-item-rest>
                            </template>
                            <!-- <template v-if="column.dataIndex == 'type'">
                                {{ record.type == 1 ? '店铺分成' : '店铺补贴' }}
                            </template> -->
                            <template v-if="column.dataIndex == 'action'">
                                <a-space size="small">
                                    <a-button v-if="data.formState.join_store == 1" type="link"
                                        @click="methods.delete(record)">移除</a-button>
                                </a-space>
                            </template>
                        </template>
                    </a-table>
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
        <a-modal v-model:open="data.storeVisible" title="选择店铺" @ok="methods.storeOk" @cancel="methods.storeCancel"
            width="500px" okText="确定" cancelText="取消">
            <div class="my-[12px]">
                已选{{ data.selectedRowKeys.length }}个店铺
            </div>
            <a-table :columns="data.storeColumn" :dataSource="data.storeData" :loading="data.storeLoading"
                :pagination="false" rowKey="id" @change="methods.getData"
                :row-selection="{ selectedRowKeys: data.selectedRowKeys, onChange: methods.onSelectChange, preserveSelectedRowKeys: true }">
            </a-table>
            <div class="flex mt-[12px] items-center justify-end">
                <a-pagination v-model:current="data.storePagination.current"
                    v-model:pageSize="data.storePagination.pageSize" :total="data.storePagination.total" show-size-changer
                    show-quick-jumper @change="methods.pageChange" />
            </div>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref, shallowRef } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import { couponAdd, couponDetails, couponEdit } from '@/request/api/coupon'
import { storeList } from '@/request/api/storelist'
import { comUploadeFile } from '@/request/api/activity'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

const route = useRoute()
const router = useRouter()
const formState = ref<FormInstance>() //表单 ref


const data = reactive({
    formState: {
        type: 1, //优惠券类型
        full: ref<null | number>(null), //满
        reduce: ref<null | number>(null), //减
        join_store: 0, //店铺
        name: '', //优惠券名称
        price: ref<null | number>(null), //优惠券价格
        valid_day: ref<null | number>(null), //有效期
        intro: '', //优惠券介绍
        // platform_rebate: ref<null | number>(null), //优惠券分成
        use_rule: '', //使用规则
        // store_rebate: ref<null | number>(null), //店铺分成
        store_id: ref<any>(0), //店铺id
        grant_num: ref<null | number>(null), //优惠券发放数量
        get_limit: ref<null | number>(null), //优惠券领取数量限制
    },
    submitLoading: false, //提交loading
    storeList: ref<any>([]), //店铺列表
    storeVisible: false, //店铺弹窗
    storeData: [], //店铺列表
    storeLoading: false, //店铺列表loading
    storePagination: {
        //店铺列表分页
        current: 1,
        pageSize: 5,
        total: 0
    },
    storeColumn: [
        //店铺列表表头
        {
            title: '店铺名称',
            dataIndex: 'name',
            key: 'name',
        },
    ],
    storeColumns: [
        //店铺列表表头
        {
            title: '店铺名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: '店铺分成（%）',
            dataIndex: 'store_rebate',
            key: 'store_rebate',
            width: 100,
        },
        {
            title: '平台分成（%）',
            dataIndex: 'platform_rebate',
            key: 'platform_rebate',
            width: 100,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 100
        }
    ],
    storeColumns2: [
        //店铺列表表头
        {
            title: '店铺名称',
            dataIndex: 'name',
            key: 'name',
            width: 300,
        },
        {
            title: '店铺补贴（元）',
            dataIndex: 'store_perk',
            key: 'store_perk',
            width: 200,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action'
        }
    ],
    store_arr: ref<any>([]),//店铺id
    selectedRowKeys: ref<any>([]),//选中的店铺id
    selectedRows: ref<any>([]),//选中的店铺id
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
            formState.value?.validate().then(() => {
                data.submitLoading = true
                couponEdit({ ...data.formState, coupon_id: route.query.id, source: 1, store_arr: data.store_arr }).then((res) => {
                    console.log(res, 'res')
                    if (res.code == 200) {
                        message.success('编辑成功')
                        router.go(-1)
                    } else {
                        data.submitLoading = false
                    }
                })
            })

            return
        }
        formState.value?.validate().then(() => {
            data.submitLoading = true
            couponAdd({ ...data.formState, source: 1, store_arr: data.store_arr }).then((res) => {
                console.log(res, 'res')
                if (res.code == 200) {
                    message.success('添加成功')
                    router.go(-1)
                } else {
                    data.submitLoading = false
                }
            })
        })
    },
    cancel() {//取消
        router.go(-1)
    },
    handlePreview(file: any) {//图片预览
        console.log(file, 'file')
    },
    getDetails() {//获取详情
        if (route.query.type == '2' || route.query.type == '3') {
            couponDetails({ coupon_id: route.query.id }).then((res) => {
                console.log(res, 'res')
                if (res.code == 200) {
                    data.formState = {
                        type: res.data.type, //优惠券类型
                        full: res.data.full || null, //满
                        reduce: res.data.reduce, //减
                        join_store: res.data.join_store, //店铺
                        name: res.data.name, //优惠券名称
                        price: res.data.price, //优惠券价格
                        valid_day: res.data.valid_day, //有效期
                        intro: res.data.intro, //优惠券介绍
                        // platform_rebate: ref<null | number>(null), //优惠券分成
                        use_rule: res.data.use_rule, //使用规则
                        // store_rebate: ref<null | number>(null), //店铺分成
                        store_id: 0, //店铺id
                        grant_num: res.data.grant_num, //优惠券发放数量
                        get_limit: res.data.get_limit, //优惠券领取数量限制
                    }
                    res.data.store_list.forEach((x: any) => {
                        let obj = {
                            store_id: x.store_id,
                            name: x.name,
                            store_rebate: x.store_rebate,
                            platform_rebate: x.platform_rebate,
                            store_perk: x.store_perk,
                            type: x.type
                        }
                        data.selectedRowKeys.push(x.store_id)
                        data.store_arr.push(obj)
                    })
                }
            })
        } else {
            return
        }
    },
    getStoreList() {//获取店铺列表
        storeList({ page: 1, limit: 9999 }).then((res) => {
            console.log(res, 'res店铺')
            if (res.code == 200) {
                data.storeList = res.data.data
                if (route.query.type == '1') {
                    data.selectedRowKeys = res.data.data.map((x: any) => x.id)
                    data.selectedRows = res.data.data
                    methods.storeOk()
                }
            }
        })
    },
    addStore() {//添加店铺
        data.storeVisible = true
        methods.getData()
    },
    getData(page?: number, pageSize?: number) {//获取店铺列表
        data.storeLoading = true
        storeList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 5,
            keyword: ''
        }).then((res: any) => {
            data.storeData = res.data.data
            data.storePagination.total = res.data.total
            data.storePagination.current = res.data.current_page
            data.storePagination.pageSize = res.data.per_page
            data.storeLoading = false
        })
    },
    pageChange(page: number, pageSize: number) {//店铺列表分页
        methods.getData(page, pageSize)
    },
    storeOk() {//店铺确定
        let arr: any = []
        console.log(Number(data.formState.price), 'Number(data.formState.price)');

        data.selectedRows.forEach((x: any) => {
            let obj = {
                store_id: x.id,
                name: x.name,
                store_rebate: null,
                platform_rebate: null,
                store_perk: null,
                type: Number(data.formState.price) ? 1 : 2
            }
            arr.push(obj)//店铺id
        })
        data.store_arr.forEach((x: any) => {
            arr.forEach((y: any) => {
                if (x.store_id == y.store_id) {
                    y.store_rebate = x.store_rebate
                    y.platform_rebate = x.platform_rebate
                    y.store_perk = x.store_perk
                }
            })
        })
        data.store_arr = arr
        data.storeVisible = false
    },
    storeCancel() {//店铺取消
        data.storeVisible = false
    },
    delete(text: any) {
        console.log(text, '删除')
        data.store_arr = data.store_arr.filter((x: any) => x.store_id != text.store_id)
    },
    priceblur() {//优惠券价格 失焦
        data.store_arr.forEach((x: any) => {
            x.type = data.formState.price ? 1 : 2
        })
    },
    onSelectChange(selectedRowKeys: any, selectedRows: any) {//选择店铺
        console.log(selectedRowKeys, selectedRows, 'selectedRowKeys')
        data.selectedRowKeys = selectedRowKeys
        data.selectedRows = selectedRows
    },
    storeRebatechange(val: any, column: any, index: any) {//店铺分成
        console.log(val, column, index, 'val')
        if (column.dataIndex == 'store_rebate') {
            data.store_arr[index].platform_rebate = 100 - val
        }
    },
    joinStoreChange(val: any) {
        console.log(val.target.value, '切换全部/指定商家');
        let valType = val.target.value
        if (valType) {
            data.selectedRowKeys = []
            data.selectedRows = []
            methods.storeOk()
        } else {
            data.selectedRowKeys = data.storeList.map((x: any) => x.id)
            data.selectedRows = data.storeList
            methods.storeOk()
        }
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

methods.getDetails() //获取详情
methods.getStoreList() //获取店铺列表
methods.getData() //获取店铺列表
</script>
<style lang="scss" scoped></style>
