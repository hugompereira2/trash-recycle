import logo from '../../assets/logo.svg';
import { CaretDown, Plus, SignOut, UserCircle, UserSquare, X } from "phosphor-react";
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../LoginForm/LoginForm";
import "./Navbar.scss";
import { useEffect, useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string>("");

    const GoHome = () => {
        navigate("/");
    }

    const GoDashboard = () => {
        navigate("/dashboard");
    }

    const goProfile = () => {
        navigate("/profile");
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
        setUser(false);
    }

    useEffect(() => {
        const userStringfy = localStorage.getItem("user");

        if (userStringfy) {
            setUser(JSON.parse(userStringfy));
        }
    }, [showModal])

    return (
        <div id="navbar">
            <div className="logo-dasboard">
                <img src={logo} className="logo" alt="logo" onClick={GoHome} />
                <span className={`${location.pathname == "/dashboard" ? "active-page" : ""} `} onClick={GoDashboard}>Dashboard</span>
            </div>
            <div className={`navbar-options ${user ? "" : ""}`}>
                {
                    user ?
                        <>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <div className="user-info">
                                        <UserCircle size={32} color="#737c7b" />
                                        <div className="user-name-type">
                                            <span>Hugo Mendonça Pereira</span>
                                            <small>Pessoa Jurídica <CaretDown size={20} color="#636363" /></small>
                                        </div>
                                    </div>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                                        <DropdownMenu.Item className="DropdownMenuItem" onClick={goProfile}>
                                            Perfil <UserSquare size={20} color="#636363" />
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item className="DropdownMenuItem" onClick={handleLogout}>
                                            Logout <SignOut size={20} color="#636363" />
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                        </>
                        :
                        <>
                            {location.pathname == "/register" && <Link to="/">Voltar para Home</Link>}
                            {location.pathname != "/register" &&
                                <>
                                    <Dialog.Root open={showModal} onOpenChange={() => setShowModal(!showModal)}>
                                        <Dialog.Trigger
                                            type="button"
                                            className="dialog-button"
                                            onClick={() => setError("")}
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
                                    <Link to="/register">Cadastre-se</Link>
                                </>}
                        </>
                }
            </div>
        </div>
    )
}

export default Navbar