<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>协议管理</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListContentClass'>
            <!-- 添加按钮 -->
            <div class="flex mb-[12px]">
                <a-button type="primary" @click="methods.add">添加轮播图</a-button>
            </div>
            <a-table :columns="data.tableColumns" :dataSource="data.tableData" :loading="data.tableLoading"
                :pagination="false" rowKey="id" @change="methods.getData">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'image'">
                        <a-image :src="record.image" :width="100" />
                    </template>
                    <template v-if="column.dataIndex == 'action'">
                        <a-space size="middle">
                            <a-button type="link" @click="methods.details(record)">查看</a-button>
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
import { reactive } from 'vue'
import { onMounted, h } from 'vue'
import { BannerSelectList, BannerDelete } from '../../../request/api/banner'
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
const router = useRouter()

// 变量
const data = reactive({
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
            title: '轮播图片',
            dataIndex: 'image',
            key: 'image',
        },
        {
            title: '链接地址',
            dataIndex: 'jump_url',
            key: 'jump_url',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],
    content: '确定删除该轮播图吗？'
})

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        BannerSelectList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 10,
        }).then((res: any) => {
            console.log(res, 'res-----轮播图列表');
            data.tableData = res.data.data
            data.tablePagination.total = res.data.total
            data.tablePagination.current = res.data.current_page
            data.tablePagination.pageSize = res.data.per_page
            data.tableLoading = false
        })
    },
    // 编辑
    edit(text: any) {
        router.push({
            path: '/bannerDetails',
            query: {
                type: '2',
                id: text.id
            }
        })
    },
    // 删除
    delete(row: any) {
        // console.log(text, '删除')
        Modal.confirm({
            title: '删除提示',
            content: data.content,
            okText: '确认',
            cancelText: '取消',
            icon: h(WarningOutlined),
            maskClosable: true,
            autoFocusButton: null,
            onOk: () => {
                BannerDelete({ id: row.id }).then((res: any) => {
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
        router.push({
            path: '/bannerDetails',
            query: {
                type: '3',
                id: text.id
            }
        })
    },
    pageChange(page: number, pageSize: number) {
        console.log(page, pageSize, '分页')
        methods.getData(page, pageSize)
    },
    // 开关
    switchChange(val: boolean, id: number) {
        console.log(val, id, '开关')
    },
    tabsChange(val: string) {
        console.log(val, 'tabs')
    },
    add() {
        router.push({
            path: '/bannerDetails',
            query: {
                type: '1'
            }
        })
    }
}


// 生命周期
onMounted(() => {
    methods.getData()
})


</script>
<style lang='scss' scoped></style>