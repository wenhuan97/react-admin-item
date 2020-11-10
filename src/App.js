import React, { Component } from 'react'
// import { Button, message } from 'antd'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// 引入 antd 的css样式
import 'antd/dist/antd.less'
// 引入登录组件
import Login from './pages/login/login'
// 引入管理组件
import Admin from './pages/admin/admin'

class App extends Component {

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route path="/login" component={Login}></Route>
                        <Route path="/" component={Admin}></Route>
                    </Switch>
                </Router>
            </div>
        )
    }
}

export default App