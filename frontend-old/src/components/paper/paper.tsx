import './paper.scss'

const Paper: React.FC<any> = (props) => {
    return (
        <div {...props} className={'paper ' + props.className}>
            {props.children}
        </div>
    )
}

export default Paper
