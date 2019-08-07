import axios from 'axios'

axios.interceptors.response.use((response) => {
    let res = response.data
    if (res.state === 0) {
        window.isLogin = true
        return res
    } else if (res.state === 1) {
        window.isLogin = false
        throw new Error('未登录')
    } else if (res.state === 2) {
        throw new Error('数据库连接失败')
    }
})

export default axios