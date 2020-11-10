import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'


export default class AddCategory extends Component {
    formRef = React.createRef();
    getVaules = () => {
        const form1 = this.formRef.current
        // 将form作为参数传出
        this.props.setForm1(form1)
        // const values = form1.getFieldValue()
        // console.log(values);

    }

    componentDidMount() {
        this.getVaules()
    }

    render() {
        const { Option } = Select
        const { categorys, parentId } = this.props
        return (
            <Form
                ref={this.formRef}
            >
                <div style={{ marginBottom: 5 }}> 所属分类：</div>
                <Form.Item
                    initialValue={parentId}
                    name="parentId"
                >
                    <Select
                        style={{ width: '100%' }}
                    >
                        <Option value="0">一级分类</Option>
                        {
                            categorys.map(item => (<Option key={item._id} value={item._id}>{item.name}</Option>))
                        }
                    </Select>
                </Form.Item>
                <div style={{ marginBottom: 5 }}>分类名称：</div>
                <Form.Item
                    rules={[
                        { required: true, message: '分类信息不能为空' },
                        {
                            pattern: /^[a-zA-Z0-9[\u4E00-\u9FA5]+$/,
                            message: '分类不能含有空格或其他字符'
                        }
                    ]}
                    name="categoryName"
                    initialValue=''
                >
                    <Input type="text" placeholder="请输入分类名称" ></Input>
                </Form.Item>
            </Form>
        )
    }
}