import { Link } from "react-router-dom";
import "./Nav.css";

export default function Nav() {
  return (
    <nav>
      <div className="link">
        <Link to="/">Identidad</Link>
      </div>
      <div className="link">
        <Link to="/sign">Firma</Link>
      </div>
      <div className="link">
        <Link to="/verify">Verificación</Link>
      </div>
    </nav>
  );
}
