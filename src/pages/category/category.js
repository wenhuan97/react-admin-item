// 品类管理子路由组件
import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import LinkButton from '../../component/link-button/link-button'
import { reqCateList, reqUpdateCateList, reqAddCateList } from '../../api/index'
import AddCategory from './add-category'
import ModifyCategory from './modify-category'


class Category extends Component {

    state = {
        // 初始化数据
        // 一级分类列表的 数组
        categorys: [],
        // 二级分类列表的 数组
        subCategorys: [],
        // 控制loading的状态
        showLoading: false,
        //当前需要显示的分类列表的 父分类的ID
        parentId: '0',
        //当前需要显示的分类列表的 父分类的名称
        parentName: '',
        // 显示 隐藏 添加修改的对话框
        showStatus: 0,//0隐藏 1添加 2修改
    }

    // 显示指定一级分类的 二级分类
    showSubCategorys = async (category) => {
        // 先更新分类的id和名称
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {//this.setState在状态更新且重新渲染页面后执行
            // 获取二级分类数据
            this.getCategorys()
        })

    }

    // 显示一级分类列表
    showCategorys = () => {
        console.log(this.state.categorys);
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []

        })
    }

    //    初始化 Table所有列的数组
    initColumn = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',//指定显示数据的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (//返回需要显示的界面标签
                    <div style={{ display: 'flex' }}>
                        <LinkButton onClick={() => this.showModify(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}
                    </div>
                )
            },
        ];
    }
    // 发送ajax请求
    // 如果不传参 就按照 状态state 内的parentId发送请求 如果传参了就用参数的parentId
    getCategorys = async (parentId) => {
        // 在发送请求前 显示loading
        this.setState({
            showLoading: true
        })
        parentId = parentId || this.state.parentId
        const result = await reqCateList(parentId)
        // 在发送请求后隐藏loading
        this.setState({
            showLoading: false
        })
        if (result.status === 0) {
            // 获取的结果 可能是一级列表或者二级的
            const categorys = result.data
            if (parentId === '0') {
                this.setState({ categorys })//更新一级列表
            } else {
                this.setState({ subCategorys: categorys })//更新二级列表
            }
        } else {
            message.error('获取列表失败')
        }

    }

    // 第一次render() 之前准备数据
    UNSAFE_componentWillMount() {
        this.initColumn()

    }
    // 执行异步任务：发送ajax请求
    componentDidMount() {
        this.getCategorys()
    }

    // 显示添加分类的对话框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })

    }
    // 显示修改分类的对话框
    showModify = (category) => {
        this.category = category
        this.setState({
            showStatus: 2
        })
    }



    // 添加分类操作
    addCategorys = async () => {
        // 发送请求 添加分类
        const { categoryName, parentId } = this.form1.getFieldValue()
        const result = await reqAddCateList(categoryName, parentId)
        this.form1.validateFields().then(() => {
            if (result.status === 0) {
                if (parentId === this.state.parentId) {//如果添加的分类就当前分类列表下的分类
                    //    重新获取 列表
                    this.getCategorys()
                } else if (parentId === '0') {//在二级分类下 添加一级分类 添加后 重新获取列表 但不显示一级列表
                    //    重新获取 列表 由于状态里的parentId 并没有变化 所以不会显示到一级列表
                    this.getCategorys('0')
                }
            }
            this.setState({
                showStatus: 0
            })
        }).catch(err => {
            console.log(err);
        })
    }


    // 修改分类操作
    modifyCategorys = async () => {

        //   修改前的表单验证
        this.form.validateFields().then((values) => {
            console.log(values);
            if (values.category.trim() !== '') {
                const categoryId = this.category._id
                const categoryName = this.form.getFieldValue().category
                reqUpdateCateList(categoryId, categoryName).then((result) => {
                    if (result.status === 0) {
                        //   获取列表信息
                        this.getCategorys()
                    }
                })
                

                //   关闭窗口
                this.setState({
                    showStatus: 0
                })
            }
        })



    }


    // 关闭对话框
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }

    render() {
        // card的左侧
        const title = '一级分类列表'
        // card的右侧
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )

        const { categorys, subCategorys, parentId, parentName, showLoading, showStatus } = this.state
        const category = this.category || {}

        return (
            <div>
                <Card title={parentId === '0' ? title : (
                    <div style={{ display: 'flex' }}>
                        <span>
                            <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                        </span>
                        <span>
                            <ArrowRightOutlined />
                        </span>
                        <span style={{ marginLeft: '5px' }}>
                            {parentName}
                        </span>
                    </div>

                )}
                    extra={extra} style={{ width: '100%' }}
                >
                    <Table
                        pagination={{ defaultPageSize: 3, showQuickJumper: true }}
                        bordered
                        loading={showLoading}
                        rowKey="_id"
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns}
                    />
                    <Modal
                        title="添加分类"
                        visible={showStatus === 1}
                        onOk={this.addCategorys}
                        onCancel={this.handleCancel}
                        destroyOnClose={true}
                    >
                        <AddCategory categorys={categorys} parentId={parentId} setForm1={(form1) => { this.form1 = form1 }} />
                    </Modal>
                    <Modal
                        title="修改分类"
                        visible={showStatus === 2}
                        onOk={this.modifyCategorys}
                        onCancel={this.handleCancel}
                        destroyOnClose={true}
                    >
                        <ModifyCategory categoryName={category.name} setForm={(form) => { this.form = form }} />
                    </Modal>
                </Card>
            </div>
        )
    }
}

export default Category