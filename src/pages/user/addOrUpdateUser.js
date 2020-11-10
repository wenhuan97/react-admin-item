import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select
// 添加/修改用户的 组件
export default class AddOrUpdateUser extends Component {
    formRef = React.createRef();
    getVaules = () => {
        const form = this.formRef.current
        // 将form作为参数传出
        this.props.setForm(form)
        // const values = form.getFieldValue()
        // console.log(values);

    }

    componentDidMount() {
        this.getVaules()
    }

    render() {
        const { roles, user } = this.props
        // 指定 表单的布局 配置对象
        const layout = {
            labelCol: { span: 6 },//左侧label的宽度
            wrapperCol: { span: 15 },//右侧包裹的宽度
        };
        // onFinish = (values) => {
        //     console.log(values);
        // }
        return (
            <Form
                ref={this.formRef}
                {...layout}
            // onFinish={onFinish}
            >
                <Form.Item
                    rules={[
                        { required: true, message: '用户名不能为空' },
                        { pattern: /^[^\s]*$/, message: '信息内不能有空格!!' }
                    ]}
                    name="username"
                    initialValue={user ? user.username : ''}
                    label="用户名"
                >
                    <Input type="text" placeholder="请输入用户名" ></Input>
                </Form.Item>
                {
                    user ? null : (
                        <Form.Item
                            rules={[
                                { required: true, message: '密码不能为空' },
                                { pattern: /^[^\s]*$/, message: '信息内不能有空格!!' }
                            ]}
                            name="password"
                            initialValue={user ? user.password : ''}
                            label="密码"
                        >
                            <Input type="password" placeholder="请输入密码" >
                            </Input>
                        </Form.Item>
                    )
                }
                <Form.Item
                    rules={[
                        { required: true, message: '手机号不能为空' },
                        { pattern: /^[^\s]*$/, message: '信息内不能有空格!!' }
                    ]}
                    name="phone"
                    initialValue={user ? user.phone : ''}
                    label="手机号"
                >
                    <Input type="text" placeholder="请输入手机号" ></Input>
                </Form.Item>
                <Form.Item
                    rules={[
                        { required: true, message: '邮箱不能为空' },
                        { pattern: /^[^\s]*$/, message: '信息内不能有空格!!' }
                    ]}
                    name="email"
                    initialValue={user ? user.email : ''}
                    label="邮箱"
                >
                    <Input type="text" placeholder="请输入邮箱" ></Input>
                </Form.Item>
                <Form.Item
                    rules={[
                        { required: true, message: '角色ID不能为空' },
                        { pattern: /^[^\s]*$/, message: '信息内不能有空格!!' }
                    ]}
                    name="role_id"
                    initialValue={user ? user.role_id : ''}
                    label="角色"
                >
                    <Select>
                        {
                            roles.map(role => (<Option key={role._id} value={role._id}>{role.name}</Option>))
                        }
                    </Select>
                </Form.Item>

                {/* <Button htmlType="submit" type="primary">添加</Button> */}
            </Form>
        )
    }
}