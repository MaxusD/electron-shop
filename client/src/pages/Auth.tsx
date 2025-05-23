import {useContext, useState} from 'react'
import {Button, Card, Container, Form} from "react-bootstrap"
import {LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE} from "../utils/consts"
import {NavLink, useLocation, useNavigate} from "react-router-dom"
import {login, registration} from "../http/userAPI"
import {observer} from "mobx-react-lite"
import {Context} from "../main"
import cartStore from "../store/CartStore"


const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const click = async () => {
        try {
            let data
            if (isLogin) {
                data = await login(email, password)
            } else {
                data = await registration(email, password)
            }
            user.setUser(user)
            user.setIsAuth(true)
            navigate(SHOP_ROUTE)
            await cartStore.loadUserCart()
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? "Login" : "Registration"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-2"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-2"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        {isLogin ?
                            <div className="justify-content-start">
                                Don't have account? <NavLink to={REGISTRATION_ROUTE}>Registration</NavLink>
                            </div>
                            :
                            <div className="justify-content-start">
                                Have account? <NavLink to={LOGIN_ROUTE}>Login</NavLink>
                            </div>
                        }
                        <Button
                            variant={"outline-success"}
                            onClick={click}
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    )
})

export default Auth
