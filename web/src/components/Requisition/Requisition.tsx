import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RecycleIcon from '../../assets/recycle_icon.svg';
import { findMaterials } from "../../api/api";
import { FaRegBuilding } from 'react-icons/fa';
import { useForm } from "react-hook-form";
import "./Requisition.scss";
import { MapPin, PaperPlaneTilt } from "phosphor-react";

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

const Requisition = () => {
    const [typesRecycling, setTypesRecycling] = useState<TypesRecycling[]>([]);

    const navigate = useNavigate();
    const location = useLocation();

    const getMaterials = async () => {
        const { data } = await findMaterials();
        setTypesRecycling(data);
    }

    const { register, reset, clearErrors, setValue, handleSubmit, setError, formState: { errors } } = useForm<IUser>();

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
        getMaterials();
    }, [])

    return (
        <div id="requisition">
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
                <div className="company-list">
                    <h3 className="collection-item-title">Empresas</h3>
                    <div className="table-container">
                        <div className="company">
                            <div className="company-info">
                                <div className="img-container">
                                    <FaRegBuilding size={65} />
                                </div>
                                <div className="company-status">
                                    <h2>Vermilion Interprise</h2>
                                    <div className="company-badge">
                                        <span>Papel</span>
                                        <span>Plástico</span>
                                        <span>Vidro</span>
                                    </div>
                                    <span>Lins - SP</span>
                                </div>
                                <div className="company-action">
                                    <button> <PaperPlaneTilt size={30} color="#e9e9e9" />Solicitar</button>
                                    <button> <MapPin size={30} color="#e9e9e9" /> Ver mapa</button>
                                </div>
                            </div>
                        </div>
                        <div className="company">
                            <div className="company-info">
                                <div className="img-container">
                                    <FaRegBuilding size={65} />
                                </div>
                                <div className="company-status">
                                    <h2>Vermilion Interprise</h2>
                                    <div className="company-badge">
                                        <span>Papel</span>
                                        <span>Plástico</span>
                                        <span>Vidro</span>
                                    </div>
                                    <span>Lins - SP</span>
                                </div>
                                <div className="company-action">
                                    <button> <PaperPlaneTilt size={30} color="#e9e9e9" />Solicitar</button>
                                    <button> <MapPin size={30} color="#e9e9e9" /> Ver mapa</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Requisition