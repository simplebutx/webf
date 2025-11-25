import { Link } from 'react-router-dom';
import "../components/Button.css"

function Home({message}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
      <h1>HOME PAGE</h1>
        <h3>서버 연결 상태: {message}</h3>
    </div>
  );
}

export default Home;
