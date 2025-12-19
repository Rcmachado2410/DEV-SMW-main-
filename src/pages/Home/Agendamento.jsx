import { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { FaCheckSquare, FaRegTrashAlt } from "react-icons/fa";
import { useWms } from "../../components/contexts/WmsContext";

export default function Agendamento() {
  const { agendamentos, setAgendamentos, usuario, carros = [] } = useWms();

  const [tipoAgenda, setTipoAgenda] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroData, setFiltroData] = useState("");
  const [filtroNF, setFiltroNF] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  const [novo, setNovo] = useState({
    data: "",
    hora: "",
    cliente: "",
    nf: "",
    carroId: null
  });

  const formatarData = (data) => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  
  const agendamentosFiltrados = agendamentos.filter((item) => {
    if (tipoAgenda === "in") {
      const dataOk = filtroData ? item.data?.startsWith(filtroData) : true;
      const nfOk = filtroNF ? item.nf.includes(filtroNF) : true;
      return item.tipo === "in" && dataOk && nfOk;
    }

    if (tipoAgenda === "out") {
      const nfOk = filtroNF ? item.nf.includes(filtroNF) : true;
      return item.tipo === "out" && nfOk;
    }

    return false;
  });


  const salvarAgendamento = () => {
    if (!novo.nf || (tipoAgenda === "in" && (!novo.data || !novo.hora || !novo.cliente))) return;

    const agendamentoData = {
      id: editandoId || Date.now(),
      ...novo,
      tipo: tipoAgenda,
      status: tipoAgenda === "in" ? "Pendente" : "Criado",
      criadoPor: usuario?.nome,
      criadoEm: new Date().toISOString()
    };

    if (editandoId) {
      setAgendamentos(prev =>
        prev.map(item => (item.id === editandoId ? agendamentoData : item))
      );
    } else {
      setAgendamentos([...agendamentos, agendamentoData]);
    }

    setNovo({ data: "", hora: "", cliente: "", nf: "", carroId: null });
    setEditandoId(null);
    setModalAberto(false);
  };

  // CONCLUIR AGENDAMENTO
  const concluir = (id) => {
    setAgendamentos(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: tipoAgenda === "in" ? "Recebido" : "Expedido",
              recebidoEm: new Date().toISOString(),
              recebidoPor: usuario?.nome
            }
          : item
      )
    );
  };

 
  const editarAgendamento = (item) => {
    setNovo(item);
    setEditandoId(item.id);
    setModalAberto(true);
  };

  
  const excluir = (id) => {
    setAgendamentos(prev => prev.filter(item => item.id !== id));
  };

  return (
    <section className="home" style={{ background: `linear-gradient(180deg, #454548 0%, rgba(144, 143, 206, 0.8) 100%)` }}>
      <div className="overlay"></div>
      <div className="home-content">
        <h1>Agendamento</h1>

        <div className="butagenda">
          <button className="butin" onClick={() => setTipoAgenda("in")}>Inbound</button>
          <button className="butou" onClick={() => setTipoAgenda("out")}>Outbound</button>
        </div>

        {tipoAgenda && (
          <div className="painel-agenda">
            <h3>{tipoAgenda === "in" ? "AGENDAMENTO DE DESCARGAS" : "AGENDAMENTO DE COLETAS"}</h3>

            <div className="filtros">
              {tipoAgenda === "in" && (
                <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
              )}
              <input type="text" placeholder="Pesquisar NF" value={filtroNF} onChange={(e) => setFiltroNF(e.target.value)} />
              <button className="butou" onClick={() => setModalAberto(true)}>+</button>
            </div>

            <table className="listaagen">
              <thead>
                <tr>
                  {tipoAgenda === "in" && <th>Data</th>}
                  {tipoAgenda === "in" && <th>Hora</th>}
                  {tipoAgenda === "in" && <th>Cliente</th>}
                  <th>NF</th>
                  <th>Status / Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentosFiltrados.map(item => (
                  <tr key={item.id}>
                    {tipoAgenda === "in" && <td>{formatarData(item.data)}</td>}
                    {tipoAgenda === "in" && <td>{item.hora}</td>}
                    {tipoAgenda === "in" && <td>{item.cliente}</td>}
                    <td>{item.nf}</td>
                    <td>
                      {item.status}
                      <span onClick={() => editarAgendamento(item)} style={{ marginLeft: 8, cursor: "pointer" }}><BsPencilSquare /></span>
                      <span onClick={() => concluir(item.id)} style={{ marginLeft: 8, cursor: "pointer", color: "green" }}><FaCheckSquare /></span>
                      <span onClick={() => excluir(item.id)} style={{ marginLeft: 8, cursor: "pointer", color: "red" }}><FaRegTrashAlt /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modalAberto && (
          <div className="modal-overlay" onClick={() => setModalAberto(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>{editandoId ? "Editar Agendamento" : "Novo Agendamento"}</h3>

              {tipoAgenda === "in" && (
                <>
                  <input type="date" value={novo.data} onChange={(e) => setNovo({ ...novo, data: e.target.value })} />
                  <input type="time" value={novo.hora} onChange={(e) => setNovo({ ...novo, hora: e.target.value })} />
                  <input placeholder="Cliente" value={novo.cliente} onChange={(e) => setNovo({ ...novo, cliente: e.target.value })} />
                </>
              )}

              {tipoAgenda === "out" && (
                <select value={novo.carroId || ""} onChange={(e) => setNovo({ ...novo, carroId: Number(e.target.value) })}>
                  <option value="">Selecionar Carro</option>
                  {carros.length > 0
                    ? carros.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)
                    : <option disabled>Nenhum carro disponível</option>
                  }
                </select>
              )}

              <input placeholder="NF" value={novo.nf} onChange={(e) => setNovo({ ...novo, nf: e.target.value })} />
              <button onClick={salvarAgendamento}>{editandoId ? "Salvar Alterações" : "Salvar"}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
