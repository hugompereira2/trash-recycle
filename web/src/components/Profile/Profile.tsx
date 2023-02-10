import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import "./Profile.scss";
import { useEffect, useState } from "react";
import { updateUser } from "../../api/api";

interface IUser {
    name: string;
    cnpj_cpf: string;
    email: string;
    whatsapp: string;
    userType_id: string;
}

const Profile = () => {
    const [user, setUser] = useState<IUser>();
    const [mask, setMask] = useState("");
    const pj = "975791b6-e2c6-465f-848b-852811563230";

    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm<IUser>();

    const onSubmit = async (data: IUser) => {
        console.log(data)
        const resp = await updateUser(data);
        if (resp) {
            localStorage.setItem("user", JSON.stringify(resp));
        }
    };

    useEffect(() => {
        const userStringfy = localStorage.getItem("user");

        if (userStringfy) {
            const userParsed = JSON.parse(userStringfy);

            setUser({
                name: userParsed.name,
                cnpj_cpf: userParsed.cnpj_cpf,
                email: userParsed.email,
                whatsapp: userParsed.phone,
                userType_id: userParsed.userType_id,
            })
        }
    }, [])

    useEffect(() => {
        if (user) {
            setMask(user?.userType_id == pj ? "99.999.999/9999-99" : "999.999.999-99");
            setValue("whatsapp", "55 555555");
            reset(user);
        }
    }, [user])

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
                            <label className="label-title">{user?.userType_id == pj ? "CNPJ" : "CPF"}</label>
                            <InputMask {...register('cnpj_cpf', { required: true })} mask={mask} type="text" className="input-text" />
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