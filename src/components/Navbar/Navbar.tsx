import { useEffect } from "react"
import logo from '../../assets/logo.svg'
import { Link, useNavigate, useLocation } from "react-router-dom"
import "./Navbar.scss"

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const GoHome = () => {
        navigate("/");
    }

    return (
        <div id="navbar">
            <img src={logo} className="logo" alt="logo" onClick={GoHome} />
            <div className="navbar-options">
                <a href="#">Login</a>
                {location.pathname != "/cadastro" && <Link to="/cadastro">Cadastre-se</Link>}
            </div>
        </div>
    )
}

export default Navbar