import { useContext } from 'react'
import './dashboard.scss'

// Services
import { userService } from '../../services/services'

// Providers
import { routes } from '../../app'
import { useNavigate } from 'react-router-dom'

// Constants

// Components
import Paper from '../../components/paper/paper'
import Button from '../../components/button/button'
import FriendList from './components/friendList/friendList'
import Stats from './components/stats/stats'
import Inventory from './components/inventory/inventory'
import { UserContext } from '../../context/user-context'

const Dashboard = () => {
    // Provide
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    const logout = async (e: any) => {
        await userService.logout()
        setUser(null)
        navigate(routes.login.path)
    }

    return (
        <div id='dashboard'>
            <Button className='logout-button' onClick={logout}>
                Logout
            </Button>
            <Inventory />
            <div className='content'>
                <Stats />
                <div />
            </div>
        </div>
    )
}

export default Dashboard
