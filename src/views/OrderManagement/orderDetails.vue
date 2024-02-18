<template>
    <div class="tableListClass">
        <a-breadcrumb>
            <a-breadcrumb-item @click="() => {
                router.go(-1)
            }
                " class="cursor-pointer">订单管理</a-breadcrumb-item>
            <a-breadcrumb-item>订单详情</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tableListContentClass mb-[12px]">
            <!-- 基础资料 -->
            <div class="font-[700] text-[16px] mb-[12px]">订单资料</div>
            <div>
                <a-descriptions :bordered="true" :column="1">
                    <a-descriptions-item label="订单号">{{ orderDetail.sn }}</a-descriptions-item>
                    <a-descriptions-item label="订单状态">{{ orderDetail.status == 10 ? '待支付'
                        : orderDetail.status == 20 ? '待使用'
                            : orderDetail.status == 30 ? '已使用'
                                : orderDetail.status == -1 ? '取消订单'
                                    : orderDetail.status == -2 ? '超时未支付'
                                        : '已退款(超时未使用)'
                    }}</a-descriptions-item>
                    <a-descriptions-item label="实付金额">{{ orderDetail.real_money }}</a-descriptions-item>
                    <a-descriptions-item label="创建时间">{{ orderDetail.create_time }}</a-descriptions-item>
                    <a-descriptions-item label="付款时间">{{ orderDetail.pay_time }}</a-descriptions-item>
                </a-descriptions>
            </div>


        </div>

        <div class="tableListContentClass mb-[12px]">
            <!-- 用户信息 -->
            <div class="font-[700] text-[16px] mb-[12px]">用户信息</div>
            <div>
                <a-descriptions :bordered="true" :column="1">
                    <a-descriptions-item label="用户名称">{{ orderDetail.user?.nickname }}</a-descriptions-item>
                    <a-descriptions-item label="联系电话">{{ orderDetail.user?.phone }}</a-descriptions-item>
                </a-descriptions>
            </div>
        </div>

        <div class="tableListContentClass mb-[12px]">
            <!-- 订单信息 -->
            <div class="font-[700] text-[16px] mb-[12px]">订单信息</div>
            <div>
                <a-descriptions :bordered="true" :column="1">
                    <a-descriptions-item label="优惠券名称">{{ orderDetail.coupon_name }}</a-descriptions-item>
                    <a-descriptions-item label="优惠券类型">{{
                        orderDetail.product_json && JSON.parse(orderDetail.product_json)?.type === 1 ? '满减券'
                        : orderDetail.product_json && JSON.parse(orderDetail.product_json)?.type === 2 ? '代金券' : '团购券'
                    }}</a-descriptions-item>
                    <a-descriptions-item label="优惠券发放类型">{{ orderDetail.coupon_type == 1 ? '商家' : '平台'
                    }}</a-descriptions-item>
                    <a-descriptions-item label="优惠券金额">{{
                        orderDetail.product_json && JSON.parse(orderDetail.product_json)?.price
                    }}</a-descriptions-item>
                    <a-descriptions-item label="核销时间">{{ orderDetail.use_time }}</a-descriptions-item>
                    <a-descriptions-item label="退款时间">{{ orderDetail.refund_time }}</a-descriptions-item>
                </a-descriptions>
            </div>
        </div>

        <div class="tableListContentClass mb-[12px]" v-if="false">
            <div class="font-[700] text-[16px] mb-[12px]">订单备注</div>
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


    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { orderDetails } from '../../request/api/order'
// import { message } from 'ant-design-vue'
const router = useRouter()
const route = useRoute()
const order_id = ref(route.query.id)

const orderDetail = ref<any>({}) //用户详情
const remark = ref('') //备注
const remarkLoading = ref(false) //备注加载




// 获取用户详情
const getUserDetails = () => {
    orderDetails({ order_id: order_id.value }).then((res) => {
        console.log(res, '订单详情')
        orderDetail.value = res.data
        remark.value = res.data.remark
    })
}

// 备注(触发回车)
const pressEnter = () => {
    remarkLoading.value = true
    // userRemark({ user_id: user_id.value, remark: remark.value })
    //     .then((res) => {
    //         if (res.code == 200) {
    //             message.success('备注成功')
    //             remarkLoading.value = false
    //             getUserDetails()
    //         } else {
    //             remarkLoading.value = false
    //         }
    //     })
    //     .catch(() => {
    //         remarkLoading.value = false
    //     })
}

getUserDetails()

</script>
<style lang="scss" scoped></style>
