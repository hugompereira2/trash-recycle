import { useState, useRef, useEffect, ChangeEvent, useContext } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import userContext from '../../context/userContext'
import { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconImg from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import RecycleIcon from '../../assets/recycle_icon.svg';
import "./RegisterForm.scss"
import { registerUser, findMaterials, findCep, validateEmail, validateCnpj as getValidateCnpj, validateCpf as getValidateCpf } from "../../api/api";
import { CircleNotch } from "phosphor-react";
import { validateCnpj, validateCPF, formatCnpj, formatCPF, formatPhoneNumber } from "../../utils/utils";

interface IRegister {
    type: string,
}

interface IAddress {
    cep: string;
    state: string;
    city: string;
    district: string;
    street: string;
    street_number: string;
    location?: [number, number];
}

interface IUser {
    name: string;
    cnpj_cpf: string;
    email: string;
    whatsapp: string;
    password: string;
    address: IAddress
    materialUser?: string[];
}

type TypesRecycling = {
    id: string;
    name: string;
    color: string;
    selected: boolean;
}

const RegisterForm = (props: IRegister) => {
    const ref = useRef<HTMLHeadingElement>(null);
    const [userForm, setUserForm] = useState<IUser>();
    const [loading, setLoading] = useState(false);
    const [locationIsRequired, setLocationIsRequired] = useState<boolean>(props.type === "PJ");
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [maskType, setMaskType] = useState<string>("");
    const [typesRecycling, setTypesRecycling] = useState<TypesRecycling[]>([]);

    const { setUser } = useContext(userContext);

    const navigate = useNavigate();

    const { register, reset, clearErrors, setValue, handleSubmit, setError, formState: { errors } } = useForm<IUser>();

    const onSubmit = async (data: IUser) => {
        console.log(errors)
        setLoading(true);
        const payload = {
            ...data,
            userType_id: props.type == "PJ"
                ? "975791b6-e2c6-465f-848b-852811563230"
                : "7635808d-3f19-4543-ad4b-9390bd4b3770"
        }

        const resp = await registerUser(payload);
        setLoading(false);

        if (resp) {

            if (resp.address?.location) {
                const locationSplited = resp.address?.location?.split(",")
                const locationFormatted = locationSplited ? [parseFloat(locationSplited[0]), parseFloat(locationSplited[1])] : []

                resp.address.location = locationFormatted
            }

            const user = JSON.stringify(resp)

            localStorage.setItem("user", user);
            setUser(resp);
            navigate("/dashboard");
        }

    };

    const getMaterials = async () => {
        const { data } = await findMaterials();
        setTypesRecycling(data);
    }

    function LocationMarker() {
        const [position, setPosition] = useState(null)
        useMapEvents({
            click(e) {
                clearErrors('address.location');
                setValue("address.location", [e.latlng.lat, e.latlng.lng]);
                setSelectedPosition([e.latlng.lat, e.latlng.lng]);
            },

        })

        return position === null ? null : (
            <Marker position={position}>
            </Marker>
        )
    }

    function getMarkerIcon() {
        const icon = new L.Icon({
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            iconUrl: iconImg,
        });
        return icon;
    }

    const handleSearchCep = async (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value?.replace("_", "");
        if (value?.length == 9) {
            const { data } = await findCep(value);

            setValue("address.state", data.uf)
            setValue("address.cep", data.cep)
            setValue("address.street", data.logradouro)
            setValue("address.city", data.localidade)
            setValue("address.district", data.bairro)
            clearErrors('address');
        }
        return;
    }

    const handleEmailInput = async (value: string) => {
        register('email', { required: true });
        if (!value.includes("@") || !value.includes(".com")) {
            setError('email', { type: 'custom', message: 'E-mail inválido!' });
            return
        }

        const { data: canRegisterEmail } = await validateEmail(value);

        if (!canRegisterEmail) {
            setError('email', { type: 'custom', message: 'E-mail já cadastrado!' });
            return
        }

        clearErrors('email');
        setValue("email", value)
    }

    const handleCnpjInput = async (value: string) => {
        const cnpj_cpf = formatCnpj(value);

        register('cnpj_cpf', { required: true, pattern: /^.{18}$/, })
        setValue('cnpj_cpf', cnpj_cpf);

        const cnpj_cpf_clean = value?.replaceAll("_", "");
        const isValid = validateCnpj(cnpj_cpf_clean);

        if (cnpj_cpf.length == 18) {
            if (!isValid) {
                setError('cnpj_cpf', { type: 'custom', message: 'CNPJ inválido!' });
                return
            }

            const clearCnpj = cnpj_cpf.replace(/\D/g, "");
            const { data: canRegisterCnpj } = await getValidateCnpj(clearCnpj);

            if (!canRegisterCnpj) {
                setError('cnpj_cpf', { type: 'custom', message: 'CNPJ já cadastrado!' });
                return
            }
            clearErrors('cnpj_cpf');
        }
    }

    const handleCpfInput = async (value: string) => {
        const cnpj_cpf = formatCPF(value);

        register('cnpj_cpf', { required: true, pattern: /^.{14}$/, })
        setValue('cnpj_cpf', cnpj_cpf);

        const cnpj_cpf_clean = value?.replaceAll("_", "");
        const isValid = validateCPF(cnpj_cpf_clean);

        if (cnpj_cpf.length == 14) {
            if (!isValid) {
                setError('cnpj_cpf', { type: 'custom', message: 'CPF inválido!' });
                return
            }

            const clearCpf = cnpj_cpf.replace(/\D/g, "");
            const { data: canRegisterCpf } = await getValidateCpf(clearCpf);

            if (!canRegisterCpf) {
                setError('cnpj_cpf', { type: 'custom', message: 'CPF já cadastrado!' });
                return
            }
            clearErrors('cnpj_cpf');
        }
    }

    const handleWhatsInput = async (value: string) => {
        const whatsapp = formatPhoneNumber(value);

        register('whatsapp', {
            required: true,
            pattern: /^.{14,15}$/,
        })
        setValue('whatsapp', whatsapp);

        if (value.length > 14) {
            clearErrors('whatsapp');
        }
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        });
        getMaterials();
    }, [])

    let DefaultIcon = L.icon({
        iconUrl: iconImg,
        shadowUrl: iconShadow
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    const handleSelectItem = (name: string) => {
        setTypesRecycling(prevTypesRecycling => {
            const updatedTypesRecycling = prevTypesRecycling.map(type => {
                if (type.name === name) {
                    return { ...type, selected: !type.selected };
                } else {
                    return type;
                }
            });

            const selectedIds = updatedTypesRecycling.filter(item => item.selected).map(item => item.id);
            setValue("materialUser", selectedIds)

            return updatedTypesRecycling;
        });
        clearErrors("materialUser");
    }

    useEffect(() => {
        if (ref) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }

        setLocationIsRequired(props.type === "PJ");
        setMaskType(props.type == "PJ" ? "99.999.999/9999-99" : "999.999.999-99")
        reset({
            name: '',
            cnpj_cpf: '',
            email: ' ',
            whatsapp: '',
        });
    }, [props.type])

    return (
        <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
            <h1 ref={ref}>Cadastro de {props.type == "PJ" ? "Empresa" : "Pessoa"}</h1>
            <h3>Dados</h3>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">{props.type == "PJ" ? "Nome fantasia" : "Nome completo"}</label>
                    <input {...register('name', { required: true })} type="text" className="input-text" />
                    {errors.name && <span className="error-message">{errors.name.message || 'Campo obrigatório'}</span>}
                </div>
                <div className="input-group">
                    <label className="label-title">{props.type == "PJ" ? "CNPJ" : "CPF"}</label>
                    <input
                        {...register('cnpj_cpf', { required: true })}
                        onChange={(e) => { props.type == "PJ" ? handleCnpjInput(e.target.value) : handleCpfInput(e.target.value) }}
                        type="text"
                        className="input-text" />
                    {errors.cnpj_cpf && <span className="error-message">{errors.cnpj_cpf.message || 'Campo obrigatório'}</span>}
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">E-mail</label>
                    <input
                        {...register('email', { required: true })}
                        onChange={event => handleEmailInput(event.target.value)}
                        type="email"
                        className="input-text"
                    />
                    {errors.email && <span className="error-message">{errors.email?.message || 'Campo obrigatório'}</span>}
                </div>
                <div className="input-group">
                    <label className="label-title">Whatsapp</label>
                    <input
                        {...register('whatsapp', {
                            required: true,
                            pattern: /^.{14,15}$/,
                        })}
                        onChange={(e) => handleWhatsInput(e.target.value)}
                        maxLength={15}
                        type="text"
                        className="input-text"
                    />
                    {errors.whatsapp && <span className="error-message">{errors.whatsapp.message || 'Campo obrigatório'}</span>}
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">Senha</label>
                    <input {...register('password', { required: true })} type="password" className="input-text" minLength={6} />
                    {errors.password && <span className="error-message">{errors.password.message || 'Campo obrigatório'}</span>}
                </div>
            </div>
            {
                props.type == "PJ" &&
                <>
                    <h3>Endereço</h3>
                    <div className="row">
                        <div className="input-group">
                            <label className="label-title">CEP</label>
                            <InputMask mask={"99999-999"} defaultValue="" {...register('address.cep', { required: true })} type="text" className="input-text" onChange={handleSearchCep} />
                            {errors.address?.cep && <span className="error-message">{errors.address?.cep.message || 'Campo obrigatório'}</span>}
                        </div>
                        <div className="input-group">
                            <label className="label-title">Rua</label>
                            <input {...register('address.street', { required: true })} disabled type="text" className="input-text" />
                            {errors.address?.street && <span className="error-message">{errors.address?.street.message || 'Campo obrigatório'}</span>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-group">
                            <label className="label-title">Estado(UF)</label>
                            <input {...register('address.state', { required: true })} disabled type="text" className="input-text" />
                            {errors.address?.state && <span className="error-message">{errors.address?.state.message || 'Campo obrigatório'}</span>}
                        </div>
                        <div className="input-group">
                            <label className="label-title">Cidade</label>
                            <input {...register('address.city', { required: true })} disabled type="text" className="input-text" />
                            {errors.address?.city && <span className="error-message">{errors.address?.city.message || 'Campo obrigatório'}</span>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-group">
                            <label className="label-title">Bairro</label>
                            <input {...register('address.district', { required: true })} disabled type="text" className="input-text" />
                            {errors.address?.district && <span className="error-message">{errors.address?.district.message || 'Campo obrigatório'}</span>}
                        </div>
                        <div className="input-group">
                            <label className="label-title">Número</label>
                            <input {...register('address.street_number', { required: true })} type="number" className="input-text" />
                            {errors.address?.street_number && <span className="error-message">{errors.address?.street_number.message || 'Campo obrigatório'}</span>}
                        </div>
                    </div>
                </>
            }
            {
                initialPosition.toString() !== [0, 0].toString() && props.type == "PJ" &&
                <>
                    <div className="map-container">
                        <MapContainer center={initialPosition} zoom={15}>
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={selectedPosition} icon={getMarkerIcon()} />
                            <LocationMarker />
                        </MapContainer>
                    </div>
                    <input hidden type="text" {...register("address.location", { required: locationIsRequired })} />
                    {errors.address?.location && <span style={{ margin: "20px 0" }} className="error-message">Obrigatório marcar o mapa</span>}
                </>
            }
            {
                props.type == "PJ" &&
                <>
                    <h3 className="collection-item-title">Ítens de Coleta <small>Selecione um ou mais itens abaixo</small></h3>
                    <div className="collection-items">
                        {
                            typesRecycling.length > 0 && typesRecycling.map((type) => {
                                return (
                                    <div key={type.name} className={`item ${type.selected ? "selected-item" : ""}`} style={{ background: type.color }} onClick={() => handleSelectItem(type.name)}>
                                        <img src={RecycleIcon} alt="Reciclar" />
                                        <span>{type.name}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <input hidden type="text" {...register("materialUser", { required: locationIsRequired })} />
                    {errors.materialUser && <span style={{ marginBottom: "20px" }} className="error-message">Obrigatório selecionar um ou mais itens</span>}
                </>
            }
            <button type="submit" disabled={Object.keys(errors).length > 0}>
                {
                    loading ?
                        <CircleNotch className="spinner" size={30} color="#FFFFFF" />
                        : props.type == "PJ" ? "Registrar ponto de coleta" : "Registrar"
                }
            </button>
        </form >
    )
}

export default RegisterForm