import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RecycleIcon from '../../assets/recycle_icon.svg';
import { findMaterials, findCompanyByMaterial } from "../../api/api";
import * as Dialog from '@radix-ui/react-dialog';
import { X } from "phosphor-react";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useForm } from "react-hook-form";
import "./Requisition.scss";
import iconImg from 'leaflet/dist/images/marker-icon.png';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import L from "leaflet";
import Company from "../Company/Company";

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

interface ICompany {
    name: string;
    address: {
        id: string;
        cep: string;
        city: string;
        state: string;
        district: string;
        street: string;
        location: string;
        street_number: string | null;
    };
    materialUser:
    {
        id: string;
        name: string;
        color: string;
    }[];
}

const Requisition = () => {
    const [typesRecycling, setTypesRecycling] = useState<TypesRecycling[]>([]);
    const [foundCompany, setFoundCompany] = useState<ICompany[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [showModal, setShowModal] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const { register, reset, clearErrors, setValue, handleSubmit, setError, formState: { errors } } = useForm<IUser>();

    const navigate = useNavigate();
    const location = useLocation();

    const getMaterials = async () => {
        const { data } = await findMaterials();
        setTypesRecycling(data);
    }

    const getCompanyByMaterials = async () => {

        let filteredMaterials: string = "";

        typesRecycling.map((material, index) => {
            if (material.selected) {
                filteredMaterials += `${filteredMaterials.length == 0 ? "" : ","}${material.id}`;
            }
        })

        const { data } = await findCompanyByMaterial(filteredMaterials);
        setFoundCompany(data);

    }

    function LocationMarker() {
        const [position, setPosition] = useState(null)

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
        getCompanyByMaterials();
    }, [typesRecycling])

    useEffect(() => {
        getMaterials();
    }, [])

    return (
        <div id="requisition">
            <Dialog.Root open={showModal} onOpenChange={() => setShowModal(!showModal)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="dialog-overlay" />

                    <Dialog.Content className="dialog-content dialog-content-map">
                        <Dialog.Close className="dialog-close">
                            <X size={24} aria-label="Fechar" />
                        </Dialog.Close>

                        <Dialog.Title className="dialog-title">
                            Mapa
                        </Dialog.Title>
                        <div className="map-container">
                            <MapContainer center={initialPosition} zoom={15}>
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={selectedPosition} icon={getMarkerIcon()} />
                                <LocationMarker />
                            </MapContainer>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <AlertDialog.Root open={showDialog} onOpenChange={() => setShowDialog(!showDialog)}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="dialog-overlay" />
                    <AlertDialog.Content className="dialog-content dialog-content-alert">
                        <AlertDialog.Title className="dialog-title">
                            Solicitação
                        </AlertDialog.Title>
                        <AlertDialog.Description className="dialog-black-text">
                            This action cannot be undone. This will permanently delete your account and remove your
                            data from our servers.
                        </AlertDialog.Description>
                        <div className="dialog-button-footer">
                            <AlertDialog.Cancel onClick={() => setShowDialog(!showDialog)} className="cancel-button">
                                Cancelar
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                Confirmar
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
            <div className="requisition-container">
                <h1>Solicitação</h1>
                <form>
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
                    {/* {errors.materialUser && <span style={{ marginBottom: "20px" }} className="error-message">Obrigatório selecionar um ou mais itens</span>} */}
                </form>
                {
                    foundCompany.length > 0 &&
                    <>
                        <span className="error-message">Algumas empresas podem não atender todos os critérios.</span>
                        <div className="company-list">
                            <h3 className="collection-item-title">Empresas</h3>
                            <div className="table-container">
                                {
                                    foundCompany.map((item, index) => {
                                        return (
                                            <Company
                                                key={index}
                                                name={item.name}
                                                showModal={setShowModal}
                                                showDialog={setShowDialog}
                                                materialUser={item.materialUser}
                                                address={item.address}
                                                materialSelected={typesRecycling.filter((item) => item.selected == true)}
                                                setLocation={setSelectedPosition}
                                                setInitialLocation={setInitialPosition}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default Requisition