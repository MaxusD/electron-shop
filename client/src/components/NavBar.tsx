import React, {useContext} from 'react'
import {Context} from "../main"
import {Button, Container, Nav, Navbar, Image} from "react-bootstrap"
import {NavLink} from "react-router-dom"
import {ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE} from "../utils/consts"
import {observer} from "mobx-react-lite"
import {useNavigate} from "react-router-dom"

const NavBar = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    const logOut = () => {
        console.log('Logging out...')
        localStorage.removeItem('token')
        user.setUser({})
        user.setIsAuth(false)
    }

    return (
        <Navbar>
            <Container>
                <NavLink to={SHOP_ROUTE}><Image src="/logo.webp" alt="Logo" /></NavLink>
                {user.isAuth ?
                    <div style={{color: '#fff'}}>
                    <div className="mb-3">Hello, {user.user.firstName} {user.user.lastName}!</div>
                    <Nav className="me-2 ms-2">
                        <Button
                            variant={"outline-light"}
                            onClick={() => navigate(ADMIN_ROUTE)}
                        >
                            Admin Panel
                        </Button>
                        <Button
                            variant={"outline-light"}
                            className="me-2 ms-2"
                            onClick={() => logOut()}
                        >
                            Logout
                        </Button>
                    </Nav>
                    </div>
                    :
                    <Nav className="me-2 ms-2" style={{color: '#fff'}}>
                        <Button variant={"outline-light"} onClick={() => navigate(LOGIN_ROUTE)}>Register</Button>
                    </Nav>
                }
            </Container>
        </Navbar>
    )
})

export default NavBar
