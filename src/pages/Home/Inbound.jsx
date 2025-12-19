import { useState } from "react";
import { FaTimes, FaRegTrashAlt } from "react-icons/fa";
import { useWms } from "../../components/contexts/WmsContext";

export default function Inbound() {
  const { agendamentos, setAgendamentos, produtos, setProdutos, asnList, setAsnList, usuario } = useWms();

  const [tipoAgenda, setTipoAgenda] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [notaSelecionada, setNotaSelecionada] = useState(null);
  const [quantidadesProdutos, setQuantidadesProdutos] = useState({});
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [qtdSelecionada, setQtdSelecionada] = useState("");
  const [novoProduto, setNovoProduto] = useState({ nome: "", descricao: "", codBarra: "", marca: "" });

  const [filtroNota, setFiltroNota] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const [receberModalAberto, setReceberModalAberto] = useState(false);
  const [asnReceber, setAsnReceber] = useState(null);
  const [receberProduto, setReceberProduto] = useState(null);
  const [quantidadeRecebida, setQuantidadeRecebida] = useState(0);
  const [lpnAtual, setLpnAtual] = useState("");

  const formatarData = (data) => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

 
  const salvarProduto = () => {
    if (!novoProduto.nome || !novoProduto.codBarra) return;
    setProdutos([...produtos, { id: Date.now(), ...novoProduto }]);
    setNovoProduto({ nome: "", descricao: "", codBarra: "", marca: "" });
  };

  
  const abrirAssignModal = (nota) => {
    setNotaSelecionada(nota);
    const inicial = {};
    produtos.forEach(p => inicial[p.id] = 0);
    setQuantidadesProdutos(inicial);
    setProdutoSelecionado(null);
    setQtdSelecionada("");
    setModalAberto(true);
  };

  const adicionarProdutoAssign = () => {
    if (!produtoSelecionado || !qtdSelecionada) return;
    setQuantidadesProdutos(prev => ({
      ...prev,
      [produtoSelecionado.id]: (prev[produtoSelecionado.id] || 0) + Number(qtdSelecionada)
    }));
    setProdutoSelecionado(null);
    setQtdSelecionada("");
  };

  const salvarAssignacao = () => {
    if (!notaSelecionada) return;

    const totalItens = Object.values(quantidadesProdutos).reduce((acc, val) => acc + Number(val), 0);

    
    setAgendamentos(prev => prev.map(a =>
      a.id === notaSelecionada.id
        ? { ...a, totalItensRecebidos: totalItens, status: "Assignado", produtosRecebidos: { ...quantidadesProdutos } }
        : a
    ));

   
    const asn = {
      id: Date.now(),
      notaId: notaSelecionada.id,
      dataAssignacao: new Date().toISOString(),
      totalItens,
      produtos: produtos
        .filter(p => quantidadesProdutos[p.id] > 0)
        .map(p => ({ ...p, quantidade: quantidadesProdutos[p.id] })),
      status: "Pendente",
      criador: usuario?.nome || "Desconhecido",
      lpn: "",
      produtosRecebidos: {}
    };
    setAsnList([...asnList, asn]);

    setModalAberto(false);
    setNotaSelecionada(null);
    setQuantidadesProdutos({});
  };

  
  const abrirReceberModal = (asn) => {
    setAsnReceber(asn);
    setReceberProduto(null);
    setQuantidadeRecebida(0);
    setLpnAtual(""); 
    setReceberModalAberto(true);
  };

  const receberItemASN = () => {
    if (!receberProduto || quantidadeRecebida <= 0) return;

    const quantidadeEsperada = receberProduto.quantidade;
    const jaRecebido = asnReceber.produtosRecebidos?.[receberProduto.id] || 0;
    const totalRecebido = jaRecebido + Number(quantidadeRecebida);

    if (totalRecebido > quantidadeEsperada) {
      alert("Não é permitido receber mais do que o esperado!");
      return;
    }

    setAsnList(prev => prev.map(a =>
      a.id === asnReceber.id
        ? {
            ...a,
            lpn: lpnAtual || a.lpn,
            produtosRecebidos: { ...a.produtosRecebidos, [receberProduto.id]: totalRecebido }
          }
        : a
    ));

    setQuantidadeRecebida(0);
    setReceberProduto(null);
  };

  const calcularProgressoASN = (asn) => {
    const totalEsperado = asn.produtos.reduce((acc, p) => acc + p.quantidade, 0);
    const totalRecebido = Object.values(asn.produtosRecebidos || {}).reduce((acc, v) => acc + v, 0);
    return { totalRecebido, totalEsperado, porcentagem: Math.floor((totalRecebido / totalEsperado) * 100) };
  };

  const verifyASN = (asnId) => {
    const asn = asnList.find(a => a.id === asnId);
    if (!asn) return;
    const todosRecebidos = asn.produtos.every(p => (asn.produtosRecebidos?.[p.id] || 0) >= p.quantidade);
    if (!todosRecebidos) {
      alert("Ainda existem produtos pendentes. Não é possível verificar!");
      return;
    }
    setAsnList(prev => prev.map(a => a.id === asnId ? { ...a, status: "Recebido" } : a));
    setAgendamentos(prev => prev.map(a => a.id === asn.notaId ? { ...a, status: "Fechado" } : a));
  };

  const excluirShipment = (id) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id));
  };

  
  const agendamentosFiltrados = agendamentos.filter(a => {
    const notaOk = filtroNota ? a.nf.includes(filtroNota) : true;
    const statusOk = filtroStatus ? a.status.includes(filtroStatus) : true;
    const dataOk = filtroData ? a.data === filtroData : true;
    return notaOk && statusOk && dataOk;
  });

  return (
    <section className="home" style={{ background: `linear-gradient(180deg, #454548 0%, rgba(144, 143, 206, 0.8) 100%)` }}>
      <div className="overlay"></div>
      <div className="home-content">
        <h1>Inbound</h1>
        <div className="butagenda" >
          <button className="butin" onClick={() => setTipoAgenda("is")}>Inbound Shipment</button>
          <button className="butin" onClick={() => setTipoAgenda("cp")}>Cadastrar Produto</button>
          <button className="butin" onClick={() => setTipoAgenda("io")}>Inbound Order (ASN)</button>
        </div>

        
        {tipoAgenda === "cp" && (
          <div className="painel-agenda" >
            <input style={{display:"flex",justifyContent:"space-between"}} placeholder="Nome" value={novoProduto.nome} onChange={e => setNovoProduto({ ...novoProduto, nome: e.target.value })} />
            <input placeholder="Descrição" value={novoProduto.descricao} onChange={e => setNovoProduto({ ...novoProduto, descricao: e.target.value })} />
            <input placeholder="Código de Barra" value={novoProduto.codBarra} onChange={e => setNovoProduto({ ...novoProduto, codBarra: e.target.value })} />
            <input placeholder="Marca" value={novoProduto.marca} onChange={e => setNovoProduto({ ...novoProduto, marca: e.target.value })} />
            <button className="butin" onClick={salvarProduto}>Adicionar</button>

            <h4>Produtos cadastrados</h4>
            <table className="listaagen">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Código de Barra</th>
                  <th>Marca</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.descricao}</td>
                    <td>{p.codBarra}</td>
                    <td>{p.marca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        
        {tipoAgenda === "is" && (
          <div className="painel-agenda">
            <h3>Inbound Shipment</h3>
            <input placeholder="Filtrar por Nota" value={filtroNota} onChange={e => setFiltroNota(e.target.value)} />
            <input placeholder="Filtrar por Status" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} />
            <input type="date" value={filtroData} onChange={e => setFiltroData(e.target.value)} />
            <table className="listaagen">
              <thead>
                <tr>
                  <th>LPN/SN</th>
                  <th>Nota</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Total Itens</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentosFiltrados.map(a => (
                  <tr key={a.id}>
                    <td>{a.sn || a.lpn}</td>
                    <td>{a.nf}</td>
                    <td>{a.cliente}</td>
                    <td>{a.status}</td>
                    <td>{a.totalItensRecebidos || 0}</td>
                    <td>
                      {a.status !== "Fechado" && <button className="butin" onClick={() => abrirAssignModal(a)}>Assignar</button>}
                      <button className="butou" onClick={() => excluirShipment(a.id)}><FaRegTrashAlt /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

       
        {tipoAgenda === "io" && (
          <div className="painel-agenda">
            <h3>Inbound Orders (ASN)</h3>
            <table className="listaagen">
              <thead>
                <tr>
                  <th>LPN/SN</th>
                  <th>Nota</th>
                  <th>Data Assignação</th>
                  <th>Status</th>
                  <th>Total Itens</th>
                  <th>Produtos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {asnList.map(asn => {
                  const nota = agendamentos.find(a => a.id === asn.notaId);
                  const progresso = calcularProgressoASN(asn);
                  return (
                    <tr key={asn.id}>
                      <td>{asn.lpn || asn.sn}</td>
                      <td>{nota?.nf}</td>
                      <td>{formatarData(asn.dataAssignacao.split("T")[0])}</td>
                      <td>{asn.status}</td>
                      <td>{asn.totalItens}</td>
                      <td>
                        <details>
                          <summary>Ver Produtos</summary>
                          <ul>
                            {asn.produtos.map(p => (
                              <li key={p.id}>{p.nome} - {p.quantidade} [{asn.produtosRecebidos?.[p.id] || 0} recebidos]</li>
                            ))}
                          </ul>
                        </details>
                        <div style={{ width: "100%", background: "#ccc", height: "15px", marginTop: "5px" }}>
                          <div style={{ width: `${progresso.porcentagem}%`, background: "#4caf50", height: "100%" }}>
                            {progresso.totalRecebido}/{progresso.totalEsperado}
                          </div>
                        </div>
                      </td>
                      <td>
                        {asn.status !== "Recebido" && <button className="butin" onClick={() => abrirReceberModal(asn)}>Receber</button>}
                        {asn.status !== "Recebido" && <button className="butin" onClick={() => verifyASN(asn.id)}>Verify</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        
        {modalAberto && (
          <div className="modal-overlay" onClick={() => setModalAberto(false)}>
            <div className="modal" style={{ width: "450px", gap:"10PX",padding: "20px" ,height:"200 PX"}} onClick={e => e.stopPropagation()}>
              <button className="butin" style={{display:"flex",width:"30px",padding:"10px",gap:"10px",paddingTop:"20px"}} onClick={() => setModalAberto(false)}><FaTimes /></button>
              <h3>Assignar Produtos - Nota {notaSelecionada?.nf}</h3>
              <select value={produtoSelecionado?.id || ""}  style={{width:"200px",padding:"5px",gap:"10px",paddingTop:"10px"}} onChange={e => setProdutoSelecionado(produtos.find(p => p.id == e.target.value))}>
                <option value="">Selecionar Produto</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <input type="number" min={1} placeholder="Quantidade" value={qtdSelecionada} style={{width:"120px",padding:"10px",gap:"10px" ,margin: "20px"}}  onChange={e => setQtdSelecionada(e.target.value)} />
              <button className="butin" style={{width:"50px",padding:"10px",gap:"10px"}}  onClick={adicionarProdutoAssign}>Apply</button>
              <ul>
                {Object.entries(quantidadesProdutos).map(([id, q]) => {
                  const p = produtos.find(prod => prod.id == id);
                  if (!p || q === 0) return null;
                  return <li key={id}>{p.nome} - {q}</li>;
                })}
              </ul>
              <button className="butin" style={{width:"120px",padding:"10px",gap:"10px"}}  onClick={salvarAssignacao}>Salvar Assignação</button>
            </div>
          </div>
        )}

        
        {receberModalAberto && (
          <div className="modal-overlay" onClick={() => setReceberModalAberto(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <button className="butin" onClick={() => setReceberModalAberto(false)}><FaTimes /></button>
              <h3>Receber ASN - LPN</h3>
              <input placeholder="LPN" value={lpnAtual} onChange={e => setLpnAtual(e.target.value)} />
              <select value={receberProduto?.id || ""} onChange={e => setReceberProduto(asnReceber.produtos.find(p => p.id == e.target.value))}>
                <option value="">Selecionar Produto</option>
                {asnReceber.produtos.map(p => (
                  <option key={p.id} value={p.id}>{p.nome} - {p.quantidade}</option>
                ))}
              </select>
              <input type="number" placeholder="Quantidade a receber" value={quantidadeRecebida} onChange={e => setQuantidadeRecebida(e.target.value)} />
              <button className="butin" onClick={receberItemASN}>Receber</button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
