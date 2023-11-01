/**
 * 书签分类目录树
 */
export interface BookmarkCategoryTreeDto {
    /**主键 ID */
    id: string,
    /**分类目录名称 */
    name: string,
    /**前缀 */
    prefix: () => {},
    /**是否是叶子节点 */
    isLeaf: boolean,
    /**子集文件夹 */
    children: BookmarkCategoryTreeDto[]
}