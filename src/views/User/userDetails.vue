<template>
    <div class="tableListClass">
        <a-breadcrumb>
            <a-breadcrumb-item @click="() => {
                router.go(-1)
            }
                " class="cursor-pointer">用户管理</a-breadcrumb-item>
            <a-breadcrumb-item>用户详情</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tableListContentClass mb-[12px]">
            <!-- 基础资料 -->
            <div class="font-[700] text-[16px]">基础资料</div>
            <div class="flex justify-center items-center mb-[24px]">
                <a-avatar :size="100" :src="userDetail.avatar"> </a-avatar>
            </div>
            <div class="text-center mb-[12px] text-[#1070ff]">
                {{ userDetail.nickname }}
            </div>
            <div class="flex items-center justify-center">
                <div class="mr-[48px] flex items-center">
                    <span class="mr-[10px]">
                        <PhoneOutlined />
                    </span>
                    <span>{{ userDetail.phone }}</span>
                </div>
                <div class="flex items-center">
                    <span class="mr-[10px]">
                        <UserAddOutlined />
                    </span>
                    <span>{{ userDetail.create_time }}</span>
                </div>
            </div>
        </div>

        <div class="tableListContentClass mb-[12px]">
            <div class="font-[700] text-[16px] mb-[12px]">用户备注</div>
            <div>
                <a-alert message="输入完成后，按回车（enter）键完成修改。" type="info" show-icon class="w-[350px] mb-[12px]" />
                <a-textarea v-if="!remarkLoading" v-model:value="remark" placeholder="请输入..."
                    :auto-size="{ minRows: 5, maxRows: 10 }" :maxlength="1000" show-count @pressEnter="pressEnter" />
                <a-spin tip="加载中..." v-else>
                    <a-textarea v-model:value="remark" placeholder="请输入..." :auto-size="{ minRows: 5, maxRows: 10 }"
                        :maxlength="1000" show-count @pressEnter="pressEnter" />
                </a-spin>
            </div>
        </div>

        <div class="tableListContentClass mb-[12px]">
            <a-tabs v-model:activeKey="activeKey" @change="tabsChange">
                <a-tab-pane key="1" tab="订单记录">

                </a-tab-pane>
                <a-tab-pane key="2" tab="停车券" disabled></a-tab-pane>
                <a-tab-pane key="3" tab="积分记录"></a-tab-pane>
            </a-tabs>
            <a-table :columns="activeKey == '1' ? tableColumns : activeKey == '2' ? null : tableColumns3"
                :dataSource="tableData" :loading="tableLoading" :pagination="false" rowKey="id">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'is_settlement'">
                        <span>{{ record.status == 1 ? '未结算' : '已结算' }}</span>
                    </template>
                    <template v-if="column.dataIndex == 'coupon_type'">
                        <span>{{ record.status == 1 ? '商家' : '平台' }}</span>
                    </template>
                    <template v-if="column.dataIndex == 'coupon_name'">
                        <span>{{ record.coupon_name + '/' }}</span>
                        <span>{{ record.coupon_send_type == '1' ? '满减'
                            : record.coupon_send_type == 2 ? '代金券' : '团购' }}</span>
                    </template>
                    <!-- 积分 -->
                    <template v-if="column.dataIndex == 'data_type'">
                        <span>{{ record.status == 1 ? '自助积分' : record.status == 2 ? '停车缴费' : record.status == 3 ? '停车兑换'
                            : '优惠券使用' }}</span>
                    </template>
                </template>
            </a-table>
            <div class="flex justify-end items-center mt-[12px]">
                <a-pagination :current="tablePagination.current" :pageSize="tablePagination.pageSize"
                    :total="tablePagination.total" @change="pageChange" />
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userDetails, userRemark, userOrderList, userScoreRecordList } from '../../request/api/userlist'
import { message } from 'ant-design-vue'
const router = useRouter()
const route = useRoute()
const user_id = ref(route.query.id)

const userDetail = ref<any>({}) //用户详情
const remark = ref('') //备注
const remarkLoading = ref(false) //备注加载
const activeKey = ref('1') //tab切换
const tableData = ref([]) //表格数据
const tableLoading = ref(false) //表格加载
const tablePagination = ref({
    //分页
    current: 1,
    pageSize: 5,
    total: 0
})
const tableColumns = ref([
    //表头
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time'
    },
    {
        title: '订单号',
        dataIndex: 'sn',
        key: 'sn'
    },
    {
        title: '店铺名称',
        dataIndex: 'shop_name',
        key: 'shop_name'
    },
    {
        title: '优惠券：名称/类型',
        dataIndex: 'coupon_name',
        key: 'coupon_name'
    },
    {
        title: '优惠券发放类型',
        dataIndex: 'coupon_type',
        key: 'coupon_type'
    },
    {
        title: '优惠券价格（元）',
        dataIndex: 'real_money',
        key: 'real_money'
    },
    {
        title: '订单状态',
        dataIndex: 'status_text',
        key: 'status_text'
    },
    {
        title: '结算状态',
        dataIndex: 'is_settlement',
        key: 'is_settlement'
    },
])
const tableColumns2 = ref([
    //表头
    {
        title: '优惠劵名称',
        dataIndex: 'create_time',
        key: 'create_time'
    },
    {
        title: '优惠券内容',
        dataIndex: 'sn',
        key: 'sn'
    },
    {
        title: '有效期',
        dataIndex: 'shop_name',
        key: 'shop_name'
    },
    {
        title: '优惠券状态',
        dataIndex: 'coupon_name',
        key: 'coupon_name'
    },
])
const tableColumns3 = ref([
    //表头
    {
        title: '变更时间',
        dataIndex: 'after_change',
        key: 'after_change'
    },
    {
        title: '交易类型',
        dataIndex: 'data_type',
        key: 'data_type'
    },
    {
        title: '变动积分',
        dataIndex: 'score',
        key: 'score'
    },
    {
        title: '剩余积分',
        dataIndex: 'after_change',
        key: 'after_change'
    },
])

// 获取用户详情
const getUserDetails = () => {
    console.log(user_id.value, 'user_id')
    userDetails({ user_id: user_id.value }).then((res) => {
        console.log(res, '用户详情')
        userDetail.value = res.data
        remark.value = res.data.remark
    })
}

// 备注(触发回车)
const pressEnter = () => {
    remarkLoading.value = true
    userRemark({ user_id: user_id.value, remark: remark.value })
        .then((res) => {
            if (res.code == 200) {
                message.success('备注成功')
                remarkLoading.value = false
                getUserDetails()
            } else {
                remarkLoading.value = false
            }
        })
        .catch(() => {
            remarkLoading.value = false
        })
}

// 获取数据
const getData = (page?: number, pageSize?: number, type?: string | number) => {
    tableLoading.value = true
    if (type == 1) {
        userOrderList({//订单记录
            page: page ? page : 1,
            limit: pageSize ? pageSize : 5,
            user_id: user_id.value
        }).then((res: any) => {
            console.log(res, 'res-----订单记录');
            tableData.value = res.data.data
            tablePagination.value.total = res.data.total
            tablePagination.value.current = res.data.current_page
            tablePagination.value.pageSize = res.data.per_page
            tableLoading.value = false
        })
    } else if (type == 2) {
        // 停车券
    } else if (type == 3) {
        userScoreRecordList({//积分记录
            page: page ? page : 1,
            limit: pageSize ? pageSize : 5,
            user_id: user_id.value
        }).then((res: any) => {
            console.log(res, 'res-----积分记录');
            tableData.value = res.data.data
            tablePagination.value.total = res.data.total
            tablePagination.value.current = res.data.current_page
            tablePagination.value.pageSize = res.data.per_page
            tableLoading.value = false
        })
    }
}


// 切换tabs
const tabsChange = (val: string) => {
    console.log(val, 'val')
    activeKey.value = val
    if (val == '1') {
        getData(1, 5, 1)
    } else if (val == '2') {
        getData(1, 5, 2)
    } else if (val == '3') {
        getData(1, 5, 3)
    }
}

// 分页
const pageChange = (page: number, pageSize: number) => {
    getData(page, pageSize, activeKey.value)
}

getUserDetails()
getData(1, 5, 1)
</script>
<style lang="scss" scoped></style>
