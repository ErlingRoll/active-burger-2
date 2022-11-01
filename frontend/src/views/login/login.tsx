import React, { useContext } from 'react'
import './login.scss'

// Contexts
import { UserContext } from '../../App'

// Components
import Paper from '../../components/paper/paper'

// Assets
import pixelBurger from '../../assets/images/pixel_burger.png'
import activeBurger from '../../assets/images/active_burger.png'

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
            <div className='background-image' style={{ backgroundImage: `url(${pixelBurger})` }} />
            <img src={activeBurger} alt='title' className='main-logo' />
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
                <button onClick={handleLogin}>Login</button>
            </Paper>
        </div>
    )
}

export default Login
