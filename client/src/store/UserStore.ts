import {makeAutoObservable} from "mobx"
import axios from "axios"
import { jwtDecode } from 'jwt-decode'

export default class UserStore {
    private _isAuth: boolean
    private _user: object
    isLoading: boolean = true
    constructor() {
        this._isAuth = false
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(bool: boolean) {
        this._isAuth = bool
    }

    setUser(user: object) {
        this._user = user
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    logout() {
        localStorage.removeItem('token')
        this._user = {}
        this._isAuth = false
    }

    /*checkAuth() {
        const token = localStorage.getItem('token')
        if (!token) {
            this.setIsAuth(false)
            this.setUser({})
            this.isLoading = false
            return
        }

        try {
            const decoded: any = jwtDecode(token)
            if (decoded.exp * 1000 < Date.now()) {

                axios.post('/api/user/refresh', {}, { withCredentials: true })
                    .then(res => {
                        localStorage.setItem('token', res.data.token)
                        const refreshed = jwtDecode(res.data.token)
                        this.setUser(refreshed)
                        this.setIsAuth(true)
                        this.isLoading = false
                    })
                    .catch(() => {
                        this.setUser({})
                        this.setIsAuth(false)
                        localStorage.removeItem('token')
                        this.isLoading = false
                    })
            } else {
                this.setUser(decoded)
                this.setIsAuth(true)
                this.isLoading = false
            }
        } catch (e) {
            this.setUser({})
            this.setIsAuth(false)
            localStorage.removeItem('token')
            this.isLoading = false
        }
    }*/

    async checkAuth() {
        try {
            const res = await axios.post('/api/user/refresh', {}, { withCredentials: true })

            const token = res.data.token
            if (!token) {
                throw new Error('No token received');
            }

            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

            const decoded = jwtDecode(token)
            this.setUser(decoded)
            this.setIsAuth(true)
        } catch (e) {
            localStorage.removeItem('token')
            this.setUser({})
            this.setIsAuth(false)
        } finally {
            this.isLoading = false
        }
    }


}