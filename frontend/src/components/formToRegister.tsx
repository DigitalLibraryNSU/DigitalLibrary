import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/authForm.css";
import AuthStore from "../Store/AuthStore.ts";

const FormToRegister = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        nonField: ""
    });

    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setErrors({ username: "", email: "", password: "", nonField: "" });

        try {
            const auth = new AuthStore(password, email, username);
            const registerSuccess = await auth.register();

            if (registerSuccess) {
                const authSuccess = await auth.authenticate();
                if (authSuccess) {
                    navigate("/");
                } else {
                    setErrors({
                        ...errors,
                        nonField: "Ошибка авторизации после регистрации"
                    });
                }
            } else {
                setErrors({
                    username: auth.usernameError || "",
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
            console.error("Registration error:", e);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-card__ornament-top"></div>

                <form onSubmit={handleRegister} className="auth-form">
                    <h2 className="auth-form__title">Создайте аккаунт</h2>

                    <div className="auth-form__group">
                        <input
                            className={`auth-form__input ${errors.username ? 'error' : ''}`}
                            placeholder="Имя пользователя"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {errors.username && <span className="auth-form__error">{errors.username}</span>}
                    </div>

                    <div className="auth-form__group">
                        <input
                            className={`auth-form__input ${errors.email ? 'error' : ''}`}
                            placeholder="Электронная почта"
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
                        Зарегистрироваться
                    </button>
                </form>

                <div className="auth-card__ornament-bottom"></div>
            </div>
        </div>
    );
};

export default FormToRegister;
