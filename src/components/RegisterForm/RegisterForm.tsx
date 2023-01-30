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
import "./RegisterForm.scss"

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
    logradouro: string;
    estado: string;
    cidade: string;
    bairro: string;
    numero: string;
}

interface IUser {
    name: string;
    cnpj_cpf: string;
    email: string;
    whatsapp: string;
    address: IAddress
}


const RegisterForm = (props: IRegister) => {
    const ref = useRef<HTMLHeadingElement>(null);
    const [user, setUser] = useState<IUser>();
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [maskType, setMaskType] = useState<string>("");

    const { register, setValue, reset, handleSubmit, watch, formState: { errors } } = useForm<IUser>();
    const onSubmit = (data: IUser) => console.log(data);

    function LocationMarker() {
        const [position, setPosition] = useState(null)
        const map = useMapEvents({
            click(e) {
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
            const { data } = await axios.get<ICepResponse>(`http://viacep.com.br/ws/${value.replace("-", "")}/json/`);

            setValue("address.estado", data.uf)
            setValue("address.cep", data.cep)
            setValue("address.logradouro", data.logradouro)
            setValue("address.cidade", data.localidade)
            setValue("address.bairro", data.bairro)

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

    useEffect(() => {
        if (ref) {
            ref.current?.scrollIntoView({ behavior: "smooth" });
        }

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
            <h3>Endereço</h3>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">CEP</label>
                    <InputMask mask={"99999-999"} defaultValue="" {...register('address.cep', { required: true })} type="text" className="input-text" onChange={handleSearchCep} />
                    {errors.address?.cep && <span className="error-message">Campo obrigatório</span>}
                </div>
                <div className="input-group">
                    <label className="label-title">Rua</label>
                    <input {...register('address.logradouro', { required: true })} disabled type="text" className="input-text" />
                    {errors.address?.logradouro && <span className="error-message">Campo obrigatório</span>}
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">Estado(UF)</label>
                    <input {...register('address.estado', { required: true })} disabled type="text" className="input-text" />
                    {errors.address?.estado && <span className="error-message">Campo obrigatório</span>}
                </div>
                <div className="input-group">
                    <label className="label-title">Cidade</label>
                    <input {...register('address.cidade', { required: true })} disabled type="text" className="input-text" />
                    {errors.address?.cidade && <span className="error-message">Campo obrigatório</span>}
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <label className="label-title">Bairro</label>
                    <input {...register('address.bairro', { required: true })} disabled type="text" className="input-text" />
                    {errors.address?.bairro && <span className="error-message">Campo obrigatório</span>}
                </div>
                <div className="input-group">
                    <label className="label-title">Número</label>
                    <input {...register('address.numero', { required: true })} type="number" className="input-text" />
                    {errors.address?.numero && <span className="error-message">Campo obrigatório</span>}
                </div>
            </div>
            {
                initialPosition.toString() !== [0, 0].toString() &&
                <div className="map-container">
                    <MapContainer center={initialPosition} zoom={15}>
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={selectedPosition} icon={getMarkerIcon()} />
                        <LocationMarker />
                    </MapContainer>
                </div>
            }
            <button type="submit">Enviar</button>
        </form>
    )
}

export default RegisterForm