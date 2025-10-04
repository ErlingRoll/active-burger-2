import Axios from "axios"

// OAuth 2 client for login with Discord
const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET
const REDIRECT_URI = "http://localhost:3000/login/discord/redirect"
const AUTHORIZATION_ENDPOINT = "https://discord.com/api/oauth2/authorize"
const RESPONSE_TYPE = "code"
const SCOPE = "identify"
const DISCORD_API_BASE_URL = "https://discord.com/api"

// Function to initiate the OAuth 2 login flow
export const initiateDiscordLogin = () => {
    const url = `${AUTHORIZATION_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
    window.location.href = url
}
// Function to exchange authorization code for access token
export const exchangeCodeForToken = async (code: string) => {
    const params = new URLSearchParams()
    params.append("client_id", CLIENT_ID)
    params.append("client_secret", CLIENT_SECRET)
    params.append("grant_type", "authorization_code")
    params.append("code", code)
    params.append("redirect_uri", REDIRECT_URI)
    params.append("scope", SCOPE)
    try {
        const response = await Axios.post(`${DISCORD_API_BASE_URL}/oauth2/token`, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        return response.data
    } catch (error) {
        console.error("Error exchanging code for token:", error)
        throw error
    }
}
// Function to fetch user information using the access token
export const fetchDiscordUser = async (accessToken: string) => {
    try {
        const response = await Axios.get(`${DISCORD_API_BASE_URL}/users/@me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return response.data
    } catch (error) {
        console.error("Error fetching Discord user:", error)
        throw error
    }
}
