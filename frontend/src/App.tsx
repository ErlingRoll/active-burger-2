import React, { createContext, useState } from 'react'
import './App.scss'

// Models
import { User } from './models/user'

// Components
import Dashboard from './views/dashboard/dashboard'
import Login from './views/login/login'

export const UserContext: React.Context<any> = createContext({
    user: null,
    setUser: (user: User) => {},
})

function App() {
    const [user, setUser] = useState<User | null>(null)

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
            <div id='app'>{user ? PrivateRoutes : PublicRoutes}</div>
        </UserContext.Provider>
    )
}

export default App
