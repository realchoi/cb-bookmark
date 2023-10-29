import router from '@/router'
import axios, { type AxiosInstance, AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { useUserStore } from '@/store/user'
import { getLocalStorage, removeLocalStorage } from '@/utils/localStorage'
import type { UserInfoDto } from '@/models/accounts/userModel'

const URL: string = '/api'

enum RequestEnums {
    /**超时时间 */
    TIMEOUT = 2000
}

enum ResponseEnums {
    /**登录失效 */
    UNAUTHORIZED = 401,
    /**请求成功 */
    SUCCESS = 200
}

/**自定义异常 */
interface ErrorOutput {
    /**错误码 */
    code: number,
    /**状态描述 */
    status: string,
    /**错误信息 */
    message: string,
    /**错误详情 */
    details: Array<object>
}

const config = {
    // 默认地址
    baseURL: URL as string,
    // 设置超时时间
    timeout: RequestEnums.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: true
}

class RequestHttp {
    // 定义成员变量并指定类型
    service: AxiosInstance

    // 构造函数
    public constructor(config: AxiosRequestConfig) {
        // 实例化 axios
        this.service = axios.create(config)

        /**
         * 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         * token 校验(JWT) : 接受服务器返回的 token，存储到 vuex/pinia/本地储存当中
         */
        this.service.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                config.headers.set('Content-Type', config.headers?.['Content-Type'] ?? 'application/json;charset=UTF-8')    // 传参方式json
                const token = getLocalStorage('accessToken')
                const bearerToken = JSON.stringify(token) === '{}' ? '' : `Bearer ${token}`
                if (bearerToken) {
                    config.headers.set('Authorization', bearerToken)    // 请求头中携带 token 信息
                }
                return config
            },
            (error: AxiosError) => {
                // 请求报错
                Promise.reject(error)
            }
        )

        /**
         * 响应拦截器
         * 服务器换返回信息 -> [拦截统一处理] -> 客户端 JS 获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data } = response   // 解构

                if (data.code === ResponseEnums.UNAUTHORIZED) {
                    // 登录信息失效，应跳转到登录页面，并清空本地的 token
                    removeLocalStorage('accessToken')
                    router.replace({
                        path: 'login'
                    })
                    return Promise.reject(data)
                }
                // 全局错误拦截
                if (data.code && data.code !== ResponseEnums.SUCCESS) {
                    window.$message.error(data)
                    return Promise.reject(data)
                }
                return data
            },
            (error: AxiosError) => {
                // 返回类型
                const { responseType } = error.config as AxiosRequestConfig<any>

                // 如果返回的是 blob 类型，则需要重新读取错误信息
                if (responseType === 'blob') {
                    // 捕获错误信息
                    const reader = new FileReader()
                    reader.readAsText(error.response?.data as Blob)
                    reader.onload = () => {
                        const { code, message } = JSON.parse(reader.result as string) as ErrorOutput
                        window.$message.error(`${message}（错误码：${code}）`)
                    }
                } else {
                    if (error.response) {
                        const { data, status } = error.response
                        // 如果 data 不为空，则返回的是自定义错误
                        if (data) {
                            const { code, message } = data as ErrorOutput
                            window.$message.error(`${message}（错误码：${code}）`)
                        }
                        // 否则，返回的是系统错误
                        else {
                            this.showMessage(status)
                        }
                        if (status === ResponseEnums.UNAUTHORIZED) {
                            // 登录信息失效，应跳转到登录页面，并清空本地的 token
                            removeLocalStorage('accessToken')
                            const userStore = useUserStore()
                            userStore.setLoginStatus(false)
                            userStore.setUserInfo({} as UserInfoDto)
                            router.replace({
                                path: 'login'
                            })
                        }
                        return Promise.reject(data)
                    }
                }
                if (!window.navigator.onLine) {
                    window.$message.error('网络连接失败')
                }
            }
        )
    }

    /**
     * 处理响应状态码
     * @param status 响应状态码
     * @param customizedMsg 自定义错误信息
     */
    showMessage(status: number, customizedMsg: string = ''): void {
        let message: string = ''
        switch (status) {
            case 400:
                message = "请求错误（错误码：400）"
                break
            case 401:
                message = "未授权，请重新登录（错误码：401）"
                break
            case 403:
                message = "拒绝访问（错误码：403）"
                break
            case 404:
                message = "请求出错（错误码：404）"
                break
            case 408:
                message = "请求超时（错误码：408）"
                break
            case 500:
                message = "服务器错误（错误码：500）"
                break
            case 501:
                message = "服务未实现（错误码：501）"
                break
            case 502:
                message = "网络错误（错误码：502）"
                break
            case 503:
                message = "服务不可用（错误码：503）"
                break
            case 504:
                message = "网络超时（错误码：504）"
                break
            case 505:
                message = "HTTP 版本不受支持（错误码：505）"
                break
            default:
                message = `连接出错（错误码：${status}）`
        }
        window.$message.error(customizedMsg || message)
    }

    // 常用方法封装

    /**
     * GET 请求
     * @param url 请求地址
     * @param params 请求参数
     * @returns 
     */
    get<T>(url: string, config?: AxiosRequestConfig<any>): Promise<T> {
        return this.service.get(url, config)
    }

    /**
     * POST 请求
     * @param url 请求地址
     * @param params 请求参数
     * @returns 
     */
    post<T>(url: string, params?: object, config?: AxiosRequestConfig<any>): Promise<T> {
        return this.service.post(url, params, config)
    }

    /**
     * PUT 请求
     * @param url 请求地址
     * @param params 请求参数
     * @returns 
     */
    put<T>(url: string, params?: object, config?: AxiosRequestConfig<any>): Promise<T> {
        return this.service.put(url, params, config)
    }

    /**
     * DETELE 请求
     * @param url 请求地址
     * @param params 请求参数
     * @returns 
     */
    delete<T>(url: string, config?: AxiosRequestConfig<any>): Promise<T> {
        return this.service.delete(url, config)
    }
}

// 导出一个实例对象
export default new RequestHttp(config)