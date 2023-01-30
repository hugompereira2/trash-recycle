import { useEffect, useState, ChangeEvent } from "react"
import { FaRegBuilding } from 'react-icons/fa';
import { IoBodyOutline } from 'react-icons/io5';
import RegisterForm from "../RegisterForm/RegisterForm";
import "./Register.scss"

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

interface Item {
    id: number;
    image_url: string;
    title: string;
}

interface ViaCEPResponse {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
}

const Register = () => {
    const [type, setType] = useState<string>("");

    // const successCallback = (position: GeolocationPosition) => {
    //     console.log(position);
    // };

    // const errorCallback = (error: GeolocationPositionError) => {
    //     console.log(error);
    // };

    // const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedUf(event.target.value);
    // };

    // const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedCity(event.target.value);
    // };

    // const map = useMapEvents({
    //     click() {
    //       map.locate()
    //     },
    //     locationfound(e) {
    //       console.log(e);
    //       map.flyTo(e.latlng, map.getZoom())
    //     },
    //   })

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