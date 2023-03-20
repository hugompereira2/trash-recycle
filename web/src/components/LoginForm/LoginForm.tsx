import { useState, useRef, useEffect, ChangeEvent, Dispatch, SetStateAction, useContext } from "react"
import userContext from "../../context/userContext";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/api";
import "./LoginForm.scss"

interface ILoginForm {
    email: string,
    password: string;
}

interface propsLoginForm {
    setError: Dispatch<SetStateAction<string>>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const LoginForm = ({ setError, setShowModal }: propsLoginForm) => {
    const navigate = useNavigate();

    const { user, setUser } = useContext(userContext);

    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm<ILoginForm>();
    const onSubmit = async (data: ILoginForm) => {
        const resp = await login(data);

        if (resp) {
            setShowModal(false);
            setUser(resp);
            localStorage.setItem("user", JSON.stringify(resp));
            navigate("/dashboard");
        } else {
            setError("Usuário/Senha incorretos!");
        }
    };

    return (
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group">
                <label className="label-title">E-mail</label>
                <input {...register('email', { required: true })} type="email" className="input-text" />
                {errors.email && <span className="error-message">Campo obrigatório</span>}
            </div>
            <div className="input-group">
                <label className="label-title">Senha</label>
                <input {...register('password', { required: true })} type="password" className="input-text" minLength={6} />
                {errors.password && <span className="error-message">Campo obrigatório</span>}
            </div>
            <Link className="link" to="/register">Não tenho cadastro</Link>
            <button type="submit" className="button-submit">Login</button>
        </form>
    )
}

export default LoginForm