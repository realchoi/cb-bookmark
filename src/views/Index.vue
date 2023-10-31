<template>
    <div class="flex items-center w-full h-full">
        <div class="w-xs h-full">
            <BookmarkTree />
        </div>
        <div class="flex flex-1 h-full ml flex-justify-center items-center">
            <div class="w-80% h-90% pt-24px pb-24px"
                style="background-color: white; border-radius: 8px; box-shadow: color-mix(in srgb, rgb( 60,64,67 ) 30%, transparent) 0 1px 2px 0, color-mix(in srgb, rgb( 60,64,67 ) 15%, transparent) 0 2px 6px 2px; overflow-y: auto;">
                <BookmarkItem :bookmark="bookmark" :key="bookmark.url" v-for="bookmark in bookmarks"></BookmarkItem>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import BookmarkTree from '@/components/BookmarkTree.vue'
import BookmarkItem from '@/components/BookmarkItem.vue';

const bookmarks = [
    {
        name: "Choi's Notes",
        url: "https://smc.im"
    },
    {
        name: "百度一下，你就知道",
        url: "https://www.baidu.com"
    },
    {
        name: "Google",
        url: "https://www.google.com"
    },
    {
        name: "V2EX",
        url: "https://www.v2ex.com"
    },
    {
        name: "X。尽是新鲜事 / X",
        url: "https://twitter.com"
    },
    {
        name: "YouTube",
        url: "https://youtube.com"
    },
    {
        name: "UnoCSS",
        url: "https://unocss.dev"
    }
]
</script>