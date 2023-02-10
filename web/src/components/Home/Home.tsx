import { useState } from "react"
import logo from '../../assets/logo.svg'
import home from '../../assets/home_ilu.svg'
import Navbar from "../Navbar/Navbar"
import { Link } from "react-router-dom"
import { BiLogIn } from 'react-icons/bi';
import "./Home.scss"

const Home = () => {
    const [count, setCount] = useState(0)

    return (
        <>
            {/* <Navbar /> */}
            <div id="home-container">
                <div className="clean-world">
                    <h1 className="home-title">Seu apoiador na hora de coletar resíduos.</h1>
                    <p className="home-subtitle">Damos o suporte necessário para apoiar a coleta de resíduos e conscientização ambiental.</p>
                    <Link to={"/register"} className="register">
                        <span><BiLogIn size={30} /></span>
                        <strong>cadastre-se</strong>
                    </Link>
                </div>
                <div className="img-container">
                    <img src={home} alt="ilustration" />
                </div>
            </div>
        </>
    )
}

export default Home