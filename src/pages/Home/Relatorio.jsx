import { useState, useEffect } from "react";
import { useWms } from "../../components/contexts/WmsContext";

export default function Relatorio() {
  const { relatorios = [] } = useWms();

  const [filtroModulo, setFiltroModulo] = useState("TODOS");
  const [filtroUsuario, setFiltroUsuario] = useState("");

 
  useEffect(() => {
    console.log(" RELATORIOS NO RELATORIO:", relatorios);
  }, [relatorios]);

  const formatarData = (data) => {
    const d = new Date(data);
    return d.toLocaleString("pt-BR");
  };

  const relatoriosFiltrados = relatorios
    .filter(r =>
      filtroModulo === "TODOS" ? true : r.modulo === filtroModulo
    )
    .filter(r =>
      filtroUsuario
        ? String(r.usuario)
            .toLowerCase()
            .includes(filtroUsuario.toLowerCase())
        : true
    )
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  return (
    <section
      className="home"
      style={{
        background: `linear-gradient(180deg, #454548 0%, rgba(144, 143, 206, 0.8) 100%)`
      }}
    >
      <div className="overlay"></div>

      <div className="home-content">
        <h1>Relatório Operacional</h1>

        
        <div
          className="painel-agenda"
          style={{ display: "flex", gap: "10px", alignItems: "center" }}
        >
          <select
            value={filtroModulo}
            onChange={e => setFiltroModulo(e.target.value)}
          >
            <option value="TODOS">Todos os Módulos</option>
            <option value="AGENDAMENTO">Agendamento</option>
            <option value="INBOUND">Inbound</option>
            <option value="OUTBOUND">Outbound</option>
            <option value="INVENTARIO">Inventário</option>
          </select>

          <input
            placeholder="Filtrar por usuário"
            value={filtroUsuario}
            onChange={e => setFiltroUsuario(e.target.value)}
          />

          <span style={{ color: "#fff" }}>
            Total de registros: {relatoriosFiltrados.length}
          </span>
        </div>

        
        <div className="painel-agenda">
          <table className="listaagen">
            <thead>
              <tr>
                <th>Data</th>
                <th>Módulo</th>
                <th>Ação</th>
                <th>Descrição</th>
                <th>Usuário</th>
              </tr>
            </thead>

            <tbody>
              {relatoriosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}

              {relatoriosFiltrados.map(r => (
                <tr key={r.id}>
                  <td>{formatarData(r.data)}</td>
                  <td>{r.modulo}</td>
                  <td>{r.acao}</td>
                  <td>{r.descricao}</td>
                  <td>{r.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
