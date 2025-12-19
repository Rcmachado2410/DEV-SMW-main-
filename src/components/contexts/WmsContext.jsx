import { createContext, useContext, useState, useEffect } from "react";

const WmsContext = createContext();

export function WmsProvider({ children }) {
  const carregarLocalStorage = (chave, valorInicial) => {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : valorInicial;
  };

  const [usuario, setUsuario] = useState({ nome: "R" });
  const [usuarios, setUsuarios] = useState(() =>
    carregarLocalStorage("usuarios", [])
  );
  const [agendamentos, setAgendamentos] = useState(() =>
    carregarLocalStorage("agendamentos", [])
  );
  const [produtos, setProdutos] = useState(() =>
    carregarLocalStorage("produtos", [])
  );
  const [asnList, setAsnList] = useState(() =>
    carregarLocalStorage("asnList", [])
  );

  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  }, [agendamentos]);

  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem("asnList", JSON.stringify(asnList));
  }, [asnList]);

  // Função para adicionar usuário direto no localStorage/contexto
  const adicionarUsuario = ({ name, user, password }) => {
    const novoUsuario = { id: Date.now(), name, user, password };
    setUsuarios(prev => [...prev, novoUsuario]);
  };

  return (
    <WmsContext.Provider
      value={{
        usuario,
        setUsuario,
        usuarios,
        setUsuarios,
        adicionarUsuario,
        agendamentos,
        setAgendamentos,
        produtos,
        setProdutos,
        asnList,
        setAsnList,
      }}
    >
      {children}
    </WmsContext.Provider>
  );
}

export const useWms = () => useContext(WmsContext);
