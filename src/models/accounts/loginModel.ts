import { identityTypeEnum } from "./identityTypeEnum"

/**
 * 登录入参
 */
export interface LoginInputDto {
    /**登录类型 */
    identityType: identityTypeEnum,
    /**标识（手机号、邮箱、用户名或第三方应用的唯一标识） */
    identifier: string,
    /**密码凭证（站内的保存密码，站外的不保存或保存 token） */
    credential: string
}

/**
 * 登录出参
 */
export interface LoginOutputDto {
    /**登录类型 */
    identityType: identityTypeEnum,
    /**标识（手机号、邮箱、用户名或第三方应用的唯一标识） */
    identifier: string,
    /**用户名（唯一） */
    userName: string,
    /**昵称 */
    nickName: string,
    /**头像 URL */
    avatar?: string,
    /**请求接口的 JWT */
    accessToken: string
}