<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>店铺管理</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListHeaderClass'>
            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off">
                <a-form-item label="店铺名称" name="name">
                    <a-input v-model:value="data.formHeader.name">
                        <template #prefix>
                            <ShopOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="methods.getData()">查 询</a-button>
                </a-form-item>
                <a-form-item>
                    <a-button type="default" @click="methods.Repossess()">重 置</a-button>
                </a-form-item>
            </a-form>
        </div>
        <div class='tableListContentClass'>
            <div class="mb-[12px]">
                <a-button type="primary" @click="methods.add">新建店铺</a-button>
            </div>
            <a-table :columns="data.tableColumns" :dataSource="data.tableData" :loading="data.tableLoading"
                :pagination="false" rowKey="id" @change="methods.getData">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'logo'">
                        <a-image :width="50" :src="record.logo" />
                    </template>
                    <template v-if="column.dataIndex == 'cover'">
                        <a-image :width="50" :src="record.cover" />
                    </template>
                    <template v-if="column.dataIndex == 'switch'">
                        <a-switch v-model:checked="record.switch" :checkedValue="1" :uncheckedValue="2"
                            @change="(val: boolean) => { methods.switchChange(val, record.id) }" />
                    </template>
                    <template v-else-if="column.dataIndex == 'action'">
                        <a-space size="middle">
                            <a-button type="link" @click="methods.details(record)">详情</a-button>
                            <a-button type="link" @click="methods.edit(record)">编辑</a-button>
                            <a-button type="link" danger @click="methods.delete(record)">删除</a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>
            <div class="flex mt-[12px] items-center justify-end">
                <a-pagination v-model:current="data.tablePagination.current"
                    v-model:pageSize="data.tablePagination.pageSize" :total="data.tablePagination.total" show-size-changer
                    show-quick-jumper @change="methods.pageChange" />
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { reactive, ref, h } from 'vue'
import { onMounted } from 'vue'
import { storeList, storeDel } from '../../request/api/storelist'
import { Modal, message } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter()//路由
const formHeader = ref<any>(null)//表单头部 ref

// 变量
const data = reactive({
    formHeader: {//表单头部
        name: '',
    },
    tableData: [],//表格数据
    tableLoading: false,//表格加载
    tablePagination: {//分页
        current: 1,
        pageSize: 10,
        total: 0,
    },
    tableColumns: [//表头
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: '店铺名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '店铺LOGO',
            dataIndex: 'logo',
            key: 'logo',
        },
        {
            title: '店铺封面图',
            dataIndex: 'cover',
            key: 'cover',
        },
        {
            title: '店铺位置',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: '营业时间',
            dataIndex: 'open_hours',
            key: 'open_hours',
        },
        {
            title: '店铺电话',
            dataIndex: 'telephone',
            key: 'telephone',
        },
        {
            title: '开关',
            dataIndex: 'switch',
            key: 'switch',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],
    content: '确定删除该店铺吗？',//删除提示内容

})

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        storeList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 10,
            name: data.formHeader.name,
        }).then((res: any) => {
            console.log(res, 'res-----店铺列表');
            data.tableData = res.data.data
            data.tablePagination.total = res.data.total
            data.tablePagination.current = res.data.current_page
            data.tablePagination.pageSize = res.data.per_page
            data.tableLoading = false
        })
    },
    // 重置
    Repossess() {
        console.log('重置')
        formHeader.value!.resetFields()
        methods.getData()
    },
    add() {
        router.push({ path: '/StoreDeatils', query: { type: 1 } })
    },
    // 编辑
    edit(text: any) {
        router.push({ path: '/StoreDeatils', query: { type: 2, id: text.id } })
    },
    // 删除
    delete(text: any) {
        console.log(text, '删除')
        Modal.confirm({
            title: '删除提示',
            content: data.content,
            okText: '确认',
            cancelText: '取消',
            icon: h(WarningOutlined),
            maskClosable: true,
            autoFocusButton: null,
            onOk: () => {
                storeDel({ store_id: text.id }).then((res: any) => {
                    if (res.code == 200) {
                        message.success('删除成功')
                        methods.getData(data.tablePagination.current, data.tablePagination.pageSize)
                    }
                })
            },
            onCancel: () => { }
        })
    },
    // 详情
    details(text: any) {
        router.push({ path: '/StoreDeatils', query: { type: 3, id: text.id } })
    },
    pageChange(page: number, pageSize: number) {
        console.log(page, pageSize, '分页')
        methods.getData(page, pageSize)
    },
    // 开关
    switchChange(val: boolean, id: number) {
        console.log(val, id, '开关')
    }
}


// 生命周期
onMounted(() => {
    methods.getData()
})


</script>
<style lang='scss' scoped></style>