// 管理的路由组件
import { Layout } from 'antd'
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { User } from '../../utils/memoryUtils'
// 引入侧边栏和头部导航
import SiderNav from '../../component/sider_nav/sider_nav'
import Header from '../../component/header/header'
// 引入 全部的子路由组件
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Users from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout;

class Admin extends Component {

    render() {

        const user = User.user

        if (!user || !user._id) {//说明没登录
            //   重定向到 登录页面
            return <Redirect to="/login" />
        }
        return (
         
            <div>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider>
                        <SiderNav />
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{ margin:'20px',backgroundColor: '#fff' }}>
                            <Switch>
                                <Route path='/home' component={Home}></Route>
                                <Route path='/category' component={Category} />
                                <Route path='/product' component={Product} />
                                <Route path='/role' component={Role} />
                                <Route path='/user' component={Users} />
                                <Route path='/charts/bar' component={Bar} />
                                <Route path='/charts/line' component={Line} />
                                <Route path='/charts/pie' component={Pie} />
                                <Redirect to='/home' />
                            </Switch>
                        </Content>
                        <Footer style={{
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#999'
                        }}>推荐使用谷歌浏览器，可以获得更佳的操作体验</Footer>
                    </Layout>
                </Layout>
            </div>
        )
    }
}
export default Admin