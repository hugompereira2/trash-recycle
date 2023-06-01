import logo from '../../assets/logo.svg';
import { CaretDown, Plus, SignOut, UserCircle, X } from "phosphor-react";
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../LoginForm/LoginForm";
import "./Company.scss";
import { useState, useMemo, Dispatch, SetStateAction } from "react";
import { FaRegBuilding } from 'react-icons/fa';
import { MapPin, PaperPlaneTilt } from "phosphor-react";

type TypesRecycling = {
    id: string;
    name: string;
    color: string;
    selected: boolean;
}

type materialUser = {
    id: string;
    name: string;
    color: string;
}

interface ICompany {
    name: string;
    materialSelected: TypesRecycling[];
    showModal: Dispatch<SetStateAction<boolean>>;
    showDialog: Dispatch<SetStateAction<boolean>>;
    setLocation: Dispatch<SetStateAction<[number, number]>>;
    setInitialLocation: Dispatch<SetStateAction<[number, number]>>;
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
    materialUser: materialUser[];
}

const Company = (props: ICompany) => {
    const { name, address, materialUser, showModal, showDialog, setLocation, setInitialLocation, materialSelected } = props;

    const navigate = useNavigate();
    const location = useLocation();

    const handleShowMap = () => {
        showModal(true)

        setInitialLocation(prevLocation => address.location.split(",").map(parseFloat).slice(0, 2) as [number, number]);
        setLocation(prevLocation => address.location.split(",").map(parseFloat).slice(0, 2) as [number, number]);
    }

    function areArraysEqual(arr1: TypesRecycling[], arr2: materialUser[]) {
        const ids1 = arr1.map(obj => obj.id);
        const ids2 = arr2.map(obj => obj.id);

        if (ids1.length !== ids2.length) {
            return false;
        }

        const sortedIds1 = [...ids1].sort();
        const sortedIds2 = [...ids2].sort();

        for (let i = 0; i < sortedIds1.length; i++) {
            if (sortedIds1[i] !== sortedIds2[i]) {
                return false;
            }
        }

        return true;
    }

    function materialUserHasAllOptions(materialUser: materialUser[], materialSelected: TypesRecycling[]) {
        return materialSelected.every(selectedOption =>
          materialUser.some(userOption => userOption.id === selectedOption.id)
        );
      }
      
    return (
        <div id="company">
            <div className="company-info">
                <div className="img-container">
                    <FaRegBuilding size={65} />
                </div>
                <div className="company-status">
                    <h2>{name}</h2>
                    <div className="company-badge">
                        {
                            materialUser.map((item) => {
                                return (
                                    <span key={item.id} className="badge" style={{ background: item.color }}>{item.name}</span>
                                )
                            })
                        }
                    </div>
                    <span className="state">{`${address.city}/${address.state}`}</span>
                </div>
                <div className="company-action">
                    <button disabled={!materialUserHasAllOptions(materialUser, materialSelected)} onClick={() => showDialog(true)}> <PaperPlaneTilt size={30} color="#e9e9e9" />Solicitar</button>
                    <button onClick={() => handleShowMap()}> <MapPin size={30} color="#e9e9e9" />Ver mapa</button>
                </div>
            </div>
        </div>
    )
}

export default Company