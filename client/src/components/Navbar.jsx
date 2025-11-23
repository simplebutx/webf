import { Link } from 'react-router-dom';
import './Navbar.css';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

   const handleLogout = async () => {
    try {
      const res = await apiFetch('/logout', {
        method: 'POST',
      });

      const data = await res.json();
      console.log('로그아웃 결과:', data);

      // 홈으로 보내고, 상태 초기화를 위해 새로고침 한 번
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('로그아웃 에러:', err);
    }
  };

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
         <button onClick={handleLogout}>로그아웃</button>
      </div>
    </nav>
  );
}

export default Navbar;

