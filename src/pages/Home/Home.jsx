import bgHome from "../../assets/pexels-tiger-lily-4483610.jpg";


export default function Home() {
  return (
    <section
      className="home"
      style={{ backgroundImage: `url(${bgHome})` }}
    >
        <div className="overlay"></div>
      <div className="home-content">
        <h1>Bem-vindo</h1>
        <p>AO SMW COMPANY O MELHOR SISTEMA DE WAREHOUSE DO BRASIL</p>
      </div>
    </section>
  );
}
