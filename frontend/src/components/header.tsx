import "../styles/header.css";
import {useState} from "react";
import HeaderButton from "./headerButton.tsx";
import { TiThMenu } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { authStore } from "../Store/tokenStore.ts";

export const Header = () => {
    const [isOpen, setOpen] = useState(false);
    const [isProfileHovered, setProfileHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="header">
            <span onClick={() => navigate("/")}><span className="header_logo">Жили-Были</span><h1 className="small-text">library</h1></span>
            <nav className={`header_nav ${isOpen ? "active" : ""}`}>
                <ul className="header_nav-list">
                    <li className="header_nav-item" onClick={() => navigate("/collections")}>
                        <HeaderButton name="коллекции"/>
                    </li>
                    <li className="header_nav-item" onClick={() => navigate("/smart_search")}>
                        <HeaderButton name="поиск"/>
                    </li>
                    {authStore.isAuthenticated ? (
                        <li
                            className="header_nav-item profile-dropdown"
                            onMouseEnter={() => setProfileHovered(true)}
                            onMouseLeave={() => setProfileHovered(false)}
                        >
                            <HeaderButton name="Профиль" />
                            {isProfileHovered && (
                                <div className="profile-dropdown-menu">
                                    <button
                                        className="dropdown-item"
                                        onClick={() => navigate("/recommendations")}
                                    >
                                        Персональные рекомендации
                                    </button>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => navigate("/reviews")}
                                    >
                                        Мои отзывы
                                    </button>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            authStore.logout();
                                            navigate("/");
                                        }}
                                    >
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </li>
                    ) : (
                        <li className="header_nav-item" onClick={() => navigate("/authorization")}>
                            <HeaderButton name="Вход"/>
                        </li>
                    )}
                    {!authStore.isAuthenticated && (
                        <li className="header_nav-item" onClick={() => navigate("/registration")}>
                            <HeaderButton name="Регистрация"/>
                        </li>
                    )}
                </ul>
            </nav>
            <button className="header_menu-button" onClick={() => setOpen(!isOpen)}>
                <TiThMenu/>
            </button>
        </header>
    );
};
