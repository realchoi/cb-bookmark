import { TreeOption } from 'naive-ui'

/**
 * 书签分类目录树
 */
export interface BookmarkCategoryTreeDto extends TreeOption {
    parentId?: string | undefined | null
}