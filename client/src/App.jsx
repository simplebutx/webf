import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Navbar from './components/Navbar.jsx';
import { apiFetch } from './api.jsx';
import MyPage from './pages/MyPage.jsx';


function App() {
  const [message, setMessage] = useState('서버에서 아직 데이터 안 옴');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
   const location = useLocation();

  useEffect(() => {
    apiFetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.msg);
      })
      .catch((err) => {
        console.error(err);
        setMessage('에러 발생 😢');
      });
  }, []);

useEffect(() => {
  // 로그인 체크 필요 없는 페이지
  if (location.pathname === "/Login" || location.pathname === "/SignUp") return;

  const checkLogin = async () => {
    try {
      const res = await apiFetch('/me', { method: 'GET' });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  };

  checkLogin();
}, [location.pathname]);   // ← 중요!


  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      await apiFetch('/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);      // 프론트 상태 비우기
      navigate('/');      // 메인으로 이동
    }
  };

  return (
    <>
       <Navbar user={user} onLogout={handleLogout} />

      <Routes>
      <Route path="/" element={<Home message = {message}/>} />
      <Route path="/Login" element={<Login setUser={setUser} />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/me" element={<MyPage />} />
      </Routes>
    </>
  );
}

export default App;
