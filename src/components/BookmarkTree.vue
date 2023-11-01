<template>
    <n-tree block-line expand-on-click :data="bookmarkCategoryTree" :node-props="nodeProps"
        :on-update:expanded-keys="updatePrefixWithExpaned" />
</template>
  
<script lang="ts" setup>
import { h, ref, onMounted } from 'vue'
import { NIcon, TreeOption } from 'naive-ui'
import {
    Folder,
    FolderOpenOutline,
    // FileTrayFullOutline
} from '@vicons/ionicons5'
import axios from '@/utils/httpUtil'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
/**树的数据 */
const bookmarkCategoryTree = ref<TreeOption[]>([])

// 组建挂载后获取数据
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
        onClick() {
            if (!option.disabled) {
                window.$message.info('[Click] ' + option.label)
            }
        }
    }
}
</script>