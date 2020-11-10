import React, { Component } from 'react'
import logoImg from '../../asset/images/logo.png'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import './sider_nav.less'
// 获取 菜单列表数据
import menuConfig from '../../config/menuConfig'
import { User } from '../../utils/memoryUtils'
const { SubMenu } = Menu;

// 侧边栏组件
class Sider_nav extends Component {

    showAuth = (item) => {
        //    判断当前登录用户 对item是否有权限 
        const { key, isPublic } = item
        // 当前登录用户的menus
        const menus = User.user.role.menus
        const username = User.user.username

        //  1.如果当前是 admin 用户
        //  2.如果当前item是公开的
        //  3.当前用户有次权限：key值有没有在menus数组中
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {//4.如果当前用户有item中的某个子item权限 也要显示
            // 查找 子item中的key 有没有在menus中
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    // 获取 菜单列表 下的所有子节点 根据数据数组 生成标签数组  就是 SubMenu 和 Menu.Item两种形式
    getmeunNodes = (menuConfig) => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        return menuConfig.map(item => {
            /*
             {
               title: '首页', // 菜单标题名称 
               key: '/home', // 对应的 path 
               icon: {HomeOutlined}, // 图标名称 
            }
             <Menu.Item key="/home" icon={<HomeOutlined />}>
                <Link to="/home">
                    首页
                </Link>
            </Menu.Item>
            <SubMenu></SubMenu>
            */

            // 如果 当前用户有item对应的权限 才需要显示对应的菜单项
            if (this.showAuth(item)) {
                if (!item.children) {
                    return (
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    //   查找一个和当前请求路径匹配的 子item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    if (cItem) {
                        // 如果当前存在则需要打开item的子列表（选中的值和路径一致  说明被选中了 要打开item）
                        this.openkey = item.key
                    }

                    return (
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.getmeunNodes(item.children)}

                        </SubMenu>
                    )
                }
            }


        })

    }

    // 页面渲染前 render()之前
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getmeunNodes(menuConfig)
    }

    render() {
        // 得到当前请求的路径
        let path = this.props.location.pathname
        // 表示 /product 在path匹配元素的下标 不存在 就等于-1
        if (path.indexOf('/product') === 0) {//说明当前请求的是 product或者product的子路由
            path = '/product' //商品的子路由路径 改成商品路径 就可显示样式
        }
        // 得到需要打开菜单项的key
        const openkey = this.openkey
        return (
            <div className="sider-nav">
                <Link to="/" className="siderHeader">
                    <img src={logoImg} alt="" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    // 默认第一个选中的 key 值
                    selectedKeys={[path]}
                    // 默认选中的key值
                    defaultOpenKeys={[openkey]}
                    // defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                // inlineCollapsed={this.state.collapsed}
                >



                    {/* 此处的key值 决定选中 */}
                    {/*
                    <Menu.Item key="/home" icon={<HomeOutlined />}>
                        <Link to="/home">
                            首页
                        </Link>
                    </Menu.Item>

                    <SubMenu key="sub1" icon={<AppstoreOutlined />} title="商品">
                        <Menu.Item key="/category" icon={<HddOutlined />}>
                            <Link to="/category">品类管理</Link>
                        </Menu.Item>
                        <Menu.Item key="/product" icon={<ToolOutlined />}>
                            <Link to="/product">商品管理</Link>
                        </Menu.Item>
                    </SubMenu>
                    */}
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

export default withRouter(Sider_nav)