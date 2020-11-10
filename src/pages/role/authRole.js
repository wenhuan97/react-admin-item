import React, { PureComponent } from 'react'
import { Form, Input, Tree } from 'antd'
import menuList from '../../config/menuConfig'
const { TreeNode } = Tree


export default class AddRole extends PureComponent {

    constructor(props) {
        super(props)

        const { menus } = this.props.role

        //  根据传入的角色 menus 生成初始状态
        this.state = {
            checkedKeys: menus
        }
    }

    //    通过ref使得父组件 调用子组件中的 方法 可让父组件得到最新的 menus值
    getMenus = () => this.state.checkedKeys

    // 把数组数据 转换成标签数据
    getNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    }

    // 选中某个节点时
    onCheck = checkedKeys => {
        // console.log('onCheck', checkedKeys)
        this.setState({ checkedKeys })
        //  console.log(this.state.checkedkeys);
    };

    // 当组件接收到新的属性时 调用 (解决了 meuns不更新的bug)
    // 关闭时销毁 Modal 里的子元素 destroyOnClose={true} 也行
    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        const menus = nextProps.role.menus
         this.setState({
             checkedKeys:menus
         })
    }

    UNSAFE_componentWillMount() {
        this.tressNodes = this.getNodes(menuList)
    }

    render() {

        // const treeData = [
        //     {
        //         title: '平台权限',
        //         key: '0-0',
        //         children: [
        //             {
        //                 title: 'parent 1-0',
        //                 key: '0-0-0',
        //                 children: [
        //                     {
        //                         title: 'leaf',
        //                         key: '0-0-0-0',
        //                     },
        //                     {
        //                         title: 'leaf',
        //                         key: '0-0-0-1',
        //                     },
        //                 ],
        //             },
        //             {
        //                 title: 'parent 1-1',
        //                 key: '0-0-1',
        //                 children: [
        //                     {
        //                         title:'sss',
        //                         key: '0-0-1-0',
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        // ];



        const onSelect = (selectedKeys, info) => {
            console.log('selected', selectedKeys, info);
        };

        const { role } = this.props
        // const { categorys, parentId } = this.props
        // 指定 表单的布局 配置对象
        const layout = {
            labelCol: { span: 6 },//左侧label的宽度
            wrapperCol: { span: 15 },//右侧包裹的宽度
        };
        // onFinish = (values) => {
        //     console.log(values);
        // }
        const { checkedKeys } = this.state
        return (
            
            <div>
                {console.log('render()')}
                <Form.Item
                    {...layout}
                    initialValue=''
                    label="角色名称："
                >
                    {/* {console.log(this.props)} */}
                    <Input type="text" value={role.name} disabled></Input>
                </Form.Item >
                {/* <Button htmlType="submit" type="primary">添加</Button> */}
                <Tree
                    checkable
                    defaultExpandAll={true}
                    onSelect={onSelect}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                // treeData={treeData}
                >
                    <TreeNode title="平台权限" key='0-0'>
                        {this.tressNodes}
                        {/* <TreeNode title="parent 1-0" key="0-0-0">
                            <TreeNode title="leaf" key="0-0-0-0"></TreeNode>
                            <TreeNode title="leaf" key="0-0-0-1"></TreeNode>
                        </TreeNode>
                        <TreeNode title="parent 1-1" key="0-0-1">
                            <TreeNode title="sss" key="0-0-1-0"></TreeNode>
                        </TreeNode> */}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}