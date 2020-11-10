import React, { Component } from 'react'
import {
    Card,
    List
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { DEFAUT_IMG } from '../../utils/const'
import { reqCategory } from '../../api/index'

// 这是product详情页的子路由组件
export default class Details extends Component {

    state = {
        cName1: '',//一级分类名称
        cName2: ''//二级分类名称
    }

    async componentDidMount() {
        //发送请求 根据id获取分类
        //  得到当前分类的id
        const { pCategoryId, categoryId } = this.props.location.state
        // console.log(pCategoryId, categoryId);
        if (pCategoryId === '0') {
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else {
            /*
            // 通过多个await 方式发送请求 后面的请求要等着前面请求完成后 才发送 
            const result1 = await reqCategory(pCategoryId)//获取一级分类列表
            const result2 = await reqCategory(categoryId)//获取二级分类列表
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            */

            // 要一次性发送多个请求 只有都成功了 才正常处理  返回一个promise数组
            // 发送完第一个 立马回发送第二个 无需等待结果
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({ cName1, cName2 })
        }
    }

    render() {
        // 接受传递过来的商品分类对象
        const { name, desc, price, detail, imgs } = this.props.location.state
        const { cName1, cName2 } = this.state
        const title = (
            <span>
                <ArrowLeftOutlined style={{ marginRight: 5, color: 'green' ,fontSize:20}} onClick={() => this.props.history.goBack()} />
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title}>
                {/* {console.log(this)} */}
                <List size='default' className="product-details">
                    <List.Item>
                        <span className="left">商品名称：</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className="left">商品描述：</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className="left">商品价格：</span>
                        <span>{price}元</span>
                    </List.Item>
                    <List.Item>
                        <span className="left">所属分类：</span>
                        <span>{cName1} {cName2 ? '--->' + cName2 : ''}</span>
                    </List.Item>
                    <List.Item>
                        <span className="left">图片详情：</span>
                        <span>
                            {
                                imgs.map(img => (
                                    <img key={img} src={DEFAUT_IMG + img} alt="" className="product-img" />
                                ))
                            }
                        </span>
                    </List.Item>
                    <List.Item>
                        <span>商品详情：</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}