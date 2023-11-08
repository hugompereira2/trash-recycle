import logo from '../../assets/logo.svg';
import { SmileySad, X } from "phosphor-react";
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getLocalStorageUser, dateFormatted } from "../../utils/utils";
import { findSolicitations, changeStatusSolicitation, finalizeSolicitation } from "../../api/api";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import LoginForm from "../LoginForm/LoginForm";
import "./Dashboard.scss";
import { useState, useMemo, useEffect } from "react";
import iconImg from 'leaflet/dist/images/marker-icon.png';
import { toast } from "react-toastify";
import L from "leaflet";
import { useTable, TableOptions, Column } from "react-table";
import GoogleMap from '../GoogleMap/GoogleMap';

interface CompanyAddress {
    cep: string;
    city: string;
    state: string;
    district: string;
    street: string;
    location: string;
    street_number: string;
}

interface solicitationMaterial {
    id: string;
    solicitation_id: string;
    clientName?: string;
    amount: number;
    material: { name: string, color: string }
}

interface solicitationProps {
    client_user_id: string;
    id: string;
    created_at: string;
    active_date: string;
    active: boolean | null;
    finalized: boolean;
    company: {
        id: string;
        name: string;
        userType_id: string;
        address_id: string | null;
        cnpj_cpf: string;
        email: string;
        phone: string;
        created_at: string;
        address: CompanyAddress;
    };
    client: {
        id: string;
        name: string;
        userType_id: string;
        address_id: string | null;
        cnpj_cpf: string;
        email: string;
        phone: string;
        created_at: string;
        address: CompanyAddress;
    };
    solicitationMaterial: solicitationMaterial[];
}

interface SolicitationData {
    col1: string;
    col2: string;
    col3: string;
    col4: string;
    col5: React.ReactNode;
    col6: React.ReactNode;
}

const Dashboard = () => {
    const [solicitations, setSolicitations] = useState([]);
    const [data, setData] = useState<SolicitationData[]>([]);
    const [material, setMaterial] = useState<solicitationMaterial[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [pfUser, setPfUser] = useState<boolean>(false);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

    const navigate = useNavigate();
    const location = useLocation();
    const user = getLocalStorageUser();

    const getSolicitations = async () => {
        const { data } = await findSolicitations(user?.id!);

        setSolicitations(data);
    }

    useEffect(() => {
        getSolicitations();
        setPfUser(user?.userType_id === "7635808d-3f19-4543-ad4b-9390bd4b3770")
    }, [])

    function handleStatus(status: boolean | null, finalized: boolean): React.ReactNode {
        if (finalized && !status) {
            return <span className="badge red">Recusado</span>;
        }
        if (finalized) {
            return <span className="badge blue">Finalizado</span>;
        }

        let badgeClassName: string;
        let statusLabel: string;

        if (status === null) {
            badgeClassName = "yellow";
            statusLabel = "Pendente";
        } else if (status === false) {
            badgeClassName = "red";
            statusLabel = "Recusado";
        } else if (status === true) {
            badgeClassName = "green";
            statusLabel = "Aprovado";
        } else {
            badgeClassName = "";
            statusLabel = "Status inválido";
        }

        return <span className={`badge ${badgeClassName}`}>{statusLabel}</span>;
    }

    const handleDeadline = (solicitation: solicitationProps): string => {
        if (solicitation.active_date) {
            const currentDate = new Date(solicitation.active_date);
            currentDate.setDate(currentDate.getDate() + 7);
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            return formattedDate;
        }

        return "N/I";
    };

    const handleChangeStatus = async (SolictationID: string, status: boolean) => {

        const resp = await changeStatusSolicitation(SolictationID, status);

        if (resp?.status == 200) {
            toast.success("Sucesso!", { autoClose: 2000, });
            getSolicitations();
        } else {
            toast.error(`Error:${resp.msg} ${resp.code}`, { autoClose: 2000, });
        }
    }

    const handleFinalizeSolictation = async (SolictationID: string) => {

        const resp = await finalizeSolicitation(SolictationID);

        if (resp?.status == 200) {
            toast.success("Sucesso!", { autoClose: 2000, });
            getSolicitations();
        } else {
            toast.error(`Error:${resp.msg} ${resp.code}`, { autoClose: 2000, });
        }
    }

    const handleShowMap = (location: string) => {
        setShowModal(true)

        setSelectedPosition(prevLocation => location.split(",").map(parseFloat).slice(0, 2) as [number, number]);
    }

    const handleShowModal = (solicitationMaterial: solicitationMaterial[], clientName: string) => {
        solicitationMaterial[0].clientName = clientName;
        setMaterial(solicitationMaterial);

        setShowModal(true)
    }

    function handleActions(locationOrID: string | null, status: boolean | null, finalized: boolean, solicitationMaterial: solicitationMaterial[], clientName: string): React.ReactNode {
        let actionButton1: React.ReactNode;
        let actionButton2: React.ReactNode;

        if (pfUser) {
            actionButton1 = <button onClick={() => handleShowMap(locationOrID!)} className="purple">Mapa</button>;
        } else {
            actionButton1 = <button disabled={finalized} onClick={() => handleShowModal(solicitationMaterial, clientName)} className="purple">Visualizar</button>;
            if (!finalized && status) {
                actionButton1 = <button onClick={() => handleFinalizeSolictation(locationOrID!)} className="blue">Finalizar</button>;
            }
        }

        return (
            <div className="action-container">
                {actionButton1}
                {actionButton2}
            </div>
        );
    }

    useEffect(() => {
        if (solicitations.length > 0) {
            setData(
                solicitations.map((solicitation: solicitationProps) => ({
                    col1: solicitation.id,
                    col2: dateFormatted(solicitation.created_at),
                    col3: solicitation.company?.name || solicitation.client?.name,
                    col4: handleDeadline(solicitation),
                    col5: handleStatus(solicitation.active, solicitation.finalized),
                    col6: handleActions((
                        solicitation.company?.address?.location || solicitation.id),
                        solicitation.active,
                        solicitation.finalized,
                        solicitation.solicitationMaterial,
                        solicitation.client?.name
                    )
                }))
            );
        }
    }, [solicitations])

    function getMarkerIcon() {
        const icon = new L.Icon({
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            iconUrl: iconImg,
        });
        return icon;
    }

    const columns: Column<SolicitationData>[] = useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'col1', // accessor is the "key" in the data
            },
            {
                Header: 'Data',
                accessor: 'col2',
            },
            {
                Header: `${user?.userType_id === "7635808d-3f19-4543-ad4b-9390bd4b3770" ? "Empresa" : "Cliente"}`,
                accessor: 'col3',
            },
            {
                Header: 'Prazo',
                accessor: 'col4',
            },
            {
                Header: 'Status',
                accessor: 'col5',
            },
            {
                Header: 'Ações',
                accessor: 'col6',
            },
        ],
        []
    )

    function LocationMarker() {
        const [position, setPosition] = useState(null)

        return position === null ? null : (
            <Marker position={position}>
            </Marker>
        )
    }

    const tableInstance = useTable({ columns, data });
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    return (
        <div id="dashboard">
            <div className="table-container">
                <Dialog.Root open={showModal} onOpenChange={() => setShowModal(!showModal)}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="dialog-overlay" />
                        <Dialog.Content className="dialog-content dialog-content-map">
                            <Dialog.Close className="dialog-close" onClick={(e) => setMaterial([])}>
                                <X size={24} aria-label="Fechar" />
                            </Dialog.Close>
                            <Dialog.Title className="dialog-title">
                                {
                                    material.length > 0
                                        ?
                                        <>
                                            Solicitação
                                            <small>{material[0].clientName}</small>
                                        </>
                                        : 'Mapa'
                                }
                            </Dialog.Title>
                            {
                                material.length > 0 ?
                                    <div className="dialog-black-text">
                                        <div className="card-deck">
                                            {
                                                material.map((solicitation) => {
                                                    return (
                                                        <div key={solicitation.id} className="card-recycle" style={{ background: `${solicitation.material.color}` }}>
                                                            <h2>{solicitation.material.name}</h2>
                                                            <strong>{solicitation.amount.toString().replace('.', ',')}</strong>
                                                            <span>KG</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <br /><br />
                                        <div className="dialog-button-footer">
                                            <button onClick={() => {
                                                handleChangeStatus(material[0].solicitation_id, false)
                                                setShowModal(false)
                                            }} className="cancel-button">
                                                Recusar
                                            </button>
                                            <button onClick={() => {
                                                handleChangeStatus(material[0].solicitation_id, true)
                                                setShowModal(false)
                                            }} className="confirm-button">
                                                Aprovar
                                            </button>
                                        </div>
                                    </div> :
                                    // <div className="map-container">
                                    //     <MapContainer center={initialPosition} zoom={15}>
                                    //         <TileLayer
                                    //             attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    //             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    //         <Marker position={selectedPosition} icon={getMarkerIcon()} />
                                    //         <LocationMarker />
                                    //     </MapContainer>
                                    // </div>
                                    // <GoogleMap center={initialPosition} position={selectedPosition} />
                                    <GoogleMap position={selectedPosition} />
                            }
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
                <h1>Dashboard</h1>
                {
                    solicitations?.length > 0 ?
                        <table {...getTableProps()} style={{
                            borderRadius: '8px',
                        }}>
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(column => (
                                            <th
                                                {...column.getHeaderProps()}
                                                style={{
                                                    borderBottom: '1px solid #ced4da',
                                                    color: 'black',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {column.render('Header')}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>
                                {rows.map(row => {
                                    prepareRow(row)
                                    return (
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map(cell => {
                                                return (
                                                    <td
                                                        {...cell.getCellProps()}
                                                        style={{
                                                            padding: '10px',
                                                            borderBottom: '1px solid #ced4da',
                                                        }}
                                                    >
                                                        {cell.render('Cell')}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        :
                        <div className="full-height">
                            <h4>Nenhuma solicitação encontrada.</h4>
                            <SmileySad size={80} color="var(--grey-text)" />
                        </div>
                }
            </div>
        </div>
    )
}

export default Dashboard