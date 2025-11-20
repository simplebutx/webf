import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/SignUp';
import Navbar from './components/Navbar';

function App() {
  const [message, setMessage] = useState('서버에서 아직 데이터 안 옴');

  useEffect(() => {
    const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5000'                      // 개발 중일 때
  : 'https://fullweb-d9dt.onrender.com/';         // Render 배포 주소

fetch(`${API_BASE_URL}/api/hello`);



    fetch('http://localhost:5000/api/hello')
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
