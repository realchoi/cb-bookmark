<template>
    <div class="bookmark-item">
        <img class="favicon" :src="getFaviconUrlSelf(bookmark.url)">
        <div class="title">
            <span class="name">{{ bookmark.name }}</span>
            <span class="url">({{ bookmark.url }})</span>
        </div>

        <div class="action">
            <n-button size="tiny" type="primary" @click="open(bookmark.url)">
                打开
            </n-button>
            <n-button size="tiny" type="info" @click="edit">
                编辑
            </n-button>
            <n-popconfirm positive-text="删除" negative-text="不删了" @positive-click="handlePositiveClick"
                @negative-click="handleNegativeClick" :positive-button-props="{ type: 'error', size: 'tiny' }"
                :negative-button-props="{ size: 'tiny' }">
                <template #trigger>
                    <n-button size="tiny" type="error">
                        删除
                    </n-button>
                </template>
                确定删除当前书签？
            </n-popconfirm>
        </div>
    </div>
    <!--修改书签信息的模态框 start-->
    <n-modal v-model:show="showModal" :mask-closable="false" preset="card" style="width: 600px;" title="修改书签">
        <n-form :model="form" size="medium" label-placement="left">
            <n-form-item label="名称">
                <n-input v-model:value="form.name" @keydown.enter.prevent placeholder="请输入书签名称" />
            </n-form-item>
            <n-form-item label="网址">
                <n-input v-model:value="form.url" @keydown.enter.prevent placeholder="请输入书签网址" />
            </n-form-item>
            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content: flex-end">
                        <n-space>
                            <n-button @click="showModal = false">
                                取消
                            </n-button>
                            <n-button type="primary" @click="save">
                                保存
                            </n-button>
                        </n-space>
                    </div>
                </n-col>
            </n-row>
        </n-form>
    </n-modal>
    <!--修改书签信息的模态框 end-->
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from '@/utils/httpUtil'
import { useUserStore } from '@/store/user'

const props = defineProps<{
    /**书签信息 */
    bookmark: {
        id: string,
        name: string,
        url: string,
        categoryId: string
    }
}>()

const emits = defineEmits(['refresh'])

const userStore = useUserStore()

const form = ref<{ id: string, name: string, url: string, categoryId: string }>({
    id: props.bookmark.id,
    name: props.bookmark.name,
    url: props.bookmark.url,
    categoryId: props.bookmark.categoryId
})

const showModal = ref(false)

// const getFaviconUrl = (url: string) => {
//     // 生成网站 favicon URL 的逻辑
//     return 'https://www.google.com/s2/favicons?domain=' + url
// }

// const getFaviconUrl2 = (url: string) => {
//     // 生成网站 favicon URL 的逻辑
//     return 'https://favicongrabber.com/api/grab/' + url
// }

const getFaviconUrlSelf = (url: string) => {
    let hostname = new URL(url).hostname;
    return 'http://' + hostname + '/favicon.ico'
}

const open = (url: string) => {
    window.open(url, '_blank')
}

const edit = () => {
    showModal.value = true
}

const handlePositiveClick = async () => {
    const itemId = props.bookmark.id
    const userId = userStore.userInfo.id
    const result = await axios.delete<boolean>(`/bookmark/item/${itemId}?userId=${userId}`)
    if (result) {
        window.$message.success('已删除')
        emits('refresh', props.bookmark.categoryId)
    }
    else {
        window.$message.error('可能发生了一点错误...')
    }
}

const handleNegativeClick = () => {
    window.$message.info('取消删除')
}

/**
 * 保存书签
 */
const save = () => {
    window.$message.success('保存成功')
    showModal.value = false
}
</script>

<style scoped>
.bookmark-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #eee;
}

.favicon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
}

.title {
    flex: 1;
}

.name {
    font-weight: bold;
    font-size: 14px;
}

.url {
    color: #999;
    font-size: 12px;
}

.action {
    white-space: nowrap;
}

.action button {
    margin-left: 8px;
}
</style>