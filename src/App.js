import React,{Component} from 'react'
import { Button,message } from 'antd'
// 引入 antd 的css样式
import 'antd/dist/antd.less'

class App extends Component{

    fuck=()=>{
       message.success('成功了啊啊啊')
    }

    render() {
        return (
            <div>
                <h1>宁好666</h1>
                <Button type="primary" onClick={this.fuck}>Primary Button</Button>
            </div>
        )
    }
}

export default App