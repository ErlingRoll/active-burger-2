import React from 'react'
import './button.scss'

const Button: React.FC<any> = (props) => {
    return (
        <button {...props} className={'button ' + props.className}>
            {props.children}
        </button>
    )
}

export default Button
