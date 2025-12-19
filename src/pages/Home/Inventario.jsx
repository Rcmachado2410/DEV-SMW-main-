import { useState } from "react";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { useWms } from "../../components/contexts/WmsContext";

export default function Inventario() {
  const { usuario, produtos, setProdutos } = useWms();

  const [tipoAgenda, setTipoAgenda] = useState(null);
  const [editarProduto, setEditarProduto] = useState(null);

  const [novoProduto, setNovoProduto] = useState({
    posição: "",
    codigo: "",
    limite: "",
  });

  const [consulta, setConsulta] = useState({
    tipo: "",
    valor: "",
  });

  const [tarefaContagem, setTarefaContagem] = useState([]);

  /* =========================
     CADASTRO POSIÇÃO / ITEM
  ========================== */
  const salvarProduto = () => {
    if (!novoProduto.posição || !novoProduto.codigo || !novoProduto.limite) return;

    if (editarProduto) {
      setProdutos(prev =>
        prev.map(p =>
          p.id === editarProduto.id
            ? { ...p, ...novoProduto }
            : p
        )
      );
      setEditarProduto(null);
    } else {
      setProdutos(prev => [
        ...prev,
        {
          id: Date.now(),
          ...novoProduto,
          lpnList: [] 
        }
      ]);
    }

    setNovoProduto({ posição: "", codigo: "", limite: "" });
  };

  const editarLinha = (p) => {
    setEditarProduto(p);
    setNovoProduto({
      posição: p.posição,
      codigo: p.codigo,
      limite: p.limite
    });
  };

  const excluirLinha = (id) => {
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  
  const resultadoConsulta = () => {
    if (!consulta.tipo || !consulta.valor) return [];
    const valor = consulta.valor.toLowerCase();

    if (consulta.tipo === "LPN") {
      return produtos.filter(p =>
        (p.lpnList || []).some(l => l.lpn.toLowerCase().includes(valor))
      );
    }

    if (consulta.tipo === "Posição") {
      return produtos.filter(p => p.posição.toLowerCase().includes(valor));
    }

    if (consulta.tipo === "Item") {
      return produtos.filter(p => p.codigo.toLowerCase().includes(valor));
    }

    return [];
  };

  const gerarContagem = (produto) => {
    const quantidadeAtual = (produto.lpnList || []).reduce(
      (acc, l) => acc + Number(l.quantidade || 0),
      0
    );

    setTarefaContagem(prev => [
      ...prev,
      {
        id: Date.now(),
        posição: produto.posição,
        item: produto.codigo,
        quantidade: quantidadeAtual,
        status: "Pendente"
      }
    ]);
  };

  const confirmarContagem = (tarefa) => {
    const qtd = prompt(`Informe a quantidade contada para ${tarefa.item}`);

    if (Number(qtd) !== tarefa.quantidade) {
      alert("Quantidade divergente! Recontagem necessária.");
      return;
    }

    setTarefaContagem(prev =>
      prev.map(t =>
        t.id === tarefa.id ? { ...t, status: "Concluída" } : t
      )
    );
  };

  return (
    <section className="home" style={{ background: `linear-gradient(180deg, #454548 0%, rgba(144, 143, 206, 0.8) 100%)` }}>
         <div className="overlay"></div>
         <div className="home-content">
        <h1>Inventário</h1>

        <div className="butagenda">
          <button className="butin" onClick={() => setTipoAgenda("cp")}>Cadastro Posição</button>
          <button className="butin" onClick={() => setTipoAgenda("c")}>Consulta</button>
          <button className="butin" onClick={() => setTipoAgenda("gc")}>Gerar Contagem</button>
        </div>

       
        {tipoAgenda === "cp" && (
          <div className="painel-agenda">
            <input placeholder="Posição" value={novoProduto.posição}  className="painel-agenda"
              onChange={e => setNovoProduto({ ...novoProduto, posição: e.target.value })} />
            <input placeholder="Código" value={novoProduto.codigo}
              onChange={e => setNovoProduto({ ...novoProduto, codigo: e.target.value })} />
            <input placeholder="Limite" type="number" value={novoProduto.limite}
              onChange={e => setNovoProduto({ ...novoProduto, limite: e.target.value })} />

            <button className="butin" onClick={salvarProduto}>
              {editarProduto ? "Atualizar" : "Adicionar"}
            </button>

            <table className="listaagen">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Código</th>
                  <th>Limite</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => (
                  <tr key={p.id}>
                    <td>{p.posição}</td>
                    <td>{p.codigo}</td>
                    <td>{p.limite}</td>
                    <td>
                      <button className="butin" onClick={() => editarLinha(p)}><FaEdit /></button>
                      <button className="butou" onClick={() => excluirLinha(p.id)}><FaRegTrashAlt /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        
        {tipoAgenda === "c" && (
          <div className="painel-agenda">
            <select value={consulta.tipo} onChange={e => setConsulta({ ...consulta, tipo: e.target.value })}>
              <option value="">Tipo</option>
              <option value="LPN">LPN</option>
              <option value="Posição">Posição</option>
              <option value="Item">Item</option>
            </select>

            <input placeholder="Pesquisar"
              value={consulta.valor}
              onChange={e => setConsulta({ ...consulta, valor: e.target.value })} />

            <table className="listaagen">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Código</th>
                  <th>LPN</th>
                  <th>Qtd</th>
                  <th>Usuário</th>
                </tr>
              </thead>
              <tbody>
                {resultadoConsulta().map(p =>
                  (p.lpnList || []).map(l => (
                    <tr key={`${p.id}-${l.lpn}`}>
                      <td>{p.posição}</td>
                      <td>{p.codigo}</td>
                      <td>{l.lpn}</td>
                      <td>{l.quantidade}</td>
                      <td>{l.usuario}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= CONTAGEM ================= */}
        {tipoAgenda === "gc" && (
          <div className="painel-agenda">
            <table className="listaagen">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Item</th>
                  <th>Quantidade</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => (
                  <tr key={p.id}>
                    <td>{p.posição}</td>
                    <td>{p.codigo}</td>
                    <td>
                      {(p.lpnList || []).reduce(
                        (acc, l) => acc + Number(l.quantidade || 0),
                        0
                      )}
                    </td>
                    <td>
                      <button className="butin" onClick={() => gerarContagem(p)}>
                        Gerar Contagem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {tarefaContagem.length > 0 && (
              <>
                <h4>Contagens Pendentes</h4>
                <table className="listaagen">
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Item</th>
                      <th>Qtd</th>
                      <th>Status</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tarefaContagem.map(t => (
                      <tr key={t.id}>
                        <td>{t.posição}</td>
                        <td>{t.item}</td>
                        <td>{t.quantidade}</td>
                        <td>{t.status}</td>
                        <td>
                          {t.status === "Pendente" && (
                            <button className="butin" onClick={() => confirmarContagem(t)}>
                              Confirmar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
