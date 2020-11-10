// 包含应用中 所有接口请求函数的模块

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
// export function reqLogin(username,password) {
//  return  ajax('/login',{username,password})
// }
// const Base = 'http://localhost:5000'
const Base = ''
// 登录的接口
export const reqLogin = (username, password) => ajax(Base + '/login', { username, password }, 'POST')

// 添加用户
export const reqAddOrUpdateUser = (user) => ajax(Base + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

// 获取一级分类/二级分类的列表
export const reqCateList = (parentId) => ajax(Base + '/manage/category/list', { parentId }, 'GET')
// 添加分类
export const reqAddCateList = (categoryName, parentId) => ajax(Base + '/manage/category/add', { categoryName, parentId }, 'POST')
// 更新分类
export const reqUpdateCateList = (categoryId, categoryName) => ajax(Base + '/manage/category/update', { categoryId, categoryName }, 'POST')
// 获取分类
export const reqCategory = (categoryId) => ajax(Base + '/manage/category/info', { categoryId })
// 获取商品分类列表
export const reqProductList = (pageNum, pageSize) => ajax(Base + 'manage/product/list', { pageNum, pageSize }, 'GET')
// 更新商品状态
export const reqUpdateStatus = (productId, status) => ajax(Base + '/manage/product/updateStatus', { productId, status }, 'POST')
// 删除图片
export const reqRemoveImg = (name) => ajax(Base + '/manage/img/delete', { name }, 'POST')
// 添加/修改商品
export const reqAddOrModifyProduct = (product) => ajax(Base + '/manage/product/' + (product._id ? 'update' : 'add'), product, "POST")
// 获取 角色列表
export const reqRoles = () => ajax(Base + '/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax(Base + '/manage/role/add', { roleName }, "POST")
// 更新角色权限
export const reqUpdateRole = (roles) => ajax(Base + '/manage/role/update', roles, "POST")
// 查询用户列表
export const reqUserList = () => ajax(Base + '/manage/user/list')
// 删除用户列表
export const reqUserdelete = (userId) => ajax(Base + '/manage/user/delete', { userId }, "POST")

// searchType 搜索的类型 为productName/productDesc 此时的searchType是个变量 其中productName/productDesc作为变量的类型
// 搜索的值还是 searchName 所以变量的值作为属性名时： [searchType]:searchName
// 搜索 商品分页列表
export const reqSearchProduct = ({ pageNum, pageSize, searchName, searchType }) => ajax(Base + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
}, 'GET')


// 发送json请求天气数据
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://wthrcdn.etouch.cn/weather_mini?city=${city}`
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data);
            if (!err && data.status === 1000) {//说明发送json请求成功
                //  取出需要的数据
                const weather = data.data.forecast[0].type
                resolve(weather)
            } else {//获取数据失败
                message.error('获取天气信息失败')
            }
        })
    })
}
// reqWeather('北京')






