import { useState } from "react"
import logo from '../../assets/logo.svg'
import home from '../../assets/home_ilu.svg'
import Navbar from "../Navbar/Navbar"
import { BiLogIn } from 'react-icons/bi';
import "./Home.scss"

const Home = () => {
    const [count, setCount] = useState(0)

    return (
        <>
            <Navbar />
            <div id="home-container">
                <div className="clean-world">
                    <h1 className="home-title">Lorem ipsum dolor sit amet, consectetur</h1>
                    <p className="home-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ullamcorper felis ut arcu semper</p>
                    <a className="register" href="#">
                        <span><BiLogIn size={30} /></span>
                        <strong>cadastre-se</strong>
                    </a>
                </div>
                <div className="img-container">
                    <img src={home} alt="ilustration" />
                </div>
            </div>
        </>
    )
}

export default Home