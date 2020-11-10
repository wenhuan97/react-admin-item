import React, { Component } from 'react'
import { Form, Input } from 'antd'


export default class AddRole extends Component {
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
        // const { categorys, parentId } = this.props
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
                        { required: true, message: '角色信息不能为空' },
                        { pattern: /^[^\s]*$/, message: '角色信息不能有空格!!' }
                    ]}
                    name="roleName"
                    initialValue=''
                    label="角色名称："
                >
                    <Input type="text" placeholder="请输入角色名称" ></Input>
                </Form.Item>
                {/* <Button htmlType="submit" type="primary">添加</Button> */}
            </Form>
        )
    }
}