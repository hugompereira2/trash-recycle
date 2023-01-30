import { useState, useRef, useEffect, ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";
import "./LoginForm.scss"

interface IUserForm {
    username: string,
    password: string;
}

const LoginForm = () => {
    const [user, setUser] = useState<IUserForm>();

    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm<IUserForm>();
    const onSubmit = (data: IUserForm) => console.log(data);

    return (
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group">
                <label className="label-title">E-mail</label>
                <input {...register('username', { required: true })} type="email" className="input-text" />
                {errors.username && <span className="error-message">Campo obrigatório</span>}
            </div>
            <div className="input-group">
                <label className="label-title">Senha</label>
                <input {...register('password', { required: true })} type="password" className="input-text" minLength={6}/>
                {errors.password && <span className="error-message">Campo obrigatório</span>}
            </div>
            <Link className="link" to="/register">Não tenho conta</Link>
            <button type="submit" className="button-submit">Login</button>
        </form>
    )
}

export default LoginForm