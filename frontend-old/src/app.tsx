import React, { createContext, useContext, useEffect, useState } from 'react'
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
import { UserContext, UserProvider } from './context/user-context'
import GameScreen from './views/gamescreen/gamscreen'

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
    const [isMounted, setIsMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Context
    const { user, setUser } = useContext(UserContext)

    // Components
    const ProtectedRoute = (props: any) => {
        if (!user) {
            return <Navigate to={routes.login.path} replace />
        }

        return props.children
    }

    return (
        <UserProvider>
            <GameScreen />
        </UserProvider>
    )

    return (
        <UserProvider>
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
        </UserProvider>
    )
}

export default App
