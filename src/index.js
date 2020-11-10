import React from 'react';
import ReactDOM from 'react-dom';
import {strongUtils} from './utils/localStrongUtils'
import {User} from './utils/memoryUtils'

import App from './App';

// 读取到本地存储中的user内容 保存到 内存 中
const user = strongUtils.getUser()
User.user = user

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
