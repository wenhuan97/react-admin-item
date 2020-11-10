import React, { Component } from 'react'
import { Form, Input } from 'antd'


export default class ModifyCategory extends Component {
    formRef = React.createRef();
    getValues = () => {
        // 得到 Form 实例
        const form = this.formRef.current
        this.props.setForm(form)
        // 使用 getFieldsValue 获取多个字段值
        const values = form.getFieldValue()
        console.log(values)
    }

    componentDidMount() {
        this.getValues()
    }

    render() {
        return (
            <Form
                ref={this.formRef}
            >
                {/* <div style={{ marginBottom: 5 }}>分类名称：</div> */}
                <Form.Item
                    initialValue={this.props.categoryName}
                    name="category"
                    rules={[
                        {
                            required: true,
                            message: '分类名称必须输入',
                        },
                        {
                            pattern: /^[a-zA-Z0-9[\u4E00-\u9FA5]+$/,
                            message: '分类不能含有空格或其他字符'
                        }
                    ]}
                >
                    <Input type="text"></Input>
                </Form.Item>
            </Form>
        )
    }
}