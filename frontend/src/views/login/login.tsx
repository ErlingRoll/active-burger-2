import React, { useContext, useEffect } from "react"

import { exchangeCodeForToken, fetchDiscordUser, initiateDiscordLogin } from "../../services/discord-login"

// Assets
import loginLogo from "../../assets/images/login_logo.png"
import loginBackground from "../../assets/images/background.png"
import { UserContext } from "../../contexts/user-context"
import { GamestateContext, gameWebsocketUrl } from "../../contexts/gamestate-context"

const Login = () => {
    const { code } = Object.fromEntries(new URLSearchParams(window.location.search))

    const { user, setUser } = useContext(UserContext)
    const { gameCon, setGameCon, gamestate: game, setGamestate: setGame } = useContext(GamestateContext)

    function connect() {
        console.log("Connecting to WebSocket at", gameWebsocketUrl)

        // Stop if already connected
        if (gameCon) {
            console.log("WebSocket already connected")
            return
        }

        const ws = new WebSocket(gameWebsocketUrl)
        ws.onopen = () => {
            console.log("WebSocket connection established")
            setGameCon(ws)
        }
    }

    useEffect(() => {
        let existingUser = localStorage.getItem("discordUser")
        if (existingUser) {
            setUser(JSON.parse(existingUser))
            existingUser = JSON.parse(existingUser || "{}")
            // console.log("Existing user from localStorage:", existingUser)
            return
        }

        if (!code || code.trim() == "") return
        console.log("Authorization code:", code)

        exchangeCodeForToken(code)
            .then((data) => {
                console.log("Access token data:", data)

                // Store access token securely
                localStorage.setItem("discordAccessToken", data.access_token)
                localStorage.setItem("discordRefreshToken", data.refresh_token)

                fetchDiscordUser(data.access_token)
                    .then((userData) => {
                        console.log("Discord user data:", userData)
                        localStorage.setItem("discordUser", JSON.stringify(userData))
                        setUser(userData)
                    })
                    .catch((error) => {
                        console.error("Error fetching user data:", error)
                    })
            })
            .catch((error) => {
                console.error("Error during token exchange:", error)
            })
    }, [])

    useEffect(() => {
        if (!user) return
        // console.log("User state updated:", user)
        connect()
    }, [user])

    return (
        <div id="login" className="relative">
            <img src={loginBackground} alt="background" className="absolute w-screen h-screen object-cover -z-10" />
            <div className="flex flex-col justify-center items-center h-screen gap-12 pb-24">
                <img src={loginLogo} alt="title" className="main-logo w-[28rem]" />
                <div className="bg-white/70 w-[28rem] h-24 flex flex-col items-center justify-center rounded-lg">
                    <button className="w-32 hover:scale-105" onClick={initiateDiscordLogin}>
                        Log in
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
