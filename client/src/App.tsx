import './App.css'
import { BrowserRouter} from 'react-router-dom'
import AppRouter from "./components/AppRouter"
import NavBar from "./components/NavBar"
import {observer} from "mobx-react-lite"
import {useContext, useEffect, useState} from "react"
import {Context} from "./main"
import {check} from "./http/userAPI"
import {Spinner} from "react-bootstrap"
import CartWidget from "./components/modals/CartWidget"

const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

            setTimeout(() => {
                check().then(data => {
                    user.setUser(data)
                    user.setIsAuth(true)
                }).catch(() => {
                    user.setUser({})
                    user.setIsAuth(false)
                }).finally(() => setLoading(false))
            }, 500)

    }, [])

    if (loading) {
        return <Spinner animation={"grow"} />
    }

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
            <CartWidget />
        </BrowserRouter>
    )
})

export default App
