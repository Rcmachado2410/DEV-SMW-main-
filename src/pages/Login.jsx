import bgHome from "../assets/pexels-tiger-lily-4483610.jpg";

import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";

export default function Login() {
    const navigate = useNavigate();

  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


  
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação básica
        if (!email || !password) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        
        console.log("Email:", email);
        console.log("Password:", password);

      
        setEmail("");
        setPassword("");
        setError(""); 
        
        if (email && password) {
            
            navigate("/home");
        }
    };

    return (
        <section
            className="login-page"
                   >
            <div className="login-overlay"></div>

            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div className="form-group">
                        <label htmlFor="email">Usuario:</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button type="submit">Entrar</button>

                    <p className="register-link">
                        Não tem conta? <Link to="/cadastro">Criar conta</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}
