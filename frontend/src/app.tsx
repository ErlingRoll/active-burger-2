import React, { createContext, useState } from 'react'
import './app.scss'

// Models
import { User } from './models/user'

// Assets
import background from './assets/images/background.png'

// Components
import Dashboard from './views/dashboard/dashboard'
import Login from './views/login/login'

export const UserContext: React.Context<any> = createContext({
    user: null,
})

const testUser = {
    id: 1,
    name: 'Test User',
}

function App() {
    const [user, setUser] = useState<User | null>(testUser)

    const PrivateRoutes = (
        <div>
            <Dashboard />
        </div>
    )

    const PublicRoutes = (
        <div>
            <Login />
        </div>
    )

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <div id='app'>
                <div className='background-image' style={{ backgroundImage: `url(${background})` }} />

                {user ? PrivateRoutes : PublicRoutes}
            </div>
        </UserContext.Provider>
    )
}

export default App
