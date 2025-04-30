import './App.css'
import {BrowserRouter} from 'react-router-dom'
import AppRouter from "./components/AppRouter"
import NavBar from "./components/NavBar"
import {observer} from "mobx-react-lite"
import {useContext, useEffect} from "react"
import {Context} from "./main"
import {Spinner} from "react-bootstrap"
import CartWidget from "./components/modals/CartWidget"
import axios from "axios"
import cartStore from "./store/CartStore.ts"

const App = observer(() => {
    const context = useContext(Context)
    if (!context) {
        throw new Error('Context must be used within ContextProvider')
    }
    const {user} = context

    useEffect(() => {
        user.checkAuth().then(() => {
            if (user.isAuth) {
                cartStore.loadUserCart()
            }
        })
    }, [])


    axios.defaults.withCredentials = true

    axios.interceptors.response.use(
        res => res,
        async err => {
            const originalRequest = err.config

            if (err.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true
                try {
                    const {data} = await axios.post('/api/user/refresh', {}, {withCredentials: true})
                    localStorage.setItem('token', data.token)
                    originalRequest.headers['Authorization'] = `Bearer ${data.token}`
                    return axios(originalRequest)
                } catch (refreshError) {
                    localStorage.removeItem('token')
                }
            }

            return Promise.reject(err)
        }
    )

    useEffect(() => {
        user.checkAuth()
    }, [])


    if (user.isLoading) {
        return <Spinner animation={"grow"}/>
    }

    return (
        <BrowserRouter>
            <NavBar/>
            <AppRouter/>
            <CartWidget/>
        </BrowserRouter>
    )
})

export default App
