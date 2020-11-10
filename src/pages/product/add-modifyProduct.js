import React, { PureComponent } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { reqCateList, reqAddOrModifyProduct } from '../../api/index'
import PicturesWall from './PicturesWall '
import RichTextEditor from './RichTextEditor'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
const { TextArea } = Input


// 这是product添加和更新的子路由组件
export default class AddModifyProduct extends PureComponent {
    constructor(props) {
        super(props)
        // 创建用来保存 ref标识的标签对象的容器
        this.myRef = React.createRef()
        this.Edit = React.createRef()
    }
    state = {
        options: []
    };


    // 加载 级联选择的 二级列表
    loadData = async selectedOptions => {
        // 得到选择的 options 对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        // 是否显示 loading 的效果
        targetOption.loading = true;

        // 发送请求 根据 id 获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;//获取到二级分类列表后 隐藏loading
        if (subCategorys && subCategorys.length > 0) {   //当前具有二级分类  
            const childOptions = subCategorys.map(sItem => ({
                label: sItem.name,
                value: sItem._id,
                isLeaf: true
            }))
            targetOption.children = childOptions
        } else {//当前没有二级分类
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options],
        });
    };

    // 初始化 options 级联选择的 一级分类列表
    initOptions = async (categorys) => {
        //  根据 categorys数组 生成 需要的options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,//不是
        }))

        // 如果是一个二级分类列表的 修改 状态
        const { isModify, product } = this
        const { pCategoryId } = product
        if (isModify && pCategoryId !== '0') {
            // 获取对应的二级分类列表数据
            const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的 options
            const childOptions = subCategorys.map(item => ({
                value: item._id,
                label: item.name,
                isLeaf: true,//不是
            }))
            //    找到当前商品的 一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            // 关联到 对应 一级 options中
            targetOption.children = childOptions
        }

        // 更新状态
        this.setState({ options: [...options] })
    }

    // 获取一级/二级分类列表，并显示
    getCategorys = async (parentId) => {
        const result = await reqCateList(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === "0") {//如果 是一级分类列表
                this.initOptions(categorys)
            } else {//二级分类列表
                return categorys
            }

        }
    }

    UNSAFE_componentWillMount() {
        //取出 从修改按钮 传递来的 product商品对象
        const product = this.props.location.state
        // console.log(product);
        //    保存是否是 修改状态的标识
        this.isModify = !!product//标识 如果有 product就是true 没有就是false
        //保存商品信息对象 如果没有 就定义空对象（避免报错）
        this.product = product || {}
    }

    componentDidMount() {
        this.getCategorys('0')
    }
    render() {
        const { isModify, product } = this
        const categoryIds = []//接受 级联 默认选择的数组
        const { pCategoryId, categoryId, imgs, detail } = this.product
        // console.log(imgs);
        if (isModify) {//如果是 修改商品 把 id 追加到 默认数组中
            // 商品是一个一级分类
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是一个二级分类
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        // 指定 表单的布局 配置对象
        const layout = {
            labelCol: { span: 2 },//左侧label的宽度
            wrapperCol: { span: 7 },//右侧包裹的宽度
        };
        const title = (
            <span>
                <ArrowLeftOutlined style={{ marginRight: 5, color: 'green', fontSize: 20 }} onClick={() => this.props.history.goBack()} />
                <span>{isModify ? '修改商品' : '添加商品'}</span>
            </span>
        )

        const onFinish = async (values) => {
            // 1.收集数据并封装成 product对象
            const { name, desc, price, categoryIds } = values
            let pCategoryId, categoryId
            if (categoryIds.length === 1) {
                pCategoryId = '0'
                categoryId = categoryIds[0]
            } else {
                pCategoryId = categoryIds[0]
                categoryId = categoryIds[1]
            }
            // 提交后 收集到 图片name的数组
            const imgs = this.myRef.current.getImgs()
            // 提交后 收集到 文本编辑器
            const detail = this.Edit.current.getDetail()
            const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
            console.log(product);

            // 如果是修改商品 要添加_id
            if (this.isModify) {
                product._id = this.product._id
            }

            // 2.调用接口添加/修改商品
            const result = await reqAddOrModifyProduct(product)
            // 3.根据结果显示
            if (result.status === 0) {
                message.success(`${this.isModify ? '修改' : '添加'}商品成功！！`)
                this.props.history.goBack()
            } else {
                message.error(`${this.isModify ? '修改' : '添加'}商品失败！！`)
            }
            console.log(values);

            console.log('imgs', imgs);
            // console.log('EditorText', EditorText);
        }



        return (
            <Card title={title}>
                <Form
                    {...layout}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="商品名称："
                        name="name"
                        rules={[
                            { required: true, message: '商品名称不能为空' }
                        ]}
                        initialValue={product.name}
                    >
                        <Input type="text" placeholder="请输入商品名称" />
                    </Form.Item>
                    <Form.Item
                        label="商品描述："
                        name="desc"
                        rules={[
                            { required: true, message: '商品描述不能为空' }
                        ]}
                        initialValue={product.desc}
                    >
                        <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 9 }} />
                    </Form.Item>
                    <Form.Item
                        label="商品价格："
                        name="price"
                        rules={[
                            { required: true, message: '商品价格不能为空' },
                            {//自定义验证
                                validator(rule, value) {
                                    if (value * 1 > 0) {
                                        return Promise.resolve();//验证通过
                                    }
                                    return Promise.reject('价格必须大于0');
                                },
                            }
                        ]}
                        initialValue={product.price}
                    >
                        <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
                    </Form.Item>
                    <Form.Item
                        label="商品分类："
                        name="categoryIds"
                        rules={[
                            { required: true, message: '商品分类不能为空' }
                        ]}
                        initialValue={categoryIds}
                    >
                        <Cascader
                            placeholder="请输入商品分类"
                            options={this.state.options}
                            loadData={this.loadData}//loadData回调函数  加载下一级的数据
                        />
                    </Form.Item>
                    <Form.Item
                        label="商品图片："
                    >
                        {/* 会把 这个子组件中的实例对象 放到 ref中 */}
                        <PicturesWall ref={this.myRef} imgs={imgs} />
                    </Form.Item>
                    <Form.Item
                        label="商品详情："
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <RichTextEditor ref={this.Edit} detail={detail} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}