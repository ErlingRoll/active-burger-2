import React, { useContext, useEffect } from 'react'
import './login.scss'
import { NotificationManager } from 'react-notifications'

// Providers
import { useNavigate } from 'react-router-dom'
import { routes } from '../../app'

// Components
import Paper from '../../components/paper/paper'

// Assets
import loginLogo from '../../assets/images/login_logo.png'
import Button from '../../components/button/button'
import { userService } from '../../services/services'
import { User, UserContext } from '../../context/user-context'

const Login = () => {
    // Providers
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()

    // State
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    // Functions
    const handleLogin = async (e: any) => {
        const user: any = await userService.login({ username: username, password: password }).catch(console.error)
        if (user) setUser(user)
        navigate('/')
    }

    // Functions
    const handleRegister = async (e: any) => {
        const registerRes = await userService.register({ username: username, password: password }).catch((error) => {
            if (error.response.status === 400) {
                NotificationManager.error('Username already exists :( Please try another one')
            }
        })
        if (registerRes) {
            NotificationManager.success('Successful registration!')
        }
    }

    // Effects
    useEffect(() => {
        if (user) {
            navigate(routes.dashboard.path)
        }
    }, [user])

    // Render
    return (
        <div id='login'>
            <img src={loginLogo} alt='title' className='main-logo' />
            <Paper className='login-form'>
                <h2>Login</h2>
                <div className='field'>
                    <label>Username</label>
                    <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className='field'>
                    <label>Password</label>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className='buttons'>
                    <Button className='login-button' onClick={handleLogin}>
                        Login
                    </Button>
                    <Button className='register-button' onClick={handleRegister}>
                        Register
                    </Button>
                </div>
            </Paper>
        </div>
    )
}

export default Login
