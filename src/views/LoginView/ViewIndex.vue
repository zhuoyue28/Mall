<template>
    <div class="w-[100vh] h-[100vh] banner bg-[#e8f0fe] p-[50px] md:p-[40px]">
        <div class="h-[100px]">
            <img class="xl:w-[100px] xl:h-[100px] lg:w-[80px] lg:h-[80px] md:w-[60px] md:h-[60px] sm:w-[40px] sm:h-[40px]"
                src="../../assets/image/loginLogo.png" alt="">
        </div>

        <div class="flex justify-between 2xl:pr-[200px] xl:pr-[100px]
         xl:pt-[50px] lg:pr-[80px] md:pr-0 sm:pr-[30px]  items-center
         " style="height: calc(100vh - 250px);">
            <div class=" w-[100px] h-[100px]"></div>
            <div class="
                bg-[#fff]
                lg:pt-[30px] sm:pt-[20px]
                 rounded-[8px] xl:w-[400px] xl:h-[450px] lg:w-[350px] lg:h-[400px] md:w-[300px] md:h-[auto]
                sm:w-[40%] sm:h-[auto]
                lg:p-[40px] pt-[40px] sm:p-[20px]">
                <div class="text-[20px] font-[700] text-[#000] text-center
                 xl:mb-[40px] lg:mb-[40px] md:mb-[20px] sm:mb-[12px]">登 录</div>


                <a-form :model="data.formState" name="basic" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }"
                    autocomplete="off" @finish="methods.onFinish" @finishFailed="methods.onFinishFailed"
                    style="width: 100%;">
                    <a-form-item label="" name="username" :rules="[{ required: true, message: '请输入账号!' }]"
                        class="lg:mb-[20px] xl:mb-[40px] md:mb-[10px]">
                        <a-input class="lg:h-[40px]" v-model:value="data.formState.username" />
                    </a-form-item>

                    <a-form-item label="" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
                        <a-input-password class="lg:h-[40px]" v-model:value="data.formState.password" />
                    </a-form-item>

                    <a-form-item name="remember" :wrapper-col="{ offset: 0, span: 24 }" class="xl:mb-[40px] lg:mb-[40px]
                     md:mb-[20px] sm:mb-[10px]
                    ">
                        <a-checkbox v-model:checked="data.formState.remember">记住密码</a-checkbox>
                    </a-form-item>

                    <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                        <a-button class="w-[100%]" type="primary" html-type="submit" size="large"
                            :loading="data.okLoading">登
                            录</a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, inject } from 'vue';
import { login } from "@/request/api/loginapi/login"
import { menuList } from '@/request/api/menu/menu';
import { useRouter } from 'vue-router';
interface FormState {//登录表单数据类型
    username: string;
    password: string;
    remember: boolean;
}

interface dataType {//定义变量类型
    router: any,
    formState: FormState,
    okLoading: boolean,
    messageFn: Function,
    str: string | undefined,
}


// 定义变量
const data = reactive<dataType>({
    router: useRouter(),//路由
    formState: {//登录表单数据
        username: '',
        password: '',
        remember: true,
    },
    okLoading: false,//确定按钮加载
    messageFn: inject('messageFn') as Function,//APP.vue传递方法
    str: inject('str'),
})


// 定义方法
const methods = reactive({
    onFinish: (values: any) => {//登录验证成功
        data.okLoading = true
        console.log('Success:', values);
        login({ account: data.formState.username, password: data.formState.password }).then((res) => {
            console.log(res, '登录接口');
            if (res.code == 200) {
                data.messageFn('登录成功', 'success')
                const mallToken = res.data.token
                const adminInfo = res.data.admin
                localStorage.setItem('mallToken', mallToken)
                localStorage.setItem('adminInfo', JSON.stringify(adminInfo))
                menuList({}).then(res => {
                    localStorage.setItem('menuList', JSON.stringify(res.data))
                    data.router.push('/')
                })
                
            } else {
                data.okLoading = false
            }
        }).catch(() => {
            data.okLoading = false
        })
    },
    onFinishFailed: (errorInfo: any) => {//登录表单验证失败
        console.log('Failed:', errorInfo);
    },

})

</script>

<style lang="scss" scoped>
.banner {
    width: 100vw;
    height: 100vh;
    background-image: url('../../assets/image/loginbanner.jpg');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center center;
}
</style>../../request/api/loginapi/login