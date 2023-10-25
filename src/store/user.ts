import { defineStore } from "pinia"
import type { UserInfoDto } from '@/models/accounts/userModel'

export const useUserStore = defineStore({
    // id 必填，且需要唯一
    id: 'user',
    state: () => {
        return {
            name: '张三',
            /**是否已登录（true-已登录，false-未登录） */
            logState: false,
            /**用户资料信息 */
            userInfo: {} as UserInfoDto
        }
    },
    actions: {
        updateName(name: string) {
            this.name = name
        },
        /**
         * 设置登录状态
         * @param state 登录状态（true-已登录，false-未登录）
         */
        setLogState(state: boolean) {
            this.logState = state
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