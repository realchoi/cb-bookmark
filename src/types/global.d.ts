import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider"
import type { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider"
import { DefineComponent } from "vue"

declare global {
    // 声明 window 上自定义属性，如事件总线
    interface Window {
        $message: MessageApiInjection
        $dialog: DialogApiInjection
        eventbus: any
    }

    // 声明 vClickOutside 指令
    interface HTMLElement {
        _clickOutside?: (event: Event) => void
    }
}

// 声明 .vue 文件
declare module "*.vue" {
    const component: DefineComponent<object, object, any>
    export default component
}

export { } 