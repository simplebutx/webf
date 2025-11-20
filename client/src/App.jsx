import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  const [message, setMessage] = useState('서버에서 아직 데이터 안 옴');

  useEffect(() => {
    const API_BASE_URL = import.meta.env.DEV
      ? 'http://localhost:5000'                // 개발용
      : 'https://webf-tjb9.onrender.com';     // ✅ Render 서버 (이거 하나만 사용)

    fetch(`${API_BASE_URL}/api/hello`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.msg);
      })
      .catch((err) => {
        console.error(err);
        setMessage('에러 발생 😢');
      });
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>

      <div>
        <h2>{message}</h2>
      </div>
    </>
  );
}

export default App;
