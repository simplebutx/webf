import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">MyProject</Link>
      </div>

      <div className="nav-right">
        <Link to="/login">
          <button className="nav-btn">로그인</button>
        </Link>
        <Link to="/signup">
          <button className="nav-btn">회원가입</button>
        </Link>
        <Link to="/me">
          <button className="nav-btn">마이페이지</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

