import "../styles/header.css"
import {useState} from "react";
import HeaderButton from "./headerButton.tsx";
import { TiThMenu } from "react-icons/ti";
import {useNavigate} from "react-router-dom";

export const Header = () => {
    const [isOpen, setOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <header className="header">
            <span className="header_logo" onClick={() => navigate("/")}>Жили-Были Library</span>
            <nav className={`header_nav ${isOpen ? "active" : ""}`}>
                <ul className="header_nav-list">
                    <li className="header_nav-item" onClick={() => navigate("/collections")}>
                        <HeaderButton name="коллекции"/>
                    </li>
                    <li className="header_nav-item" onClick={() => navigate("/smart_search")}>
                        <HeaderButton name="поиск"/>
                    </li>
                </ul>
            </nav>
            <button className="header_menu-button" onClick={() => setOpen(!isOpen)}>
                <TiThMenu />
            </button>
        </header>
    )
}
