<template>
    <n-tree block-line expand-on-click :data="treeData" :node-props="nodeProps"
        :on-update:expanded-keys="updatePrefixWithExpaned" key-field="id" label-field="name" />
</template>
  
<script lang="ts" setup>
import { h, ref, onMounted } from 'vue'
import { NIcon, TreeOption } from 'naive-ui'
import {
    Folder,
    FolderOpenOutline,
    FileTrayFullOutline
} from '@vicons/ionicons5'
import axios from '@/utils/httpUtil'
import { useUserStore } from '@/store/user'
import type { FolderTreeDto } from '@/models/folders/folderTreeModel'

const userStore = useUserStore()

const getFolderTree = async () => {
    if (userStore.loginStatus && userStore.userInfo && userStore.userInfo.id) {
        const result = await axios.get<FolderTreeDto[]>(`/bookmark/tree?userId=${userStore.userInfo.id}`)
        if (result) {
            setTreeItemPrefix(result)
            treeData.value = result
        }
    }
    else {
        window.$dialog.error({
            title: '未登录',
            content: '请先登录后再使用'
        })
    }
}

onMounted(async () => {
    await getFolderTree()
})

const setTreeItemPrefix = (tree: FolderTreeDto[]) => {
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

/**
 * 渲染一个文件图标前缀
 */
const fileTrayFullOutlinePrefix = () =>
    h(NIcon, null, {
        default: () => h(FileTrayFullOutline)
    })

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
const nodeProps = ({ option }: { option: TreeOption }) => {
    return {
        onClick() {
            if (!option.children && !option.disabled) {
                window.$message.info('[Click] ' + option.name)
            }
        }
    }
}

const treeData = ref<FolderTreeDto[]>([])

const data = [
    {
        id: '书签栏',
        name: '书签栏',
        prefix: folderPrefix,
        children: [
            {
                id: '空的',
                name: '空的',
                disabled: true,
                prefix: folderPrefix
            },
            {
                id: '我的文件',
                name: '我的文件',
                prefix: folderPrefix,
                children: [
                    {
                        name: 'template.txt',
                        id: 'template.txt',
                        prefix: fileTrayFullOutlinePrefix
                    }
                ]
            }
        ]
    }
]
</script>