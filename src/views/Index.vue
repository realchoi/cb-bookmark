<template>
    <div class="flex items-center w-full h-full">
        <!--书签分类目录树 start-->
        <div class="w-xs h-full">
            <n-tree block-line expand-on-click :data="bookmarkCategoryTree" :node-props="nodeProps"
                :expanded-keys="expandedTreeNodeKeys" :render-switcher-icon="renderSwitcherIcon"
                :render-suffix="renderSuffix" />
            <n-dropdown trigger="manual" placement="bottom-start" :show="showDropdown" :options="(dropdownOptions as any)"
                :x="dropdownX" :y="dropdownY" @select="handleSelect" @clickoutside="handleClickoutside" />
        </div>
        <!--书签分类目录树 end-->
        <!--书签条目列表 start-->
        <div class="flex flex-1 h-full ml flex-justify-center items-center">
            <div class="w-80% h-90% pt-24px pb-24px"
                style="background-color: white; border-radius: 8px; box-shadow: color-mix(in srgb, rgb( 60,64,67 ) 30%, transparent) 0 1px 2px 0, color-mix(in srgb, rgb( 60,64,67 ) 15%, transparent) 0 2px 6px 2px; overflow-y: auto;">
                <BookmarkItem :bookmark="bookmark" :key="bookmark.url" v-for="bookmark in bookmarkItems"></BookmarkItem>
            </div>
        </div>
        <!--书签条目列表 end-->
    </div>
    <!--新增书签信息的模态框 start-->
    <n-modal v-model:show="showAddItemModal" :mask-closable="false" preset="card" style="width: 600px;" title="添加新书签">
        <n-form :model="bookmarkItemForm" size="medium" label-placement="left">
            <n-form-item label="名称">
                <n-input v-model:value="bookmarkItemForm.name" @keydown.enter.prevent placeholder="请输入书签名称" />
            </n-form-item>
            <n-form-item label="网址">
                <n-input v-model:value="bookmarkItemForm.url" @keydown.enter.prevent placeholder="请输入书签网址" />
            </n-form-item>
            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content: flex-end">
                        <n-space>
                            <n-button @click="showAddItemModal = false">
                                取消
                            </n-button>
                            <n-button type="primary" @click="saveBookmarkItem">
                                保存
                            </n-button>
                        </n-space>
                    </div>
                </n-col>
            </n-row>
        </n-form>
    </n-modal>
    <!--新增书签信息的模态框 end-->
    <!--新增文件夹信息的模态框 start-->
    <n-modal v-model:show="showAddCategoryModal" :mask-closable="false" preset="card" style="width: 600px;" title="添加新文件夹">
        <n-form :model="bookmarkCategoryForm" size="medium" label-placement="left">
            <n-form-item label="名称">
                <n-input v-model:value="bookmarkCategoryForm.name" @keydown.enter.prevent placeholder="请输入名称" />
            </n-form-item>
            <n-row :gutter="[0, 24]">
                <n-col :span="24">
                    <div style="display: flex; justify-content: flex-end">
                        <n-space>
                            <n-button @click="showAddCategoryModal = false">
                                取消
                            </n-button>
                            <n-button type="primary" @click="saveBookmarkCategory">
                                保存
                            </n-button>
                        </n-space>
                    </div>
                </n-col>
            </n-row>
        </n-form>
    </n-modal>
    <!--新增文件夹信息的模态框 end-->
</template>

<script lang="ts" setup>
import { ref, h, onMounted } from 'vue'
import { NIcon, TreeOption, DropdownOption } from 'naive-ui'
import {
    Folder,
    FolderOpenOutline,
    CaretForward,
    EllipsisVertical
    // FileTrayFullOutline
} from '@vicons/ionicons5'
import BookmarkItem from '@/components/BookmarkItem.vue';
import axios from '@/utils/httpUtil'
import { useUserStore } from '@/store/user'
import type { GetBookmarkItemListInput, BookmarkItemDto } from '@/models/bookmarkItems/bookmarkItemModel'

const userStore = useUserStore()

/**书签分类目录树的数据 */
const bookmarkCategoryTree = ref<TreeOption[]>([{
    key: '0',
    label: '书签栏'
}])
/**书签条目的数据 */
const bookmarkItems = ref<BookmarkItemDto[]>([])

/**是否展示右键菜单 */
const showDropdown = ref(false)
/**右键菜单 */
const dropdownOptions = ref<DropdownOption[]>([
    {
        label: '添加新书签',
        key: 'add-item'
    },
    {
        label: '添加新文件夹',
        key: 'add-category'
    },
    {
        label: '重命名',
        key: 'rename'
    },
    {
        label: '删除',
        key: 'delete'
    }
])
const dropdownX = ref(0)
const dropdownY = ref(0)

/**展示新增书签条目的弹窗 */
const showAddItemModal = ref(false)
/**展示新增分类目录的弹窗 */
const showAddCategoryModal = ref(false)

const handleSelect = (key: string | number) => {
    window.$message.info(String(key) + ': ' + contextMenuClickedTreeNodeKey.value)
    showDropdown.value = false
    switch (key) {
        case 'add-item':
            showAddItemModal.value = true
            // 清空之前的表单
            bookmarkItemForm.value = {
                name: '',
                url: '',
                categoryId: '',
                userId: ''
            }
            break
        case 'add-category':
            // 清空之前的表单
            bookmarkCategoryForm.value = {
                name: '',
                parentId: '',
                userId: ''
            }
            showAddCategoryModal.value = true
            break
    }
}
const handleClickoutside = () => {
    showDropdown.value = false
}

/**新增书签条目的表单 */
const bookmarkItemForm = ref<{ name: string, url: string, categoryId: string, userId: string }>({
    name: '',
    url: '',
    categoryId: '',
    userId: ''
})

/**新增分类目录的表单 */
const bookmarkCategoryForm = ref<{ name: string, parentId: string, userId: string }>({
    name: '',
    parentId: '',
    userId: ''
})

/**
 * 保存书签
 */
const saveBookmarkItem = async () => {
    bookmarkItemForm.value.userId = userStore.userInfo.id
    bookmarkItemForm.value.categoryId = contextMenuClickedTreeNodeKey.value as string
    const result = await axios.post<string>('/bookmark/item', bookmarkItemForm.value)
    if (result) {
        window.$message.success('保存成功')
        await getBookmarkItemList(selectedTreeNodeKey.value as string)
    }
    else {
        window.$message.error('可能发生了一点错误...')
    }
    showAddItemModal.value = false
}

/**
 * 保存文件夹
 */
const saveBookmarkCategory = async () => {
    bookmarkCategoryForm.value.userId = userStore.userInfo.id
    bookmarkCategoryForm.value.parentId = contextMenuClickedTreeNodeKey.value as string
    const result = await axios.post<string>('/bookmark/category', bookmarkCategoryForm.value)
    if (result) {
        window.$message.success('保存成功')
        await getBookmarkCategoryTree()
        // await getBookmarkItemList(selectedTreeNodeKey.value as string)
    }
    else {
        window.$message.error('可能发生了一点错误...')
    }
    showAddCategoryModal.value = false
}

// 组建挂载后获取书签分类目录树的数据
onMounted(async () => {
    await getBookmarkCategoryTree()
})

/**展开的树节点的 key */
const expandedTreeNodeKeys = ref<Array<string | number>>([])
/**当前选中的树节点的 key */
const selectedTreeNodeKey = ref<string | number>('')
/**树节点右键菜单点击的节点的 key */
const contextMenuClickedTreeNodeKey = ref<string | number>('')

/**
 * 调用接口获取书签分类目录树数据
 */
const getBookmarkCategoryTree = async () => {
    if (userStore.loginStatus && userStore.userInfo && userStore.userInfo.id) {
        const result = await axios.get<TreeOption[]>(`/bookmark/category/tree?userId=${userStore.userInfo.id}`)
        if (result) {
            setTreeItemPrefix(result)
            bookmarkCategoryTree.value = result
        }
    }
    else {
        window.$dialog.error({
            title: '未登录',
            content: '请先登录后再使用'
        })
    }
}

/**
 * 调用接口获取书签分类目录树数据
 */
const getBookmarkItemList = async (categoryId: string) => {
    if (userStore.loginStatus && userStore.userInfo && userStore.userInfo.id) {
        const params: GetBookmarkItemListInput = {
            userId: userStore.userInfo.id,
            categoryId: categoryId
        }
        const result = await axios.post<BookmarkItemDto[]>(`/bookmark/item/list`, params)
        if (result) {
            bookmarkItems.value = result
        }
    }
    else {
        window.$dialog.error({
            title: '未登录',
            content: '请先登录后再使用'
        })
    }
}

/**给不同的树节点设置前缀图标 */
const setTreeItemPrefix = (tree: TreeOption[]) => {
    for (let index = 0; index < tree.length; index++) {
        let ele = tree[index];
        ele.prefix = folderPrefix
        if (ele.children) {
            setTreeItemPrefix(ele.children);
        }
    }
}

/**给树节点设置三个点选项图标 */
const renderSuffix = ({ option }: { option: TreeOption }) => {
    const { key } = option
    return h(NIcon, null, {
        default: () => h(EllipsisVertical, {
            onClick: (e: PointerEvent) => {
                showDropdown.value = true
                dropdownX.value = e.clientX
                dropdownY.value = e.clientY
                contextMenuClickedTreeNodeKey.value = key as string
                e.stopPropagation()
            }
        })
    })
}

/**
 * 渲染一个关闭的文件夹图标前缀
 */
const folderPrefix = () =>
    h(NIcon, null, {
        default: () => h(Folder)
    })

/**
 * 渲染一个打开的文件夹图标前缀
 */
const folderOpenOutlinePrefix = () =>
    h(NIcon, null, {
        default: () => h(FolderOpenOutline)
    })

// /**
//  * 渲染一个文件图标前缀
//  */
// const fileTrayFullOutlinePrefix = () =>
//     h(NIcon, null, {
//         default: () => h(FileTrayFullOutline)
//     })

/**点击树节点时改变前缀图标样式 */
// const updatePrefixWithExpaned = (
//     _keys: Array<string | number>,
//     _option: Array<TreeOption | null>,
//     meta: {
//         node: TreeOption | null
//         action: 'expand' | 'collapse' | 'filter'
//     }
// ) => {
//     if (!meta.node) return
//     switch (meta.action) {
//         case 'expand':
//             meta.node.prefix = folderOpenOutlinePrefix
//             break
//         case 'collapse':
//             meta.node.prefix = folderPrefix
//             break
//     }
// }

/**节点展开开关的样式 */
const renderSwitcherIcon = ({ option, expanded }: { option: TreeOption, expanded: boolean }) => {
    const { key } = option
    return h(NIcon, null, {
        default: () => h(CaretForward, {
            onClick: (e: PointerEvent) => {
                if (expanded) {
                    option.prefix = folderPrefix
                    expandedTreeNodeKeys.value = expandedTreeNodeKeys.value.filter(item => key !== item)
                }
                else {
                    option.prefix = folderOpenOutlinePrefix
                    expandedTreeNodeKeys.value.push(key as string)
                }
                e.stopPropagation()
            }
        })
    })
}

/**树节点属性 */
const nodeProps = ({ option }: { option: TreeOption }) => {
    const { key } = option
    return {
        async onClick() {
            if (!option.disabled) {
                // window.$message.info('[Click] ' + option.label)
                if (selectedTreeNodeKey.value !== key as string) {
                    selectedTreeNodeKey.value = key as string
                    // 点击切换到某个分类目录时，获取该目录下面的书签条目
                    await getBookmarkItemList(key as string)
                }
            }
        },
        // 树节点的右键菜单
        onContextmenu(e: MouseEvent): void {
            showDropdown.value = true
            dropdownX.value = e.clientX
            dropdownY.value = e.clientY
            contextMenuClickedTreeNodeKey.value = key as string
            e.preventDefault()
        }
    }
}
</script>