import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWms } from "../components/contexts/WmsContext";


export default function Cadastro() {
  const navigate = useNavigate();
  const { adicionarUsuario } = useWms();

  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
    
      adicionarUsuario({ name, user, password });

      alert("Conta criada com sucesso!");
      navigate("/");
    } catch (err) {
      setError("Erro ao cadastrar usuário");
    }
  };

  return (
    <section className="login-page">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Criar conta</h2>

          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit">Cadastrar</button>

          <p className="register-link">
            Já tem conta? <a href="/">Entrar</a>
          </p>
        </form>
      </div>
    </section>
  );
}
