import bgHome from "../../assets/pexels-tiger-lily-4483610.jpg";

export default function Mobile() {
  return (
    <section
      className="home"
     style={{ background: `linear-gradient( 180deg, #454548 0%, rgba(144, 143, 206, 0.8) 100%)` }}
    >
        <div className="overlay"></div>
      <div className="home-content">
        <h1>Mobile</h1>
        <p>Em desenvolvimento</p>
      </div>
    </section>
  );
}
