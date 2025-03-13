import { Routes, Route, Navigate} from 'react-router-dom'
import {authRoutes, publicRoutes} from "../routes"
import {useContext} from "react"
import {Context} from "../main"
import {observer} from 'mobx-react-lite'
import CartPage from "../pages/CartPage"


const AppRouter = observer(() => {
    const {user} = useContext(Context)

    return (
        <Routes>
            <Route path="/cart" element={<CartPage />} />
            {user.isAuth && authRoutes.map(({path, Component}) =>{
                return <Route key={path} path={path} element={<Component />} />
            })}
            {publicRoutes.map(({path, Component}) =>{
                return <Route key={path} path={path} element={<Component />} />
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
})

export default AppRouter
