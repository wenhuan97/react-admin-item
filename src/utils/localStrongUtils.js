// 对local数据进行管理的 模块
// 使用store库
import store from 'store'
export const strongUtils = {
    // 保存 user

    saveUser(user) {
        // localStorage.setItem('user_key', JSON.stringify(user))
        store.set('user_key',user)
    },

    // 读取 user
    getUser() {
        // return JSON.parse(localStorage.getItem('user_key') || '{}')
        return store.get('user_key') || {}
    },

    // 删除 user

    removeUser() {
        // localStorage.removeItem('user')
        store.remove('user_key')
    }
}