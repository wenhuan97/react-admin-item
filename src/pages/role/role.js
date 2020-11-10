// 角色子路由组件
import React, { Component, createRef } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/const'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddRole from './addRole'
import AuthRole from './authRole'
import { User } from '../../utils/memoryUtils'
import { strongUtils } from '../../utils/localStrongUtils'
import { formateDate } from '../../utils/dateUtils'

class Role extends Component {
    state = {
        roles: [],//角色的列表
        role: {},//已选中的角色
        loading: false,
        isShowAdd: false,//是否显示添加界面
        isShowAuth: false//是否显示 设置权限的模态框
    }

    constructor(props) {
        super(props)
        this.myRef = createRef()
    }

    // 初始化列的 数据
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                // render:(create_time)=>formateDate(create_time)
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        }
    }

    onRow = (role) => {//记录角色的对象  每一行的角色信息对象
        //设置行属性
        return {
            // 监听到 点击行 的事件
            onClick: event => {
                // console.log(66);
                this.setState({ role })
            }
        }
    }

    showAddModel = () => {
        // 显示添加角色的模态框
        this.setState({ isShowAdd: true })
    }

    showUpdateModel = () => {
        // 显示更新角色的模态框
        this.setState({ isShowAuth: true })
    }

    addRole = async () => {
        // 添加角色
        const { roleName } = this.form.getFieldValue();
        const result = await reqAddRole(roleName)
        // const role = result.data
        if (result.status === 0) {
            // 更新roles状态，基于原本状态数据更新
            // this.setState(state=>({
            //     roles:[...state.roles,role]
            // }))
            this.getRoles()
            message.success('添加角色成功！')
            this.setState({ isShowAdd: false })
        } else {
            message.error('添加失败..')
        }

    }

    updateRole = async () => {
        //更新角色
        const role = this.state.role
        const menus = this.myRef.current.getMenus()
        role.menus = menus
        role.auth_name = User.user.username


        const result = await reqUpdateRole(role)
        if (result.status === 0) {
           
            // 如果修改的 当前 自己的权限
            if (role._id === User.user.role._id) {
                User.user = {}
                strongUtils.removeUser()
                // 删除 user信息后 强制跳转至 登录界面
                this.props.history.replace('/login')
                message.success('当前用户角色修改权限，请重新登陆')
            } else {
                message.success('更新权限成功')
                this.getRoles()
                this.setState({ isShowAuth: false })
            }
        }
    }

    handleCancel = () => {
        // 隐藏模态框
        this.setState({ isShowAdd: false })
        this.setState({ isShowAuth: false })
    }

    UNSAFE_componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        // 获取角色的列表
        this.getRoles()
    }

    render() {
        const { roles, role, loading, isShowAdd, isShowAuth } = this.state
        const title = (
            <div>
                <Button type="primary" style={{ marginRight: 10 }} onClick={this.showAddModel}>创建角色</Button>
                <Button type="primary" disabled={!role._id} onClick={this.showUpdateModel}>设置角色权限</Button>
            </div>
        )

        return (
            <Card title={title}>
                <Table
                    dataSource={roles}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    loading={loading}
                    pagination={{
                        pageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                    rowSelection={{
                        type: 'radio',
                        // selectedRowKeys 选中项的 key值的数组 选中项为点击项的_id 就可以实现 点击行的时候 选中radio
                        selectedRowKeys: [role._id],
                        onSelect:(role)=>{//用户手动选择 某个radio时 回调
                            this.setState({role})
                        }
                    }}
                    // 设置行属性
                    onRow={this.onRow}
                >

                </Table>
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                // footer={full}
                >
                    {/* categorys={categorys} parentId={parentId} */}
                    <AddRole setForm={(form) => { this.form = form }} />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={this.handleCancel}
                // 关闭时销毁 Modal 里的子元素
                // destroyOnClose={true} 
                // footer={full}
                >
                    {/* categorys={categorys} parentId={parentId} */}
                    <AuthRole role={role} ref={this.myRef} />
                </Modal>
            </Card>
        )
    }
}

export default Role