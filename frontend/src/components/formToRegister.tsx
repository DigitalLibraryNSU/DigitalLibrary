import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/formToFindBook.css"
import AuthStore from "../Store/AuthStore.ts";
import {authStore} from "../Store/tokenStore.ts";


const FormToRegister = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        console.log("register");
        try {
            const response = new AuthStore(password, email, username);
            await response.register();
            await response.authenticate();
            console.log(authStore.token);
            if (response.status === 200 || response.status === 201) {
                navigate("/");
            } else {
                setErr("Упс, ошибка");
            }
        } catch (e: any) {
            setErr(e.message);
        }
    }


    return (
        <div className="find-card">
            <div className="find-card__start">
                <form onSubmit={handleRegister}>
                    <h3 className="find-card__header">Регистрация</h3>
                    <div className="find-card__buttons">
                        <input className="find-card__button" placeholder="Имя пользователя" type="text" required={true}
                               value={username}
                               onChange={(e) => setUsername(e.target.value)}/>
                        <input className="find-card__button" placeholder="Почта" type="email" required={true}
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                        <input className="find-card__button" required={true} placeholder="Пароль" type="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button className="find-card__find-button"
                            type="submit"

                    >
                       Зарегистрироваться
                    </button>
                    <p>{err}</p>
                </form>
            </div>
        </div>
    );
};

export default FormToRegister;
