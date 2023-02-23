import { useState, useRef, useEffect, ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import axios from "axios";
import InputMask from "react-input-mask";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconImg from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import RecycleIcon from '../../assets/recycle_icon.svg';
import "./RegisterForm.scss"
import { registerUser } from "../../api/api";

interface IRegister {
    type: string,
}

interface ICepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    unidade: string;
}

interface IAddress {
    cep: string;
    state: string;
    city: string;
    district: string;
    street: string;
    street_number: string;
}

interface IUser {
    name: string;
    cnpj_cpf: string;
    email: string;
    whatsapp: string;
    password: string;
    address: IAddress
    typeRecycle?: number[];
    location?: [number, number];
}

const RegisterForm = (props: IRegister) => {
    const ref = useRef<HTMLHeadingElement>(null);
    const [user, setUser] = useState<IUser>();
    const [locationIsRequired, setLocationIsRequired] = useState<boolean>(props.type === "PJ");
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [maskType, setMaskType] = useState<string>("");
    const [typesRecycling, setTypesRecycling] = useState([
        { id: 1, name: "Papel", color: "#0268d3", selected: false },
        { id: 2, name: "Plastico", color: "#ed0007", selected: false },
        { id: 3, name: "Vidro", color: "#01a447", selected: false },
        { id: 4, name: "Metal", color: "#fad002", selected: false },
        { id: 5, name: "Organico", color: "#834125", selected: false },
    ]);


    const { register, reset, clearErrors, setValue, handleSubmit, formState: { errors } } = useForm<IUser>();

    const onSubmit = async (data: IUser) => {
        console.log(data);
        let payload = {
            ...data,
            userType_id: props.type == "PJ" ? "975791b6-e2c6-465f-848b-852811563230" : "7635808d-3f19-4543-ad4b-9390bd4b3770"
        }

        console.log(payload)
        // const resp = await registerUser(payload);
        // console.log(resp);

    };

    function LocationMarker() {
        const [position, setPosition] = useState(null)
        const map = useMapEvents({
            click(e) {
                clearErrors('location');
                setValue("location", [e.latlng.lat, e.latlng.lng]);
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
            const { data } = await axios.get<ICepResponse>(`https://viacep.com.br/ws/${value.replace("-", "")}/json/`);

            setValue("address.state", data.uf)
            setValue("address.cep", data.cep)
            setValue("address.street", data.logradouro)
            setValue("address.city", data.localidade)
            setValue("address.district", data.bairro)
            clearErrors('address');
            console.log(data);

        }
        return
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        });
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
            setValue("typeRecycle", selectedIds)

            return updatedTypesRecycling;
        });
        clearErrors("typeRecycle");
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
            email: '',
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
                    {errors.name && <span className="error-message">Campo obrigatório</span>}
                </div>
                <div className="input-group">
                    <label className="label-title">{props.type == "PJ" ? "CNPJ" : "CPF"}</label>
                    <InputMask mask={maskType} defaultValue="______" {...register('cnpj_cpf', { required: true })} type="text" className="input-text" />
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
                    <InputMask mask={"(99) 99999-9999"} {...register('whatsapp', { required: true })} type="text" className="input-text" />
                    {errors.whatsapp && <span className="error-message">Campo obrigatório</span>}
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">Senha</label>
                    <input {...register('password', { required: true })} type="password" className="input-text" minLength={6} />
                    {errors.password && <span className="error-message">Campo obrigatório</span>}
                </div>
            </div>
            <h3>Endereço</h3>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">CEP</label>
                    <InputMask mask={"99999-999"} defaultValue="" {...register('address.cep', { required: true })} type="text" className="input-text" onChange={handleSearchCep} />
                    {errors.address?.cep && <span className="error-message">Campo obrigatório</span>}
                </div>
                <div className="input-group">
                    <label className="label-title">Rua</label>
                    <input {...register('address.street', { required: true })} disabled type="text" className="input-text" />
                    {errors.address?.street && <span className="error-message">Campo obrigatório</span>}
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">Estado(UF)</label>
                    <input {...register('address.state', { required: true })} disabled type="text" className="input-text" />
                    {errors.address?.state && <span className="error-message">Campo obrigatório</span>}
                </div>
                <div className="input-group">
                    <label className="label-title">Cidade</label>
                    <input {...register('address.city', { required: true })} disabled type="text" className="input-text" />
                    {errors.address?.city && <span className="error-message">Campo obrigatório</span>}
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">Bairro</label>
                    <input {...register('address.district', { required: true })} disabled type="text" className="input-text" />
                    {errors.address?.district && <span className="error-message">Campo obrigatório</span>}
                </div>
                <div className="input-group">
                    <label className="label-title">Número</label>
                    <input {...register('address.street_number', { required: true })} type="number" className="input-text" />
                    {errors.address?.street_number && <span className="error-message">Campo obrigatório</span>}
                </div>
            </div>
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
                    <input hidden type="text" {...register("location", { required: locationIsRequired })} />
                    {errors.location && <span style={{ margin: "20px 0" }} className="error-message">Obrigatório marcar o mapa</span>}
                </>

            }
            {
                props.type == "PJ" &&
                <>
                    <h3 className="collection-item-title">Ítens de Coleta <small>Selecione um ou mais itens abaixo</small></h3>
                    <div className="collection-items">
                        {
                            typesRecycling.map((type) => {
                                return (
                                    <div key={type.name} className={`item ${type.selected ? "selected-item" : ""}`} style={{ background: type.color }} onClick={() => handleSelectItem(type.name)}>
                                        <img src={RecycleIcon} alt="Reciclar" />
                                        <span>{type.name}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <input hidden type="text" {...register("typeRecycle", { required: locationIsRequired })} />
                    {errors.typeRecycle && <span style={{marginBottom: "20px"}} className="error-message">Obrigatório selecionar um ou mais itens</span>}
                </>
            }
            <button type="submit">{props.type == "PJ" ? "Registrar ponto de coleta" : "Registrar"}</button>
        </form >
    )
}

export default RegisterForm