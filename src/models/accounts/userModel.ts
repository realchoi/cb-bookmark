import { identityTypeEnum } from "./identityTypeEnum"

/**
 * 用户资料信息
 */
export interface UserInfoDto {
    /**用户 Id，关联 user_info 表的主键 */
    id: string,
    /**登录类型 */
    identityType: identityTypeEnum,
    /**标识（手机号、邮箱、用户名或第三方应用的唯一标识） */
    identifier: string,
    /**用户名（唯一） */
    userName: string,
    /**昵称 */
    nickName: string,
    /**头像 URL */
    avatar?: string
}