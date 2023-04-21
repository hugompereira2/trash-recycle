import { useState, Dispatch, SetStateAction, useContext } from "react"
import userContext from "../../context/userContext";
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/api";
import "./LoginForm.scss"
import { CircleNotch } from "phosphor-react";

interface ILoginForm {
    email: string,
    password: string;
}

interface propsLoginForm {
    setError: Dispatch<SetStateAction<string>>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

const LoginForm = ({ setError, setShowModal }: propsLoginForm) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { user, setUser } = useContext(userContext);

    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm<ILoginForm>();
    const onSubmit = async (data: ILoginForm) => {
        setLoading(true);
        let resp = await login(data);

        if (resp) {
            setShowModal(false);

            if (resp.address) {
                const locationSplited = resp.address.location.split(",")
                const locationFormatted = locationSplited ? [parseFloat(locationSplited[0]), parseFloat(locationSplited[1])] : []

                resp.address.location = locationFormatted

            }
            setUser(resp);

            localStorage.setItem("user", JSON.stringify(resp));

            if (resp.userType_id == "975791b6-e2c6-465f-848b-852811563230") {
                navigate("/dashboard");
            } else {
                navigate("/solicitacao");
            }
        } else {
            setError("Usuário/Senha incorretos!");
        }
        setLoading(false);
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
            <button type="submit" className="button-submit">
                {
                    loading
                        ? <CircleNotch className="spinner" size={30} color="#FFFFFF" />
                        : "Login"
                }
            </button>
        </form>
    )
}

export default LoginForm