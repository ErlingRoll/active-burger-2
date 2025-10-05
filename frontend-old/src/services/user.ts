import { AxiosInstance, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { User } from '../models/user'

interface LoginRequest {
    username: string
    password: string
}

interface RegisterRequest {
    username: string
    password: string
}

export default class UserService {
    constructor(private httpClient: AxiosInstance) {}

    async login(request: LoginRequest) {
        return this.httpClient.post('/login', request)
    }

    async logout() {
        return this.httpClient.post('/logout')
    }

    async register(request: RegisterRequest) {
        return this.httpClient.post('/register', request)
    }

    async getUser(): Promise<User> {
        return this.httpClient.get('user')
    }
}
