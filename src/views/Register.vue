<template>
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
            <n-button strong tertiary type="primary" @click="handleRegister">
                创建账号
            </n-button>
            <div>
                已有账号？👉
                <n-button strong secondary type="primary" @click="switchToLoginPage">
                    登录
                </n-button>
            </div>
        </n-space>
    </n-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/utils/httpUtil'
import type { RegisterInputDto, RegisterOutputDto } from '@/models/accounts/registerModel'
import { identityTypeEnum } from '@/models//accounts/identityTypeEnum'

const router = useRouter()

const form = ref<RegisterInputDto>({
    identityType: identityTypeEnum.phoneNumber,
    identifier: '',
    credential: '',
    nickName: '',
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
 * 注册
 */
const handleRegister = async () => {
    const params = form.value
    const result = await axios.post<RegisterOutputDto>('/account/register', params)
    if (result && result.userName) {
        console.log({ result })
        window.$dialog.success({
            title: '注册成功',
            content: '是否前往登录页面？',
            positiveText: '好的',
            onPositiveClick: () => {
                router.push({
                    name: 'Login'
                })
            }
        })
    }
}

const switchToLoginPage = () => {
    router.push({
        name: 'Login'
    })
}
</script>