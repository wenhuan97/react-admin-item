import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import LinkButton from '../link-button/link-button'
import './header.less'
// 引入格式化时间组件
import { formateDate } from '../../utils/dateUtils'
import { User } from '../../utils/memoryUtils'
import { reqWeather } from '../../api/index'
import menuList from '../../config/menuConfig'
import { strongUtils } from '../../utils/localStrongUtils'
// 头部组件
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),//当前时间字符串
        weather: '',//天气的文本
    }

    getTitle = () => {
        //获取到 管理菜单列表的 title值
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {//如果当前item的key值和当前路径一致 item.title就是要显示的title
                title = item.title
                // 在所有的子item中 查找
            } else if (item.children) {
                const citem = item.children.find(citem => path.indexOf(citem.key) === 0 )
                // 如果找到了 就显示当前的 标题名
                if (citem) {
                    title = citem.title
                }

            }
        })
        return title
    }

    getTime = () => {
        //每隔一秒 获取一次时间
        this.setInterval = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    getWeather = async () => {
        // 调用异步接口 获取天气文本
        const weather = await reqWeather('北京')
        this.setState({ weather })
    }
    // 退出登录 提示框
    logout = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确定退出登录？',
            onOk: () => {
                // 删除保存的user数据
                User.user = {}
                strongUtils.removeUser()
                console.log('ok', this);
                // 跳转至 login
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('取消');
            }
        })
    }

    // 第一次render()之后执行
    componentDidMount() {
        //调用   每隔一秒 获取一次时间
        this.getTime()
        // 获取天气文本
        this.getWeather()
    }

    // 当前组件销毁之前 调用
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.setInterval)
    }

    render() {
        const { currentTime, weather } = this.state
        const username = User.user.username
        // 得到 当前要显示的title
        const title = this.getTitle()
        return (
            <div className="header-nav">
                <div className="header-up">
                    <LinkButton href="###" onClick={this.logout}>退出</LinkButton>
                    <span>欢迎,{username}</span>
                </div>
                <div className="header-down">
                    <div className="header-down-left">{title}</div>
                    <div className="header-down-right">
                        <span>{currentTime}</span>
                        <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2073003680,2389915426&fm=11&gp=0.jpg" alt="" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)