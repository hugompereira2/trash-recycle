import logo from '../../assets/logo.svg';
import logoSmall from '../../assets/logo_small.svg';
import { CaretDown, List, Plus, SignOut, UserCircle, UserSquare, X } from "phosphor-react";
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import userContext from '../../context/userContext'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useWindowSize } from '@react-hook/window-size';
import { GiHamburgerMenu } from 'react-icons/gi';
import LoginForm from "../LoginForm/LoginForm";
import "./Navbar.scss";
import { useEffect, useState, useContext, useRef } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userStorage, setUserStorage] = useState();
    const [windowWidth, windowHeight] = useWindowSize();
    const [isMobile, setIsMobile] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [error, setError] = useState<string>("");

    const { user, setUser } = useContext(userContext);

    const GoHome = () => {
        Object.keys(user).length > 0 ? navigate("/dashboard") : navigate("/");
    }

    const GoDashboard = () => {
        navigate("/dashboard");
        setProfileMenu(false)
    }

    const GoRequisition = () => {
        navigate("/solicitacao");
        setProfileMenu(false)
    }

    const goProfile = () => {
        navigate("/perfil");
        setProfileMenu(false)
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser({});
        setProfileMenu(false);
        navigate("/");
    }

    useEffect(() => {
        setIsMobile(windowWidth < 700);
    }, [windowHeight, windowWidth]);

    return (
        <div id="navbar">
            <Dialog.Root open={profileMenu} onOpenChange={() => setProfileMenu(!profileMenu)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="dialog-overlay" />
                    <Dialog.Content className="dialog-content dialog-full">
                        <Dialog.Close className="dialog-close" onClick={(e) => setProfileMenu(false)}>
                            <X size={24} aria-label="Fechar" />
                        </Dialog.Close>
                        <Dialog.Title className="dialog-title">
                            Perfil
                        </Dialog.Title>
                        <div className="profile-container">
                            <h3>{user.name}</h3>
                            <small>
                                {user.userType_id == "975791b6-e2c6-465f-848b-852811563230"
                                    ? " Pessoa Jurídica"
                                    : "Pessoa Física"}
                            </small>
                        </div>
                        <div className="link-container">
                            {
                                Object.keys(user).length > 0 &&
                                <Link className={`${location.pathname == "/dashboard" ? "active-page" : ""} `} to={"/dashboard"} onClick={GoDashboard}>Dashboard</Link>}
                            {
                                Object.keys(user).length > 0 && user.userType_id == "7635808d-3f19-4543-ad4b-9390bd4b3770" &&
                                <Link className={`${location.pathname == "/solicitacao" ? "active-page" : ""} `} to={"/solicitacao"} onClick={GoRequisition}>Solicitação</Link>
                            }
                            <Link className={`${location.pathname == "/perfil" ? "active-page" : ""} `} to={"/perfil"} onClick={GoDashboard}>Perfil</Link>
                            <button className="logout-mobile" onClick={handleLogout}>Logout</button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <div className="logo-dasboard">
                <img src={isMobile ? logoSmall : logo} className="logo" alt="logo" onClick={GoHome} />
                {
                    !isMobile &&
                    <>
                        {
                            Object.keys(user).length > 0 &&
                            <span className={`${location.pathname == "/dashboard" ? "active-page" : ""} `} onClick={GoDashboard}>Dashboard</span>}
                        {
                            Object.keys(user).length > 0 && user.userType_id == "7635808d-3f19-4543-ad4b-9390bd4b3770" &&
                            <span className={`${location.pathname == "/solicitacao" ? "active-page" : ""} `} onClick={GoRequisition}>Solicitação</span>
                        }
                    </>
                }
            </div>
            <div className="navbar-options">
                {
                    Object.keys(user).length > 0 ?
                        <>
                            {
                                isMobile ?
                                    <>
                                        <GiHamburgerMenu onClick={() => setProfileMenu(!profileMenu)} cursor={"pointer"} size={45} color="var(--purple-text)" />
                                    </> :
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <div className="user-info">
                                                <UserCircle size={32} color="#737c7b" />
                                                <div className="user-name-type">
                                                    <span>{user.name}</span>
                                                    <small>
                                                        {user.userType_id == "975791b6-e2c6-465f-848b-852811563230"
                                                            ? " Pessoa Jurídica"
                                                            : "Pessoa Física"}
                                                        <CaretDown size={20} color="var(--grey-text)" />
                                                    </small>
                                                </div>
                                            </div>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                                                <DropdownMenu.Item className="DropdownMenuItem" onClick={goProfile}>
                                                    Perfil <UserSquare size={20} color="var(--grey-text)" />
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item className="DropdownMenuItem" onClick={handleLogout}>
                                                    Logout <SignOut size={20} color="var(--grey-text)" />
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                            }
                        </>
                        :
                        <>
                            {location.pathname == "/register" && <Link to="/">Voltar para Home</Link>}
                            {
                                location.pathname != "/register" &&
                                <>
                                    <Dialog.Root open={showModal} onOpenChange={() => setShowModal(!showModal)}>
                                        <Dialog.Trigger
                                            type="button"
                                            className="dialog-button"
                                            onClick={() => ("")}
                                        >
                                            Login
                                        </Dialog.Trigger>

                                        <Dialog.Portal>
                                            <Dialog.Overlay className="dialog-overlay" />

                                            <Dialog.Content className="dialog-content">
                                                <Dialog.Close className="dialog-close">
                                                    <X size={24} aria-label="Fechar" />
                                                </Dialog.Close>

                                                <Dialog.Title className="dialog-title">
                                                    Login
                                                </Dialog.Title>
                                                {error && <span className="error-message">{error}</span>}
                                                <LoginForm setError={setError} setShowModal={setShowModal} />
                                            </Dialog.Content>
                                        </Dialog.Portal>
                                    </Dialog.Root>
                                </>
                            }
                        </>
                }
            </div>
        </div>
    )
}

export default Navbar