<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>积分管理</a-breadcrumb-item>
            <a-breadcrumb-item>自助积分审核</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListHeaderClass h-auto'>
            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off"
                style="height: 100%;">
                <a-form-item label="用户名称" name="name">
                    <a-input v-model:value="data.formHeader.name">
                        <template #prefix>
                            <StarOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="手机号码" name="name">
                    <a-input v-model:value="data.formHeader.name">
                        <template #prefix>
                            <PhoneOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="上传时间" name="time">
                    <a-range-picker v-model:value="time" :show-time="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss"
                        :placeholder="['开始时间', '结束时间']" />
                </a-form-item>
                <!-- 优惠券类型 -->
                <a-form-item label="审核状态" name="type">
                    <a-select v-model:value="data.formHeader.type" style="width: 200px;">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">满减</a-select-option>
                        <a-select-option :value="2">代金券</a-select-option>
                        <a-select-option :value="3">团购券</a-select-option>
                    </a-select>
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


            <a-table :columns="data.tableColumns" :dataSource="data.tableData" :loading="data.tableLoading"
                :pagination="false" rowKey="id" @change="methods.getData">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'platform_rebate'">
                        <span v-if="record.source == 2">店铺{{ record.store_rebate }}%，平台{{ record.platform_rebate }}%</span>
                        <span v-else>--</span>
                    </template>
                    <template v-if="column.dataIndex == 'reduce'">
                        <span v-if="record.type == '1'">满{{ record.full }}元,减{{ record.reduce }}元</span>
                        <span v-if="record.type == '3'">{{ record.full }}元,团{{ record.reduce }}元</span>
                        <span v-if="record.type == '2'">{{ record.reduce }}元代金券</span>
                    </template>
                    <template v-if="column.dataIndex == 'status'">
                        <span>{{ record.status == 1 ? '待审核' : record.status == 2 ? '已通过' : '未通过' }}</span>
                    </template>
                    <template v-if="column.dataIndex == 'action'">
                        <a-space size="small" class="flex flex-wrap">
                            <a-button type="link" @click="methods.Views(record)">详情</a-button>
                            <!-- <a-button type="link" @click="methods.InputIntegral(record)"
                                v-if="record.status == 2">输入积分</a-button> -->
                            <a-button type="link" @click="methods.ViewRejectionReasons(record)"
                                v-if="record.status == -1">查看拒绝原因</a-button>
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
        <a-modal v-model:open="data.toExamineShow" title="详情" :footer="false" width="500px">
            <div class="flex justify-center mb-[24px]">
                <a-image :src="data.toExamineImg" :width="400" />
            </div>
            <div class="flex justify-center" v-if="data.toExamineStatus == '1'">
                <a-button type="primary" class="mr-[24px]" @click="methods.setTrue">通 过</a-button>
                <a-button type="primary" danger @click="methods.setFalse">拒 绝</a-button>
            </div>
        </a-modal>

        <a-modal v-model:open="data.toExamineFalseShow" title="确认提示" :footer="false" width="500px">
            <a-alert message="确认拒绝此审核吗?" type="error" show-icon />
            <div class="flex justify-center mb-[24px] mt-[12px]">
                <a-textarea v-model:value="data.toExamineText" placeholder="请输入拒绝原因" allow-clear />
            </div>
            <div class="flex justify-center">
                <a-button type="primary" class="mr-[24px]" @click="methods.setFalseSure">确 定</a-button>
                <a-button type="default" class="mr-[24px]" @click="methods.setCancel">取 消</a-button>
            </div>
        </a-modal>

        <!-- 输入积分 -->
        <a-modal v-model:open="data.inputShow" title="确认提示" :footer="false" width="500px">
            <a-alert message="确认通过此审核吗?" type="success" show-icon />
            <div class="flex justify-center mb-[24px] mt-[12px] items-center">
             <a-input-number class="flex-1 ml-[12px]" id="inputNumber" placeholder="请输入积分"
                    v-model:value="data.inputNumber" :min="1" />
            </div>
            <div class="flex justify-center">
                <a-button type="primary" class="mr-[24px]" @click="methods.setTrueInput">确 定</a-button>
                <a-button type="primary" @click="methods.setFalseInput">取 消</a-button>
            </div>
        </a-modal>


    </div>
</template>
<script lang='ts' setup>
import { reactive, ref, } from 'vue'
import { onMounted } from 'vue'
import { pointList, pointRefuse, pointAgree } from '../../request/api/Score'
import { message } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import { Dayjs } from 'dayjs';

// 变量
const data = reactive({
    formHeader: {//表单头部
        name: '',
        create_time_end: '',
        create_time_start: '',
        type: '',
        status: ''
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
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '用户名称',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '状态审核',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '积分',
            dataIndex: 'integral',
            key: 'integral',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],

    content: '确定拒绝吗？',
    toExamineShow: false,//打开审核弹窗
    toExamineImg: '',//审核图片
    toExamineStatus: '',//审核状态
    toExamineID: '',//审核id
    toExamineText: '',//审核内容
    inputShow: false,//打开输入积分弹窗
    inputNumber: ref<null | number>(null),//输入积分
    toExamineFalseShow: false,//打开拒绝弹窗
})

const time = ref<Dayjs[]>([])

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        pointList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 10,
            name: data.formHeader.name,
            status: data.formHeader.status,
            type: data.formHeader.type,
            create_time: data.formHeader.create_time_start && data.formHeader.create_time_end
                ?
                [data.formHeader.create_time_start, data.formHeader.create_time_end] : '',
        }).then((res: any) => {
            console.log(res, 'res-----积分审核列表');
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
        data.formHeader = {
            name: '',
            create_time_end: '',
            create_time_start: '',
            type: '',
            status: ''
        }
        time.value = []
        methods.getData()
    },

    pageChange(page: number, pageSize: number) {
        console.log(page, pageSize, '分页')
        methods.getData(page, pageSize)
    },
    // 查看详情
    Views(row: any) {
        data.toExamineShow = true
        data.toExamineImg = row.image
        data.toExamineID = row.id
        data.toExamineStatus = row.status
    },
    // 输入积分
    InputIntegral(text: any) {
        console.log(text, '输入积分')
    },
    // 查看拒绝原因
    ViewRejectionReasons(row: any) {
        Modal.error({
            title: '拒绝原因',
            content: row.reason,
            okText: '关闭',
        });
    },
    // 通过
    setTrue() {
        console.log('通过')
        data.inputShow = true
        data.inputNumber = null
    },
    // 拒绝
    setFalse() {
        data.toExamineFalseShow = true
    },
    // 确定拒绝
    setFalseSure() {

        if (data.toExamineText == '') {
            message.error('请输入拒绝原因')
            return
        }
        pointRefuse({
            id: data.toExamineID,
            reason: data.toExamineText
        }).then((res: any) => {
            if (res.code == 200) {
                message.success('拒绝成功')
                data.toExamineFalseShow = false
                data.toExamineShow = false
                data.toExamineText = ''
                methods.getData()
            }
        })


    },
    // 确定输入积分
    setTrueInput() {
        if (!data.inputNumber) {
            message.error('请输入积分')
            return
        }
        pointAgree({
            id: data.toExamineID,
            integral: data.inputNumber
        }).then((res: any) => {
            if (res.code == 200) {
                message.success('操作成功')
                data.inputShow = false
                data.toExamineShow = false
                data.inputNumber = 1
                methods.getData()
            }
        })

    },
    // 取消输入积分
    setFalseInput() {
        data.inputShow = false
        data.inputNumber = 1
        console.log('取消输入积分')
    },
    // 取消拒绝
    setCancel() {
        data.toExamineFalseShow = false
        data.toExamineText = ''
    }




}


// 生命周期
onMounted(() => {
    methods.getData()
})


</script>
<style lang='scss' scoped></style>