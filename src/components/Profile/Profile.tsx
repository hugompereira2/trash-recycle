import logo from '../../assets/logo.svg';
import { CaretDown, Plus, SignOut, UserCircle, X } from "phosphor-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import "./Profile.scss";
import { useState } from "react";

interface IUser {
    name: string;
    cnpj_cpf: string;
    email: string;
    whatsapp: string;
}

const Profile = () => {
    const [user, setUser] = useState<IUser>();

    const navigate = useNavigate();
    const location = useLocation();

    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm<IUser>();
    const onSubmit = (data: IUser) => console.log(data);

    return (
        <div id="profile">
            <div className="profile-info">
                <h1>Profile</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="input-group">
                            <label className="label-title">Nome Completo</label>
                            <input {...register('name', { required: true })} type="text" className="input-text" />
                            {errors.name && <span className="error-message">Campo obrigatório</span>}
                        </div>
                        <div className="input-group">
                            <label className="label-title">CPF</label>
                            <InputMask {...register('cnpj_cpf', { required: true })} mask={"999.999.999-99"} type="text" className="input-text" />
                            {errors.cnpj_cpf && <span className="error-message">Campo obrigatório</span>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-group">
                            <label className="label-title">E-mail</label>
                            <input {...register('email', { required: true })} type="email" className="input-text" />
                            {errors.email && <span className="error-message">Campo obrigatório</span>}
                        </div>
                        <div className="input-group">
                            <label className="label-title">Whatsapp</label>
                            <InputMask {...register('whatsapp', { required: true })} mask={"(99) 99999-9999"} type="text" className="input-text" />
                            {errors.whatsapp && <span className="error-message">Campo obrigatório</span>}
                        </div>
                    </div>
                    <div className="form-action">
                        <button type="submit">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile