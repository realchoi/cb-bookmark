/**
 * 书签文件夹树
 */
export interface FolderTreeDto {
    /**主键 ID */
    id: string,
    /**文件夹名称 */
    name: string,
    /**前缀 */
    prefix: () => {},
    /**子集文件夹 */
    children: FolderTreeDto[]
}