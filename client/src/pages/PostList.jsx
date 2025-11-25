import { useEffect } from "react";
import { useState } from "react";
import { apiFetch } from "../api";
import './PostList.css'


function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      const res = await apiFetch('/posts');
      const data = await res.json();
      setPosts(data.posts);
    };

    loadPosts();
  }, []);

    return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-card" key={post._id}>
          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-content">{post.content}</p>

          <div className="post-card-meta">
            <span>
              작성날짜 : {new Date(post.createdAt).toLocaleString()}
            </span>
            <span>작성자 : {post.authorName || '알 수 없음'}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default PostList;