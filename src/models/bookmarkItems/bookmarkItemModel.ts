/**
 * 获取书签条目列表入参
 */
export interface GetBookmarkItemListInput {
    /**用户 ID */
    userId: string,
    /**分类目录 id */
    categoryId: string
}

/**
 * 书签条目 DTO
 */
export interface BookmarkItemDto {
    /**主键 ID */
    id: string,
    /**书签名称 */
    name: string,
    /**书签网址 */
    url: string,
    /**分类目录 id */
    categoryId: string
}