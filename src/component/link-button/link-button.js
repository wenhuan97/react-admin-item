import React from 'react'
import './link-button.css'

// 外形像 链接的 按钮
export default function LinkButton(props) {
    return(
       <div>
           <button {...props} className="linkBtn"></button>
       </div>
    )
}