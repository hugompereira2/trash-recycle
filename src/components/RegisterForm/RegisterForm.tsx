import { useState, useRef, useEffect } from "react"
import "./RegisterForm.scss"

interface iRegister {
    type: string,
}

const RegisterForm = (props: iRegister) => {
    const ref = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
        if (ref) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [props.type])

    return (
        <form id="register-form">
            <h1 ref={ref}>Cadastro de {props.type}</h1>
            <h3>Dados</h3>
            <div className="row">
                <div className="input-group">
                    <label className="label-tile">Pessoa física</label>
                    <input type="text" className="input-text" />
                </div>
                <div className="input-group">
                    <label className="label-tile">{props.type == "Empresa" ? "CNPJ" : "CPF"}</label>
                    <input type="text" className="input-text" />
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <label className="label-tile">E-mail</label>
                    <input type="text" className="input-text" />
                </div>
                <div className="input-group">
                    <label className="label-tile">Whatsapp</label>
                    <input type="text" className="input-text" />
                </div>
            </div>
            <h3>Endereço</h3>
            <div className="row">
                <div className="input-group">
                    <label className="label-tile">Pessoa física</label>
                    <input type="text" className="input-text" />
                </div>
                <div className="input-group">
                    <label className="label-tile">CPF</label>
                    <input type="text" className="input-text" />
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <label className="label-tile">E-mail</label>
                    <input type="text" className="input-text" />
                </div>
                <div className="input-group">
                    <label className="label-tile">Whatsapp</label>
                    <input type="text" className="input-text" />
                </div>
            </div>
        </form>
    )
}

export default RegisterForm