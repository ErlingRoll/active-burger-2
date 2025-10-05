import ReactDOM from 'react-dom'

const Modal: React.FC<any> = (props) => {
    return ReactDOM.createPortal(props.children, document.getElementById('root') as HTMLElement)
}

export default Modal
