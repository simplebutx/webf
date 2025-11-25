import { useState } from "react";
import { apiFetch } from "../api";

function CreatePost() {

const [title, setTitle] = useState('');
const [content, setContent] = useState('');
const [msg, setMsg] = useState('');


const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({title, content})
    })

    const data = await res.json();
    setMsg(data.msg);

    setTitle('');
    setContent('');
    setTimeout(() => setMsg(''), 2000);
}

    return(
        <div>
        <div>
            <form onSubmit={handleSubmit}>
                <input type="title" placeholder="제목" value={title}
                onChange={(e)=> setTitle(e.target.value)} />
                <input type="content" placeholder="내용" value={content}
                onChange={(e)=> setContent(e.target.value)} />
                <button type="submit">글쓰기</button>
            </form>
        </div>
        {msg && <div className="popup">{msg}</div>}
        </div>
    );
}

export default CreatePost;