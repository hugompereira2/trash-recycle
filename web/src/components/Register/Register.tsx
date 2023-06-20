import { useEffect, useState, ChangeEvent } from "react"
import { FaRegBuilding } from 'react-icons/fa';
import { IoBodyOutline } from 'react-icons/io5';
import RegisterForm from "../RegisterForm/RegisterForm";
import "./Register.scss"

const Register = () => {
    const [type, setType] = useState<string>("");

    return (
        <>
            <div id="register-container">
                <div className="register">
                    <h1>Eu sou ?</h1>
                    <div className="register-deck">
                        <div className="register-card" onClick={() => setType("PJ")}>
                            <FaRegBuilding size={50} />
                            <span>Uma Empresa</span>
                        </div>
                        <div className="register-card" onClick={() => setType("PF")}>
                            <IoBodyOutline size={50} />
                            <span>Uma Pessoa</span>
                        </div>
                    </div>
                    {type && <RegisterForm type={type} />}
                </div>
            </div>
        </>
    )
}

export default Register