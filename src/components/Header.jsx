import { Link, useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { ImExit } from "react-icons/im";



export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // redireciona para login
    navigate("/");
  };
  return (
    <header>
      <nav>
        <div className="menu">

          {/* HOME COM DROPDOWN */}
          <div className="dropdown">
            <Link to="../home" className="menu-item">
              <FiHome size={18} />
              <span>Home</span>
              
            </Link>
              
            <div className="dropdown-menu">
              <Link to="/agendamento">Agendamento</Link>
              <Link to="/inbound">Inbound</Link>
              <Link to="/inventario">Inventario</Link>
              <Link to="/outbound">Outbound</Link>
              <Link to="/relatorio">Relatorio</Link>
              <Link to="/mobile">Mobile</Link>
            </div>
          </div>

        </div>

        <div className="brand">SWM Company</div>

        <div>
          <button className="logout-btn" onClick={handleLogout}>
            <ImExit size={18} />
            Logout
          </button></div>

      </nav>
    </header>
  );

}
