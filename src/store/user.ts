import { defineStore } from "pinia"
import type { UserInfoDto } from '@/models/accounts/userModel'

export const useUserStore = defineStore({
    // id 必填，且需要唯一
    id: 'user',
    state: () => {
        return {
            /**是否已登录（true-已登录，false-未登录） */
            loginStatus: false,
            /**用户资料信息 */
            userInfo: {} as UserInfoDto
        }
    },
    actions: {
        /**
         * 设置登录状态
         * @param status 登录状态（true-已登录，false-未登录）
         */
        setLoginStatus(status: boolean) {
            this.loginStatus = status
        },

        /**
         * 设置用户资料信息
         * @param userInfo 用户资料信息
         */
        setUserInfo(userInfo: UserInfoDto) {
            this.userInfo = userInfo
        }
    }
})