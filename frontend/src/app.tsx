import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, To } from 'react-router-dom'

// Global CSS
import './app.scss'
import 'react-notifications/lib/notifications.css'

// Services
import { userService } from './services/services'

// Models
import { User } from './models/user'

// Assets
import background from './assets/images/background.png'

// Components
import { NotificationContainer } from 'react-notifications'

// Views
import Dashboard from './views/dashboard/dashboard'
import Login from './views/login/login'

export const UserContext: React.Context<any> = createContext({
    user: null,
})

export const routes: { [routeName: string]: { path: string; element: React.ReactElement } } = {
    login: {
        path: '/login',
        element: <Login />,
    },
    dashboard: {
        path: '/',
        element: <Dashboard />,
    },
}

function App() {
    // State
    const [user, setUser] = useState<User | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Components
    const ProtectedRoute = (props: any) => {
        if (!user) {
            return <Navigate to={routes.login.path} replace />
        }

        return props.children
    }

    // Effects
    useEffect(() => {
        if (isMounted) return
        setIsMounted(true)
        userService
            .getUser()
            .then(setUser)
            .catch((_error) => {
                setUser(null)
            })
            .then(() => {
                setIsLoading(false)
            })
    }, [isMounted])

    if (isLoading) return <></>
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <div id='app'>
                <div className='background-image' style={{ backgroundImage: `url(${background})` }} />
                <BrowserRouter>
                    <Routes>
                        {/* Public routes */}
                        <Route path={routes.login.path} element={routes.login.element} />

                        {/* Private Routes */}
                        <Route
                            path={routes.dashboard.path}
                            element={<ProtectedRoute>{routes.dashboard.element}</ProtectedRoute>}
                        />
                    </Routes>
                </BrowserRouter>
                <NotificationContainer />
            </div>
        </UserContext.Provider>
    )
}

export default App
