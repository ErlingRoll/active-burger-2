import { useContext } from 'react'
import './dashboard.scss'
import { UserContext } from '../../app'

// Components
import Paper from '../../components/paper/paper'
import Button from '../../components/button/button'
import FriendList from './components/friendList/friendList'
import Stats from './components/stats/stats'

const Dashboard = () => {
    const { setUser } = useContext(UserContext)

    const logout = (e: any) => {
        setUser(null)
    }

    return (
        <div id='dashboard'>
            <Button className='logout-button' onClick={logout}>
                Logout
            </Button>
            <div className='content'>
                <Stats />
                <div />
            </div>
        </div>
    )
}

export default Dashboard
