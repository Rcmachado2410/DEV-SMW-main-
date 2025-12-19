import { useState } from "react";
import { FaTimes, FaRegTrashAlt } from "react-icons/fa";
import { useWms } from "../../components/contexts/WmsContext";

export default function Outbound() {
  const { agendamentos, setAgendamentos, produtos, setProdutos, usuario } = useWms();

  const [tipoAgenda, setTipoAgenda] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

 
  const [novaNota, setNovaNota] = useState({
    nf: "",
    item: null,
    quantidade: ""
  });

  const [todasTarefas, setTodasTarefas] = useState([]); 

  
  const [tarefasFiltradas, setTarefasFiltradas] = useState([]);

  
  const [carros, setCarros] = useState([]);
  const [carroNotasSelecionadas, setCarroNotasSelecionadas] = useState([]);
  const [nomeCarro, setNomeCarro] = useState("");

  
  const adicionarTarefa = () => {
    if (!novaNota.nf || !novaNota.item || !novaNota.quantidade) return;

    const tarefa = {
      id: Date.now(),
      nf: novaNota.nf,
      item: novaNota.item,
      quantidade: Number(novaNota.quantidade),
      posicao: novaNota.item.posicao || "—",
      status: "Pendente",
      separado: 0,
      criadoPor: usuario?.nome,
      criadoEm: new Date().toISOString()
    };

    setTodasTarefas([...todasTarefas, tarefa]);
    setNovaNota({ nf: "", item: null, quantidade: "" });
  };

  // --- Funções Gerar Separação ---
  const separarItem = (tarefaId, qtdSeparada) => {
    setTodasTarefas(prev =>
      prev.map(t =>
        t.id === tarefaId
          ? {
              ...t,
              separado: Math.min(t.separado + Number(qtdSeparada), t.quantidade),
              status: t.separado + Number(qtdSeparada) >= t.quantidade ? "Concluído" : "Em Progresso"
            }
          : t
      )
    );
  };

  
  const criarCarro = () => {
    if (!nomeCarro || carroNotasSelecionadas.length === 0) return;

    const notas = todasTarefas.filter(t => carroNotasSelecionadas.includes(t.id) && t.status === "Concluído");
    if (notas.length === 0) return;

    const totalItens = notas.reduce((acc, t) => acc + t.quantidade, 0);

    const novoCarro = {
      id: Date.now(),
      nome: nomeCarro,
      notas: notas.map(n => ({ id: n.id, nf: n.nf, item: n.item.nome, quantidade: n.quantidade })),
      totalItens,
      criadoPor: usuario?.nome || "Desconhecido",
      criadoEm: new Date().toISOString(),
      expedido: false,
      expedidoEm: null,
      expedidoPor: null
    };

    setCarros([...carros, novoCarro]);
    setCarroNotasSelecionadas([]);
    setNomeCarro("");
  };

  const expedirCarro = (carroId) => {
    setCarros(prev =>
      prev.map(c =>
        c.id === carroId
          ? { ...c, expedido: true, expedidoEm: new Date().toISOString(), expedidoPor: usuario?.nome }
          : c
      )
    );

    
    const carro = carros.find(c => c.id === carroId);
    if (carro) {
      setTodasTarefas(prev =>
        prev.map(t =>
          carro.notas.some(n => n.id === t.id)
            ? { ...t, status: "Expedido" }
            : t
        )
      );
    }
  };

  return (
   <section className="home" style={{ background: `linear-gradient(180deg, #454548 0%, rgba(144, 143, 206, 0.8) 100%)` }}>
     <div className="overlay"></div>
      <div className="home-content">
        <h1>Outbound</h1>

        <div className="butagenda">
          <button className="butin" onClick={() => setTipoAgenda("co")}>Criar Onda</button>
          <button className="butou" onClick={() => setTipoAgenda("gs")}>Gerar Separação</button>
          <button className="butin" onClick={() => setTipoAgenda("at")}>Acompanhar Tarefas</button>
          <button className="butou" onClick={() => setTipoAgenda("eo")}>Expedir Order</button>
        </div>

        {/* --- Criar Onda --- */}
        {tipoAgenda === "co" && (
          <div className="painel-agenda">
            <h3>Criar Onda</h3>
            <input placeholder="Nota Fiscal" value={novaNota.nf} onChange={e => setNovaNota({ ...novaNota, nf: e.target.value })} />
            <select value={novaNota.item?.id || ""} onChange={e => setNovaNota({ ...novaNota, item: produtos.find(p => p.id == e.target.value) })}>
              <option value="">Selecionar Item</option>
              {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.posicao})</option>)}
            </select>
            <input type="number" placeholder="Quantidade" value={novaNota.quantidade} onChange={e => setNovaNota({ ...novaNota, quantidade: e.target.value })} />
            <button className="butin" onClick={adicionarTarefa}>Adicionar Tarefa</button>

            <h4>Tarefas Criadas</h4>
            <table className="listaagen">
              <thead>
                <tr><th>NF</th><th>Item</th><th>Qtd</th><th>Status</th></tr>
              </thead>
              <tbody>
                {todasTarefas.map(t => (
                  <tr key={t.id}>
                    <td>{t.nf}</td>
                    <td>{t.item.nome}</td>
                    <td>{t.quantidade}</td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        
        {tipoAgenda === "gs" && (
          <div className="painel-agenda">
            <h3>Gerar Separação</h3>
            <table className="listaagen">
              <thead>
                <tr><th>NF</th><th>Item</th><th>Qtd</th><th>Separado</th><th>Status</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {todasTarefas.filter(t => t.status !== "Expedido").map(t => (
                  <tr key={t.id}>
                    <td>{t.nf}</td>
                    <td>{t.item.nome}</td>
                    <td>{t.quantidade}</td>
                    <td>{t.separado}</td>
                    <td>{t.status}</td>
                    <td>
                      {t.status !== "Concluído" && (
                        <button onClick={() => separarItem(t.id, t.quantidade - t.separado)}>Separar Tudo</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        
        {tipoAgenda === "at" && (
          <div className="painel-agenda">
            <h3>Acompanhar Tarefas</h3>
            <table className="listaagen">
              <thead>
                <tr><th>NF</th><th>Item</th><th>Qtd</th><th>Separado</th><th>Status</th><th>Progresso</th></tr>
              </thead>
              <tbody>
                {todasTarefas.map(t => (
                  <tr key={t.id}>
                    <td>{t.nf}</td>
                    <td>{t.item.nome}</td>
                    <td>{t.quantidade}</td>
                    <td>{t.separado}</td>
                    <td>{t.status}</td>
                    <td>{Math.round((t.separado / t.quantidade) * 100) || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        
        {tipoAgenda === "eo" && (
          <div className="painel-agenda">
            <h3>Expedir Order - Criar Carro</h3>
            <input placeholder="Nome do Carro" value={nomeCarro} onChange={e => setNomeCarro(e.target.value)} />

            <h4>Selecionar Notas Concluídas</h4>
            <table className="listaagen">
              <thead><tr><th>Selecionar</th><th>NF</th><th>Item</th><th>Qtd</th></tr></thead>
              <tbody>
                {todasTarefas.filter(t => t.status === "Concluído").map(t => (
                  <tr key={t.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={carroNotasSelecionadas.includes(t.id)}
                        onChange={e => {
                          if (e.target.checked) setCarroNotasSelecionadas([...carroNotasSelecionadas, t.id]);
                          else setCarroNotasSelecionadas(carroNotasSelecionadas.filter(id => id !== t.id));
                        }}
                      />
                    </td>
                    <td>{t.nf}</td>
                    <td>{t.item.nome}</td>
                    <td>{t.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={criarCarro}>Criar Carro</button>

            <h4>Carros Criados</h4>
            <table className="listaagen">
              <thead><tr><th>Nome</th><th>Notas</th><th>Total Itens</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {carros.map(c => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>
                    <td>{c.notas.map(n => n.nf).join(", ")}</td>
                    <td>{c.totalItens}</td>
                    <td>{c.expedido ? "Expedido" : "Criado"}</td>
                    <td>
                      {!c.expedido && <button onClick={() => expedirCarro(c.id)}>Expedir</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
}
