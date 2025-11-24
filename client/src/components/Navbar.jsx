import { Link } from 'react-router-dom';
import './Navbar.css';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
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
                {/* ✅ 로그인 X : 로그인 / 회원가입만 */}
      <Link to="/" className="logo">MyProject</Link>
                {/* ✅ 로그인 O : (옵션) 유저명, 마이페이지, 로그아웃 */}
        
        
      </div>
      <div className="nav-right">
        {user && (
          <>
            <span className="nav-username">
              {user.username} 님
            </span>

            <Link to="/me">
              <button className="nav-btn">마이페이지</button>
            </Link>

            <button className="nav-btn" onClick={onLogout}>
              로그아웃
            </button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login">
              <button className="nav-btn">로그인</button>
            </Link>
            <Link to="/signup">
              <button className="nav-btn">회원가입</button>
            </Link>
          </>
        )}
      </div>
        
    </nav>
  );
}

export default Navbar;

