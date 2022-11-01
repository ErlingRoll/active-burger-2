import React, { useContext } from 'react'
import './login.scss'
import { UserContext } from '../../app'

// Components
import Paper from '../../components/paper/paper'

// Assets
import loginLogo from '../../assets/images/login_logo.png'
import Button from '../../components/button/button'

const testUser = {
    id: 1,
    name: 'Test User',
}

const Login = () => {
    // Use hooks
    const { setUser } = useContext(UserContext)

    // Functions
    const handleLogin = (e: any) => {
        setUser(testUser)
    }

    // Render
    return (
        <div id='login'>
            <img src={loginLogo} alt='title' className='main-logo' />
            <Paper className='login-form'>
                <h2>Login</h2>
                <div className='field'>
                    <label>Username</label>
                    <input type='text' />
                </div>
                <div className='field'>
                    <label>Password</label>
                    <input type='password' />
                </div>
                <Button onClick={handleLogin}>Login</Button>
            </Paper>
        </div>
    )
}

export default Login
