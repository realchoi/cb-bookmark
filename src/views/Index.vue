<template>
    <div class="flex items-center w-full h-full">
        <!--书签分类目录树 start-->
        <div class="w-xs h-full">
            <n-tree block-line expand-on-click :data="bookmarkCategoryTree" :node-props="nodeProps"
                :on-update:expanded-keys="updatePrefixWithExpaned" />
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
</template>

<script lang="ts" setup>
import { ref, h, onMounted } from 'vue'
import { NIcon, TreeOption } from 'naive-ui'
import {
    Folder,
    FolderOpenOutline,
    // FileTrayFullOutline
} from '@vicons/ionicons5'
import BookmarkItem from '@/components/BookmarkItem.vue';
import axios from '@/utils/httpUtil'
import { useUserStore } from '@/store/user'
import type { GetBookmarkItemListInput, BookmarkItemDto } from '@/models/bookmarkItems/bookmarkItemModel'

const userStore = useUserStore()

/**书签分类目录树的数据 */
const bookmarkCategoryTree = ref<TreeOption[]>([])
/**书签条目的数据 */
const bookmarkItems = ref<BookmarkItemDto[]>([])

// 组建挂载后获取书签分类目录树的数据
onMounted(async () => {
    await getBookmarkCategoryTree()
})

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
const updatePrefixWithExpaned = (
    _keys: Array<string | number>,
    _option: Array<TreeOption | null>,
    meta: {
        node: TreeOption | null
        action: 'expand' | 'collapse' | 'filter'
    }
) => {
    if (!meta.node) return
    switch (meta.action) {
        case 'expand':
            meta.node.prefix = folderOpenOutlinePrefix
            break
        case 'collapse':
            meta.node.prefix = folderPrefix
            break
    }
}

/**树节点属性 */
const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
        async onClick() {
            if (!option.disabled) {
                // 点击某个分类目录时，获取该目录下面的书签条目
                window.$message.info('[Click] ' + option.label)
                await getBookmarkItemList(option.key as string)
            }
        }
    }
}
</script>