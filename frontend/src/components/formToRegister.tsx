import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/formToFindBook.css"
import AuthStore from "../Store/AuthStore.ts";


const FormToRegister = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();
    const [usernameError, setUsernameErr] = useState("");
    const [emailError, setEmailErr] = useState("");
    const [passwordError, setPasswordErr] = useState("");
    const [nonFieldError, setNonFieldErr] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        setUsernameErr("");
        setEmailErr("");
        setPasswordErr("");
        setNonFieldErr("");

        try {
            const auth = new AuthStore(password, email, username);
            const registerSuccess = await auth.register();

            if (registerSuccess) {
                const authSuccess = await auth.authenticate();

                if (authSuccess) {
                    navigate("/");
                } else {
                    setNonFieldErr(auth.nonFieldError || "Ошибка авторизации после регистрации");
                }
            } else {
                setUsernameErr(auth.usernameError);
                setEmailErr(auth.emailError);
                setPasswordErr(auth.passwordError);
                setNonFieldErr(auth.nonFieldError);
            }
        } catch (e: any) {
            setErr(e.message || "Произошла неизвестная ошибка");
            console.error("Registration error:", e);
        }
    }

    return (
        <div className="find-card">
            <div className="find-card__start">
                <form onSubmit={handleRegister}>
                    <h3 className="find-card__header">Регистрация</h3>
                    <div className="find-card__buttons">
                        <input
                            className={`find-card__button ${usernameError ? 'error' : ''}`}
                            placeholder="Имя пользователя"
                            type="text"
                            required={true}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {usernameError && <p className="error-message">{usernameError}</p>}

                        <input
                            className={`find-card__button ${emailError ? 'error' : ''}`}
                            placeholder="Почта"
                            type="email"
                            required={true}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="error-message">{emailError}</p>}

                        <input
                            className={`find-card__button ${passwordError ? 'error' : ''}`}
                            required={true}
                            placeholder="Пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="error-message">{passwordError}</p>}
                    </div>

                    {nonFieldError && <p className="error-message">{nonFieldError}</p>}
                    {err && <p className="error-message">{err}</p>}

                    <button className="find-card__find-button" type="submit">
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormToRegister;
