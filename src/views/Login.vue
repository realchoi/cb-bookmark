<template>
    <div class="flex w-full items-center justify-center">
        <n-form ref="formRef" :model="form" size="medium" label-placement="left">
            <n-form-item label="账号">
                <n-input-group>
                    <n-select :style="{ width: '150px' }" v-model:value="form.identityType" :options="identityTypeOptions"
                        @update:value="handleUpdateIdentityType" />
                    <n-input v-model:value="form.identifier" @keydown.enter.prevent :placeholder="identifierPlaceholder" />
                </n-input-group>
            </n-form-item>
            <n-form-item label="密码">
                <n-input v-model:value="form.credential" type="password" @keydown.enter.prevent placeholder="请输入密码" />
            </n-form-item>
            <n-space>
                <n-button strong tertiary type="primary" @click="handleLogin">
                    登录
                </n-button>
                <div>
                    还没有账号？👉
                    <n-button strong secondary type="primary" @click="switchToRegisterPage">
                        创建账号
                    </n-button>
                </div>
            </n-space>
        </n-form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import axios from '@/utils/httpUtil'
import { setLocalStorage } from '@/utils/localStorage'
import type { LoginInputDto, LoginOutputDto } from '@/models/accounts/loginModel'
import { identityTypeEnum } from '@/models//accounts/identityTypeEnum'

const router = useRouter()
const userStore = useUserStore()

const form = ref<LoginInputDto>({
    identityType: identityTypeEnum.phoneNumber,
    identifier: '',
    credential: ''
})

const identifierPlaceholder = ref('请输入手机号')

const identityTypeOptions = ref([
    {
        label: '手机号',
        value: identityTypeEnum.phoneNumber
    },
    {
        label: '电子邮箱',
        value: identityTypeEnum.email
    },
    {
        label: '用户名',
        value: identityTypeEnum.userName
    }
])

const handleUpdateIdentityType = (value: number) => {
    switch (value) {
        case identityTypeEnum.phoneNumber:
            identifierPlaceholder.value = '请输入手机号'
            break
        case identityTypeEnum.email:
            identifierPlaceholder.value = '请输入电子邮箱'
            break
        case identityTypeEnum.userName:
            identifierPlaceholder.value = '请输入用户名'
            break
    }
}

/**
 * 登录
 */
const handleLogin = async () => {
    const params = form.value
    const result = await axios.post<LoginOutputDto>('/account/login', params)
    if (result && result.accessToken) {
        setLocalStorage('accessToken', result.accessToken)
        userStore.setLoginStatus(true)
        userStore.setUserInfo({
            identityType: result.identityType,
            identifier: result.identifier,
            userName: result.userName,
            nickName: result.nickName,
            avatar: result.avatar
        })
        router.replace('/')
    }
}

const switchToRegisterPage = () => {
    router.push({
        name: 'Register'
    })
}
</script>