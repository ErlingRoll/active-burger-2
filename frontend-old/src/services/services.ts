import axios from 'axios'

// Services
import UserService from './user'

const httpClient = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
})

httpClient.interceptors.response.use((response) => {
    return response.data || true
})

export const userService = new UserService(httpClient)
