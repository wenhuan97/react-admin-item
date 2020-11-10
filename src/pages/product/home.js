import React, { Component } from 'react'
import {
    Card,
    Input,
    Button,
    Select,
    Table,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../component/link-button/link-button'
import { reqProductList, reqSearchProduct, reqUpdateStatus } from '../../api/index'
import { PAGE_SIZE } from '../../utils/const'

const { Option } = Select

// 这是product默认的子路由组件
export default class ProductHome extends Component {

    state = {
        product: [],//商品的数据列表
        total: 0,//商品的总数量
        loading: false,
        searchName: '',//搜索的关键字
        searchType: 'productName',//搜索的类型 默认是按名称搜索
    }

    // 初始化table列的数组
    initCloumnList = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                width: 250
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                width: 750
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price //当前指定了对应的属性 传入的是对应的属性值
            },
            {
                title: '状态',
                // dataIndex: 'status',
                width: 110,
                render: (product) => {
                    const { status, _id } = product
                    return (
                        <span>
                            <Button type="primary"
                                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}>{status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                render: (product) => (
                    <span>
                        {/* 将product对象作为使用state传递给目标路由组件 传递到details页面中的location中 */}
                        <LinkButton onClick={() => this.props.history.push('/product/details', product)}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push('/product/addModify', product)} >修改</LinkButton>
                    </span>
                )
            },
        ];
    }

    // 更新商品的状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('状态更新成功~~~')
            this.getProductList(this.pageNum)
        }
    }

    UNSAFE_componentWillMount() {
        // 初始化table列的数组
        this.initCloumnList()
    }

    getProductList = async (pageNum) => {
        // 保存 pageNum 让其他方法 可以看得到当前是第几页
        this.pageNum = pageNum
        this.setState({//请求到数据前 显示loading...
            loading: true
        })
        const { searchName, searchType } = this.state
        // 如果searchName 搜索分页有值  就发送 搜索 商品分页列表的请求
        let result
        if (searchName) {
            result = await reqSearchProduct({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
            console.log(result.data);
        } else {
            result = await reqProductList(pageNum, PAGE_SIZE)
        }

        this.setState({//请求到数据后 隐藏loading...
            loading: false
        })
        if (result.status === 0) {
            const { list, total } = result.data
            this.setState({
                product: list,
                total
            })
        }
    }


    componentDidMount() {
        //  发送请求 获取商品数据列表
        this.getProductList(1)
    }

    goAddModify = () => {
        //跳转至 添加修改页面
        this.props.history.push('/product/addModify')
    }

    render() {
        const { product, total, loading, searchName, searchType } = this.state

        const title = (
            <span>
                <Select
                    style={{ width: 150 }}
                    value={searchType}
                    onChange={value => {
                        this.setState({ searchType: value })
                    }}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input type="text"
                    style={{ width: 150, margin: '0 10px' }}
                    placeholder="关键字"
                    value={searchName}
                    onChange={(e) => {
                        this.setState({
                            searchName: e.target.value
                        })
                    }}
                />
                <Button type="primary" onClick={() => { this.getProductList(1) }}>搜索</Button>
            </span>


        )
        const extra = (
            <Button type="primary" onClick={this.goAddModify}>
                <PlusOutlined />
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table

                    dataSource={product}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    loading={loading}
                    pagination={{
                        current: this.pageNum,
                        pageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total,
                        onChange: this.getProductList
                    }}
                >
                </Table>
            </Card>
        )
    }
}