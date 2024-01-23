<template>
    <div class="tableListClass">
        <a-breadcrumb>
            <a-breadcrumb-item>系统设置</a-breadcrumb-item>
            <a-breadcrumb-item>员工管理</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tableListHeaderClass">

            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off">
                <a-form-item label="员工名称" name="keyword">
                    <a-input v-model:value="data.formHeader.keyword">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
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
        <div class="tableListContentClass">
            <div class="mb-[12px]">
                <a-button type="primary" @click="methods.add">新建角色</a-button>
            </div>
            <a-table :dataSource="data.tableData" :columns="data.columns" rowKey="id" :loading="data.tableLoading"
                :pagination="false">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'role_name'">
                        <!-- <span v-if="record.role?.role_name" class="text-[#1677ff]"> {{ record.role?.role_name }}</span>
                        <span v-else class="text-[#FF4D4F]">暂无绑定角色</span> -->

                        <a-tag v-if="record.role?.role_name" color="#87d068">{{ record.role?.role_name }}</a-tag>
                        <a-tag v-else color="#FF4D4F">暂无绑定角色</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <a-switch class="bg-[#898989]" :checkedValue="1" :uncheckedValue="0" v-model:checked="record.status"
                            @change="(val) => { methods.statusEdit(val, record) }" />
                    </template>
                    <template v-if="column.dataIndex === 'action'">
                        <a-button type="link" @click="methods.ChangePassword(record.id)">修改密码</a-button>
                        <a-button type="link" @click="methods.edit(record)">编辑</a-button>
                        <a-button type="link" danger @click="methods.del(record)">删除</a-button>
                    </template>
                </template>
            </a-table>

            <div class="flex mt-[12px] items-center justify-end">
                <a-pagination v-model:current="data.pagination.current" v-model:pageSize="data.pagination.pageSize"
                    :total="data.pagination.total" show-size-changer show-quick-jumper @change="methods.pageChange" />
            </div>
        </div>

        <!-- 修改密码 -->
        <a-modal v-model:open="data.ResetPShow" title="修改密码" @ok="methods.ResetPHandleOk"
            @cancel="methods.ResetPHandleCancel" :confirmLoading="data.ResetPLoading" okText="确定" cancelText="取消">
            <a-form ref="formResetP" :model="data.formResetP" name="horizontal_login" autocomplete="off"
                :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="旧密码" name="old_password" :rules="[{ required: true, message: '请输入旧密码' }]">
                    <a-input v-model:value="data.formResetP.old_password" type="password" placeholder="请输入旧密码" />
                </a-form-item>
                <a-form-item label="新密码" name="password" :rules="[{ required: true, message: '请输入新密码' }]">
                    <a-input v-model:value="data.formResetP.password" type="password" placeholder="请输入新密码" />
                </a-form-item>
                <a-form-item label="确认密码" name="confirm_password" :rules="[
                    { required: true, validator: methods.checkPassword }]">
                    <a-input v-model:value="data.formResetP.confirm_password" type="password" placeholder="请输入确认密码" />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 添加/编辑  -->
        <a-modal v-model:open="data.AddEShow" :title="data.isEdit ? '编辑管理员' : '新建管理员'" @ok="methods.AddEHandleOk"
            @cancel="methods.AddEHandleCancel" :confirmLoading="data.AddELoading" okText="确定" cancelText="取消">
            <a-form ref="formAddE" :model="data.formAddE" name="horizontal_login" autocomplete="off"
                :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                <a-form-item label="员工名称" name="real_name" :rules="[{ required: true, message: '请输入员工名称' }]">
                    <a-input v-model:value="data.formAddE.real_name" placeholder="请输入员工名称" />
                </a-form-item>
                <a-form-item label="员工头像" name="avatar" :rules="[{ required: true, message: '请上传头像' }]">
                    <a-upload v-model:file-list="data.fileList" name="file" list-type="picture-card" class="avatar-uploader"
                        :show-upload-list="false" action="/zyapi/admin/com/uploadeFile"
                        :before-upload="methods.beforeUpload" @change="methods.handleChange">
                        <img v-if="data.imageUrl" :src="data.imageUrl" alt="avatar" />
                        <div v-else>
                            <loading-outlined v-if="data.upLoading"></loading-outlined>
                            <plus-outlined v-else></plus-outlined>
                            <div class="ant-upload-text">上传</div>
                        </div>
                    </a-upload>
                </a-form-item>
                <a-form-item label="登录账号" name="account" :rules="[{ required: true, message: '请输入新密码' }]">
                    <a-input v-model:value="data.formAddE.account" placeholder="请输入新密码" />
                </a-form-item>
                <a-form-item label="员工角色" name="roles" :rules="[{ required: true, message: '请选择员工角色' }]">
                    <a-select v-model:value="data.formAddE.roles" style="width: 100%" placeholder="请选择员工角色"
                        :options="data.roleData" :fieldNames="{ label: 'role_name', value: 'id' }"
                        :allowClear="true"></a-select>
                </a-form-item>
                <a-form-item label="登录密码" name="password" :rules="[{ required: true, message: '请输入登录密码' }]">
                    <a-input :disabled="data.isEdit" v-model:value="data.formAddE.password" type="password"
                        placeholder="请输入登录密码" />
                </a-form-item>
            </a-form>
        </a-modal>

    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, inject, h } from 'vue';
import { adminList, adminUpdateStatus, adminUpdatePassword, adminStore, adminUpdate, roleList, adminDelete } from "../../../request/api/adminList/index";
import type { FormInstance } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import type { UploadProps, UploadChangeParam } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
// const formRef = ref<FormInstance>();// 新增弹窗ref
const formHeader = ref<FormInstance>()// 新增header表单
const formResetP = ref<FormInstance>()// 修改密码表单ref
const formAddE = ref<FormInstance>()// 添加表单ref
const data = reactive({
    formHeader: {
        keyword: '',//角色名称
    },
    columns: [// 表头
        {
            title: '员工名称',
            dataIndex: 'real_name',
            key: 'real_name',
        },
        {
            title: '登录账户',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '角色名称',
            dataIndex: 'role_name',
            key: 'role_name',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],
    tableLoading: false,// 表格加载
    tableData: [],// 表格数据
    router: useRouter(),// 路由
    pagination: {// 分页
        current: 1,
        pageSize: 10,
        total: 0
    },
    formResetP: {// 修改密码 表单
        old_password: '',
        password: '',
        confirm_password: '',
    },
    ResetPShow: false,// 修改密码 弹窗显示状态
    ResetPID: 0,// 修改密码 ID
    ResetPLoading: false,// 修改密码 loading
    isEdit: false,// 是否是编辑
    AddEShow: false,// 添加弹窗显示
    AddELoading: false,// 添加弹窗loading
    AddEID: 0,// 编辑ID
    formAddE: ref<{ [key: string]: any, roles: any }>(// 添加表单 
        {
            real_name: '',
            avatar: '',
            account: '',
            roles: null,
            password: ''
        }
    ),
    fileList: ref<UploadProps['fileList']>([// 上传文件 列表
        // {
        //     uid: '-1',
        //     name: 'image.png',
        //     status: 'done',
        //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
    ]),
    upLoading: false,// 上传loading
    imageUrl: '',// 上传图片路径    
    roleData: [],// 角色列表
    contentStyle: { style: { fontSize: '15px', fontWeight: '500' } },//节点样式
    content: () => {//插入节点
        return h('div', data.contentStyle, '确认删除该员工吗？')
    },
})
const methods = reactive({
    getData: (page?: number, limit?: number) => {
        data.tableLoading = true
        adminList({
            ...data.formHeader, page: page || 1, limit: limit || 10
        }).then(res => {
            data.tableData = res.data.data
            data.tableLoading = false
            data.pagination.total = res.data.total
            data.pagination.current = res.data.current_page
            data.pagination.pageSize = res.data.per_page
        })
    },
    messageFn: inject('messageFn') as Function,//APP.vue传递方法
    Repossess: () => { // 重置
        formHeader.value?.resetFields()
        methods.getData()
    },
    // viewFn: (id: number | null, type: string) => {//type 1查看 2编辑 3添加
    //     if (!id) {
    //         data.router.push({ path: '/addAdmin', query: { type } })
    //         return
    //     }
    //     data.router.push({ path: '/addAdmin', query: { id, type } })
    // },
    statusEdit: (val, row: any) => {// 状态修改
        adminUpdateStatus({ status: val ? 1 : 0, id: row.id }).then(() => {
            methods.messageFn('修改成功', 'success')
            methods.getData()
        })
    },
    pageChange: (val) => {// 分页
        methods.getData(val, data.pagination.pageSize)
    },
    ChangePassword: (id) => {// 修改密码 弹窗 打开
        data.ResetPShow = true
        data.ResetPID = id
    },
    ResetPHandleCancel: () => {// 修改密码 弹窗取消
        data.ResetPShow = false
        formResetP.value!.resetFields()
    },
    ResetPHandleOk: () => {// 修改密码 弹窗 确定
        data.ResetPLoading = true
        formResetP.value!.validate().then(() => {
            adminUpdatePassword({
                id: data.ResetPID,
                ...data.formResetP
            }).then(res => {
                data.ResetPLoading = false
                if (res.code == 200) {
                    methods.messageFn('修改成功', 'success')
                    methods.ResetPHandleCancel()
                    methods.getData(data.pagination.current, data.pagination.pageSize)
                }
            }).catch(() => {
                data.ResetPLoading = false
            })
        }).catch(() => {
            data.ResetPLoading = false
        })
    },
    checkPassword: (rule, value, callback) => {// 校验密码
        if (value === '') {
            callback(new Error('请输入确认密码'));
        } else if (value !== data.formResetP.password) {
            callback(new Error('两次输入密码不一致'));
        } else {
            callback();
        }
    },
    AddEHandleOk: () => {// 添加弹窗 确定
        data.AddELoading = true
        formAddE.value!.validate().then(() => {
            let params: any = { ...data.formAddE }
            params.roles = params.roles + ''
            if (data.isEdit) {
                adminUpdate({
                    id: data.AddEID,
                    ...params,
                }).then(res => {
                    data.AddELoading = false
                    if (res.code == 200) {
                        methods.messageFn('修改成功', 'success')
                        methods.AddEHandleCancel()
                        methods.getData(data.pagination.current, data.pagination.pageSize)
                    }
                }).catch(() => {
                    data.AddELoading = false
                })

                return
            }
            adminStore({
                ...params,
            }).then(res => {
                data.AddELoading = false
                if (res.code == 200) {
                    methods.messageFn('添加成功', 'success')
                    methods.AddEHandleCancel()
                    methods.getData(1, data.pagination.pageSize)
                }
            }).catch(() => {
                data.AddELoading = false
            })
        }).catch(() => {
            data.AddELoading = false
        })
    },
    AddEHandleCancel: () => {// 添加弹窗 取消
        data.AddEShow = false
        data.fileList = []
        data.isEdit = false
        data.imageUrl = ''
        formAddE.value!.resetFields()
        data.formAddE = {
            roles: null,
            real_name: '',
            avatar: '',
            account: '',
            password: ''
        }
    },
    beforeUpload: (file: any) => {// 上传图片 校验 
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            methods.messageFn('只能上传jpg或png!', 'error');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            methods.messageFn('图片最大不能超过 10MB!', 'error');
        }
        return isJpgOrPng && isLt10M;
    },
    handleChange: (info: UploadChangeParam) => {// 上传图片 状态变更
        if (info.file.status === 'uploading') {
            data.upLoading = true;
            return;
        }
        if (info.file.status === 'done') {
            data.upLoading = false;
            data.imageUrl = info.file.response.data.path;
            data.formAddE.avatar = info.file.response.data.path
            methods.messageFn('上传成功', 'success')
        }
        if (info.file.status === 'error') {
            data.upLoading = false;
            // message.error('upload error');
            methods.messageFn('上传失败', 'error')
        }
    },
    add: () => {// 添加
        data.isEdit = false
        data.AddEShow = true
    },
    edit: (row: any) => {// 编辑
        data.isEdit = true
        data.AddEShow = true
        data.AddEID = row.id
        data.formAddE = {
            real_name: row.real_name,
            avatar: row.avatar,
            roles: Number(row.roles),
            account: row.account,
            password: row.password
        }
        data.fileList = [
            {
                uid: '-1',
                name: 'avatar',
                status: 'done',
                url: row.avatar
            }
        ]
        data.imageUrl = row.avatar
    },
    del: (row: any) => {// 删除
        Modal.confirm({
            title: '删除提示',
            content: data.content,
            okText: '确认',
            cancelText: '取消',
            icon: h(WarningOutlined),
            maskClosable: true,
            autoFocusButton: null,
            onOk: () => {
                adminDelete({ id: row.id }).then(res => {
                    if (res.code == 200) {
                        methods.messageFn('删除成功', 'success')
                        methods.getData(data.pagination.current, data.pagination.pageSize)
                    }
                })
            },
            onCancel: () => { }
        })
    },
    getRoleList: () => {// 获取角色列表
        roleList({ page: 1, limit: 999 }).then(res => {
            data.roleData = res.data.data
        })
    }
})



// 获取表格数据
methods.getData()

// 获取角色列表
methods.getRoleList()

</script>

<style lang="scss" scoped>
.nihao {
    border-top: 1px solid #e8e8e8;
    padding-top: 12px;
}
</style>