import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import "./Profile.scss";
import { useEffect, useState, useContext, ChangeEvent } from "react";
import { updateUser, findCep, findMaterials } from "../../api/api";
import userContext from '../../context/userContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import RecycleIcon from '../../assets/recycle_icon.svg';
import L from 'leaflet';
import iconImg from 'leaflet/dist/images/marker-icon.png';

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
    userType_id: string;
    address?: IAddress | null
    materialUser?: { material_id: string }[];
}

type TypesRecycling = {
    id: string;
    name: string;
    color: string;
    selected: boolean;
}

const Profile = () => {
    const [userForm, setUserForm] = useState<IUser>();
    const [mask, setMask] = useState("");
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [typesRecycling, setTypesRecycling] = useState<TypesRecycling[]>([]);
    const pj = "975791b6-e2c6-465f-848b-852811563230";

    const { user, setUser } = useContext(userContext);

    const { register, setValue, reset, clearErrors, handleSubmit, watch, formState: { errors } } = useForm<IUser>();

    const onSubmit = async (data: IUser) => {

        const resp = await updateUser(data);
        if (resp?.status == 200) {
            if (resp.data.address?.location) {

                const locationSplited = resp.data.address?.location?.split(",")
                const locationFormatted = locationSplited ? [parseFloat(locationSplited[0]), parseFloat(locationSplited[1])] : []

                resp.data.address.location = locationFormatted
            }
            setUser(resp.data);

            localStorage.setItem("user", JSON.stringify(resp.data));

            toast.success("Sucesso!", { autoClose: 2000, });
        } else {
            toast.error(`Error: ${resp.code}`, { autoClose: 2000, });
        }
    };

    const compareLists = (allMaterials: TypesRecycling[], userMaterials: { material_id: string }[]) => {
        const idSet = new Set(userMaterials.map((material) => material.material_id));

        return allMaterials.map(obj => ({
            ...obj,
            selected: idSet.has(obj.id)
        }));
    }

    const getMaterials = async () => {
        const { data } = await findMaterials();
        const material = user.materialUser;

        const updatedData = compareLists(data, material);

        setTypesRecycling(updatedData);
    }

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
            setValue("materialUser", selectedIds.map(id => ({ material_id: id })));

            return updatedTypesRecycling;
        });
        clearErrors("materialUser");
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

    function getMarkerIcon() {
        const icon = new L.Icon({
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            iconUrl: iconImg,
        });
        return icon;
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

    useEffect(() => {
        if (Object.keys(user).length > 0) {

            setUserForm({
                name: user.name,
                cnpj_cpf: user.cnpj_cpf,
                email: user.email,
                whatsapp: user.phone,
                userType_id: user.userType_id,
                address: user.address,
                materialUser: user.materialUser?.length > 0 ? user.materialUser.map(material => ({ material_id: material.material_id })) : []
            })

            if (user.address) {
                getMaterials();

                setInitialPosition(user.address.location);
                setSelectedPosition(user.address.location)
            }
        }
    }, [user])

    useEffect(() => {
        if (userForm) {
            setMask(userForm?.userType_id == pj ? "99.999.999/9999-99" : "999.999.999-99");

            setValue("whatsapp", userForm?.whatsapp);
            setValue("cnpj_cpf", userForm?.cnpj_cpf);

            if (userForm?.address?.cep) {
                setValue("address.cep", userForm?.address.cep);
            }

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
                            <label className="label-title"> {userForm?.userType_id == pj ? "Nome Fantasia" : "Nome Completo"}</label>
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
                            <input {...register('email', { required: true, })} readOnly type="email" className="input-text" />
                            {errors.email && <span className="error-message">Campo obrigatório</span>}
                        </div>
                        <div className="input-group">
                            <label className="label-title">Whatsapp</label>
                            <InputMask {...register('whatsapp', { required: true })} mask={"(99) 99999-9999"} type="text" className="input-text" />
                            {errors.whatsapp && <span className="error-message">Campo obrigatório</span>}
                        </div>
                    </div>
                    {
                        userForm?.userType_id == pj &&
                        <>
                            <div className="row">
                                <div className="input-group">
                                    <label className="label-title">CEP</label>
                                    <InputMask mask={"99999-999"} {...register('address.cep', { required: (userForm?.userType_id == pj) })} type="text" className="input-text" onChange={handleSearchCep} />
                                    {errors.address?.cep && <span className="error-message">Campo obrigatório</span>}
                                </div>
                                <div className="input-group">
                                    <label className="label-title">Rua</label>
                                    <input {...register('address.street', { required: (userForm?.userType_id == pj) })} disabled type="text" className="input-text" />
                                    {errors.address?.street && <span className="error-message">Campo obrigatório</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-group">
                                    <label className="label-title">Estado(UF)</label>
                                    <input {...register('address.state', { required: (userForm?.userType_id == pj) })} disabled type="text" className="input-text" />
                                    {errors.address?.state && <span className="error-message">Campo obrigatório</span>}
                                </div>
                                <div className="input-group">
                                    <label className="label-title">Cidade</label>
                                    <input {...register('address.city', { required: (userForm?.userType_id == pj) })} disabled type="text" className="input-text" />
                                    {errors.address?.city && <span className="error-message">Campo obrigatório</span>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-group">
                                    <label className="label-title">Bairro</label>
                                    <input {...register('address.district', { required: (userForm?.userType_id == pj) })} disabled type="text" className="input-text" />
                                    {errors.address?.district && <span className="error-message">Campo obrigatório</span>}
                                </div>
                                <div className="input-group">
                                    <label className="label-title">Número</label>
                                    <input {...register('address.street_number', { required: (userForm?.userType_id == pj) })} type="number" className="input-text" />
                                    {errors.address?.street_number && <span className="error-message">Campo obrigatório</span>}
                                </div>
                            </div>
                            <div className="map-container">
                                <MapContainer center={initialPosition} zoom={15}>
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Marker position={selectedPosition} icon={getMarkerIcon()} />
                                    <LocationMarker />
                                </MapContainer>
                            </div>
                            <input hidden type="text" {...register("address.location", { required: (userForm?.userType_id == pj) })} />
                            {
                                errors.address?.location &&
                                <span style={{ margin: "20px 0" }} className="error-message">Obrigatório marcar o mapa</span>
                            }
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
                            <input hidden type="text" {...register("materialUser", { required: (userForm?.userType_id == pj) })} />
                            {errors.materialUser && <span style={{ marginBottom: "20px" }} className="error-message">Obrigatório selecionar um ou mais itens</span>}
                        </>
                    }
                    <div className="form-action">
                        <button type="submit">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Profile