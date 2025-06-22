import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/formToFindBook.css"
import AuthStore from "../Store/AuthStore.ts";

const FormToAuthorize = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [emailError, setEmailErr] = useState("");
    const [passwordError, setPasswordErr] = useState("");
    const [nonFieldError, setNonFieldErr] = useState("");
    const navigate = useNavigate();

    async function handleAuthorize(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        setEmailErr("");
        setPasswordErr("");
        setNonFieldErr("");

        try {
            const auth = new AuthStore(password, email);
            const authSuccess = await auth.authenticate();

            if (authSuccess) {
                navigate("/");
            } else {
                setEmailErr(auth.emailError);
                setPasswordErr(auth.passwordError);
                setNonFieldErr(auth.nonFieldError || "Ошибка авторизации");
            }
        } catch (e: any) {
            setErr(e.message || "Произошла неизвестная ошибка");
            console.error("Authorization error:", e);
        }
    }

    return (
        <div className="find-card">
            <div className="find-card__start">
                <form onSubmit={handleAuthorize}>
                    <h3 className="find-card__header">Вход</h3>
                    <div className="find-card__buttons">
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
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormToAuthorize;
