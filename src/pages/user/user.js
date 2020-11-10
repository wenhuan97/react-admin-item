// 用户子路由组件
import React, { Component } from 'react'
import { Card, Table, Button, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../component/link-button/link-button'
import { PAGE_SIZE } from '../../utils/const'
import { reqUserList, reqUserdelete, reqAddOrUpdateUser } from '../../api/'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import AddOrUpdate from './addOrUpdateUser'

class User extends Component {

    state = {
        users: [],//所有用户列表
        roles: [],//所有角色列表
        isShow: false//是否显示模态框
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: "username"
            },
            {
                title: '邮箱',
                dataIndex: "email"
            },
            {
                title: '电话',
                dataIndex: "phone"
            },
            {
                title: '注册时间',
                dataIndex: "create_time",
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: "role_id",
                render: (role_id) => this.roleNames[role_id]

            },
            {
                title: '操作',
                render: (user) => (
                    <span style={{ display: 'flex' }}>
                        <LinkButton onClick={() => { this.showUpdate(user) }}>修改</LinkButton>
                        <LinkButton onClick={() => { this.deleteUser(user) }}>删除</LinkButton>
                    </span>
                )
            }

        ]
    }


    // 根据roles数组 生成 包含所有角色名的对象（属性名用 roles的_id)
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        // 保存 这个角色名的对象
        this.roleNames = roleNames
    }

    //  显示添加用户
    showAdd = () => {
        this.user = null//去除 修改用户时 保存在this中的user
        this.setState({ isShow: true })
    }

    //    添加用户
    addOrUpdateUser = async () => {
        const users = this.form.getFieldValue();
        if (this.user) {
            users._id = this.user._id
        }
        const result = await reqAddOrUpdateUser(users)

        if (result.status === 0) {
            message.success(`${this.user ? '修改商品' : '添加商品'}成功~~`)
            this.getUserList()
            this.setState({ isShow: false })
        }
    }

    // 修改用户
    showUpdate = (user) => {
        // 保存user
        this.user = user
        //    console.log(user);
        this.setState({ isShow: true })
    }

    // 获得用户列表
    getUserList = async () => {
        const result = await reqUserList()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })

        }
    }

    //   删除用户
    deleteUser = (user) => {
        const { confirm } = Modal;
        confirm({
            title: `确认删除${user.username}吗`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const result = await reqUserdelete(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    this.getUserList()
                }
            }
        });
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        // 获取用户列表
        this.getUserList()

    }

    render() {
        const user = this.user
        const { users, isShow, roles } = this.state
        const title = (
            <div>
                <Button type="primary" onClick={this.showAdd}>添加用户</Button>
            </div>
        )
        return (

            <Card title={title}>
                <Table
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                    bordered
                    rowKey="_id"
                    dataSource={users}
                    columns={this.columns}
                />
                <Modal
                    title={user ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => { this.setState({ isShow: false }) }}
                    destroyOnClose={true}
                >
                    <AddOrUpdate setForm={(form) => { this.form = form }} roles={roles} user={user} />
                    {/* <AddCategory categorys={categorys} parentId={parentId} setForm1={(form1) => { this.form1 = form1 }} /> */}
                </Modal>
            </Card>
        )
    }
}

export default User