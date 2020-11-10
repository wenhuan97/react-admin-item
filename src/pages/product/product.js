// 商品管理子路由组件
import React,{Component} from 'react'

import {Route,Switch,Redirect} from 'react-router-dom'
import ProductHome from './home'
import AddModify from './add-modifyProduct'
import Details from './details'
import './product.less'

class Product extends Component{
    render() {
        return(
            <Switch>
                <Route path="/product" exact component={ProductHome}></Route>
                <Route path="/product/addModify"  component={AddModify}></Route>
                <Route path="/product/details"  component={Details}></Route>
                <Redirect to="/product" />
            </Switch>
        )
    }
}

export default Product