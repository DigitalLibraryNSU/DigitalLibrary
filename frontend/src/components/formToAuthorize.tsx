import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/authForm.css";
import AuthStore from "../Store/AuthStore.ts";

const FormToAuthorize = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        nonField: ""
    });

    const navigate = useNavigate();

    async function handleAuthorize(e: React.FormEvent) {
        e.preventDefault();
        setErrors({ email: "", password: "", nonField: "" });

        try {
            const auth = new AuthStore(password, email);
            const authSuccess = await auth.authenticate();

            if (authSuccess) {
                navigate("/");
            } else {
                setErrors({
                    email: auth.emailError || "",
                    password: auth.passwordError || "",
                    nonField: auth.nonFieldError || ""
                });
            }
        } catch (e: any) {
            setErrors({
                ...errors,
                nonField: e.message || "Произошла неизвестная ошибка"
            });
            console.error("Authorization error:", e);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-card__ornament-top"></div>

                <form onSubmit={handleAuthorize} className="auth-form">
                    <h2 className="auth-form__title">Добро пожаловать</h2>

                    <div className="auth-form__group">
                        <input
                            className={`auth-form__input ${errors.email ? 'error' : ''}`}
                            placeholder="Ваша почта"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="auth-form__error">{errors.email}</span>}
                    </div>

                    <div className="auth-form__group">
                        <input
                            className={`auth-form__input ${errors.password ? 'error' : ''}`}
                            placeholder="Пароль"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className="auth-form__error">{errors.password}</span>}
                    </div>

                    {errors.nonField && (
                        <div className="auth-form__error-message">
                            {errors.nonField}
                        </div>
                    )}

                    <button className="auth-form__submit" type="submit">
                        Войти
                    </button>
                </form>

                <div className="auth-card__ornament-bottom"></div>
            </div>
        </div>
    );
};

export default FormToAuthorize;
