import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import "./Profile.scss";
import { useEffect, useState, useContext } from "react";
import { updateUser } from "../../api/api";
import userContext from '../../context/userContext'

interface IUser {
    name: string;
    cnpj_cpf: string;
    email: string;
    whatsapp: string;
    userType_id: string;
}

const Profile = () => {
    const [userForm, setUserForm] = useState<IUser>();
    const [mask, setMask] = useState("");
    const pj = "975791b6-e2c6-465f-848b-852811563230";

    const { user, setUser } = useContext(userContext);

    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm<IUser>();

    const onSubmit = async (data: IUser) => {
        const resp = await updateUser(data);
        if (resp?.status == 200) {
            setUser(resp.data);
            localStorage.setItem("user", JSON.stringify(resp.data));
            
            toast.success("Sucesso!", { autoClose: 2000, });
        } else {
            toast.error(`Error: ${resp.code}`, { autoClose: 2000, });
        }
    };

    useEffect(() => {
        if (Object.keys(user).length > 0) {
            setUserForm({
                name: user.name,
                cnpj_cpf: user.cnpj_cpf,
                email: user.email,
                whatsapp: user.phone,
                userType_id: user.userType_id,
            })
        }
    }, [user])

    useEffect(() => {
        if (userForm) {
            console.log(userForm);
            setMask(userForm?.userType_id == pj ? "99.999.999/9999-99" : "999.999.999-99");
            setValue("whatsapp", userForm?.whatsapp);
            setValue("cnpj_cpf", userForm?.cnpj_cpf);
            reset(userForm);
        }
    }, [userForm])

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
                            <label className="label-title">{userForm?.userType_id == pj ? "CNPJ" : "CPF"}</label>
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