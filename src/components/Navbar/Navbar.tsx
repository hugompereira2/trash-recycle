import { useState } from "react"
import logo from '../../assets/logo.svg'
import "./Navbar.scss"

const Navbar = () => {
    const [count, setCount] = useState(0)

    return (
        <div id="navbar">
            <img src={logo} className="logo" alt="logo" />
            <div className="navbar-options">
                <a href="#">Login</a>
                <a href="#">Cadastre-se</a>
            </div>
        </div>
    )
}

export default Navbar