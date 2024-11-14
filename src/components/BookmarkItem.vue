<template>
    <n-spin :show="loading">
        <div class="bookmark-item">
            <img class="favicon" :src="getFaviconUrlSelf(bookmark.url)">
            <div class="title" @dblclick="startEdit" v-click-outside="cancelEdit">
                <template v-if="!isEditing">
                    <span class="name">{{ bookmark.name }}</span>
                    <span class="url">({{ bookmark.url }})</span>
                </template>
                <template v-else>
                    <n-input-group>
                        <n-input v-model:value="editForm.name" @keyup.enter="saveEdit" @keyup.esc="cancelEdit"
                            ref="nameInputRef" size="tiny" />
                        <n-input v-model:value="editForm.url" @keyup.enter="saveEdit" @keyup.esc="cancelEdit"
                            size="tiny" />
                    </n-input-group>
                </template>
            </div>

            <div class="action">
                <n-button size="tiny" type="primary" @click="open(bookmark.url)">
                    打开
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
    </n-spin>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
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
const isEditing = ref(false)
const nameInputRef = ref<HTMLInputElement | null>(null)

const editForm = ref({
    id: props.bookmark.id,
    name: props.bookmark.name,
    url: props.bookmark.url,
    categoryId: props.bookmark.categoryId,
    userId: userStore.userInfo.id
})

const loading = ref(false)

// 开始编辑
const startEdit = () => {
    isEditing.value = true
    // 重置编辑表单
    editForm.value = {
        id: props.bookmark.id,
        name: props.bookmark.name,
        url: props.bookmark.url,
        categoryId: props.bookmark.categoryId,
        userId: userStore.userInfo.id
    }
    // 等待 DOM 更新后聚焦输入框
    nextTick(() => {
        nameInputRef.value?.focus()
    })
}

// 保存编辑
const saveEdit = async () => {
    loading.value = true
    try {
        const result = await axios.post<string>('/bookmark/item', editForm.value)
        if (result) {
            window.$message.success('保存成功')
            isEditing.value = false
            emits('refresh', props.bookmark.categoryId)
        } else {
            window.$message.error('保存失败')
        }
    } finally {
        loading.value = false
    }
}

// 取消编辑
const cancelEdit = () => {
    isEditing.value = false
}

const getFaviconUrlSelf = (url: string) => {
    let hostname = new URL(url).hostname;
    return 'http://' + hostname + '/favicon.ico'
}

const open = (url: string) => {
    window.open(url, '_blank')
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

// 添加 vClickOutside 指令
const vClickOutside = {
    mounted(el: HTMLElement, binding: { value: () => void }) {
        el._clickOutside = (event: Event) => {
            if (!(el === event.target || el.contains(event.target as Node))) {
                binding.value()
            }
        }
        document.addEventListener('click', el._clickOutside)
    },
    unmounted(el: HTMLElement) {
        if (el._clickOutside) {
            document.removeEventListener('click', el._clickOutside)
        }
    }
}
</script>

<style scoped>
.bookmark-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #eee;
    position: relative;
}

.favicon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
}

.title {
    flex: 1;
    cursor: text;
}

.title :deep(.n-input-group) {
    width: 100%;
}

.title :deep(.n-input) {
    margin-right: 8px;
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