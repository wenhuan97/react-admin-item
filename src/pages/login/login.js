// 登录的路由组件

import React, { Component } from 'react'
import './login.less'
import Logo from '../../asset/images/logo.png'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { User } from '../../utils/memoryUtils'
import { strongUtils } from '../../utils/localStrongUtils'
// import {withRouter} from 'react-router-dom'
// 引入发送ajax请求的模块
import { reqLogin } from '../../api/index'
import { Redirect } from 'react-router-dom'

class App extends Component {

    onFinish = async (values) => {
        console.log(values);
        // 请求登录
        const { username, password } = values
        const result = await reqLogin(username, password)
        console.log('登录成功', result);
        if (result.status === 0) {
            message.success('登录成功~~~')

            //  保存登录人的信息 user
            //  const user
            const user = result.data
            User.user = user//保存到内存 刷新就消失
            strongUtils.saveUser(user)
            console.log(User.user);

            //   登录成功 跳转至admin页面
            this.props.history.replace('/');
        } else {
            message.error(result.msg)
        }
    }
    render() {
        //  如果用户已经登录 就重定向到管理页面
        const user = User.user
        if (user && user._id) {
           //   重定向到 登录页面
           return <Redirect to="/"/>
        }
            return (
                <div className="login">
                    <header className="login_head">
                        <img src={Logo} alt="" />
                        <h1>React后台管理系统</h1>
                    </header>
                    <section className="login_content">
                        <h2>用户登录</h2>
                        <Form
                            name="normal_login"
                            className="login-form"
                            onFinish={this.onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true, min: 4, max: 12,
                                        message: '用户名长度不合法!',
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9_-]+$/,
                                        message: '用户名必须由数字和字母或者下划线组成'
                                    }
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入4-12位用户名" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    // 自定义验证
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value) {
                                                return Promise.reject('密码不能为空');
                                            } else if (value.length < 4) {
                                                return Promise.reject('密码长度不能小于4位');
                                            } else if (value.length > 12) {
                                                return Promise.reject('密码长度不能大于12位');
                                            } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                                                return Promise.reject('密码必须由数字和字母或者下划线组成');
                                            } else {
                                                return Promise.resolve();
                                            }
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="请输入密码"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                            </Form.Item>
                        </Form>
                    </section>
                </div>
            )
    }
}
export default App