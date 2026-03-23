import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

const POSTS = [
  { id: 1, title: "First Blog Post",  body: "This is the content of the first blog post. lorem ipsum dolor sit amet, consectetur adipiscing elit."  },
  { id: 2, title: "Second Blog Post", body: "This is the content of the second blog post. lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 3, title: "Third Blog Post",  body: "This is the content of the third blog post. lorem ipsum dolor sit amet, consectetur adipiscing elit."  },
  { id: 4, title: "Fourth Blog Post", body: "This is the content of the fourth blog post. lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 5, title: "Fifth Blog Post",  body: "This is the content of the fifth blog post. lorem ipsum dolor sit amet, consectetur adipiscing elit."  },
  { id: 6, title: "Sixth Blog Post",  body: "This is the content of the sixth blog post. lorem ipsum dolor sit amet, consectetur adipiscing elit."  },
];

function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", padding: "40px 24px" }}>
      <h1 style={{ textAlign: "center", color: "white", fontSize: 32, fontWeight: 700, marginBottom: 32 }}>
        Blogs Page
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 700, margin: "0 auto" }}>
        {POSTS.map(post => (
          <div key={post.id} style={{
            background: "#e8e8e8",
            borderRadius: 20,
            padding: "28px 20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{post.title}</h2>
            <p style={{ fontSize: 13, color: "#444", margin: 0 }}>
              {post.body.slice(0, 35)}...
            </p>
            <div style={{ marginTop: 8 }}>
              <Link to={`/post/${post.id}`} style={{
                background: "#4caf50",
                color: "white",
                padding: "8px 18px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}>
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostDetail() {
  const { id } = useParams();
  const post   = POSTS.find(p => p.id === Number(id));

  if (!post) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p>Post not found.</p>
      <Link to="/">← Back</Link>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #c9b8f0, #a8c4f0)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: "rgba(255,255,255,0.25)",
        borderRadius: 20,
        padding: "32px 40px",
        maxWidth: 620,
        width: "100%",
        marginTop: 20,
      }}>
        {/* Back Button */}
        <Link to="/" style={{
          background: "#3f3f9e",
          color: "white",
          padding: "7px 16px",
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 32,
        }}>
          ← Back
        </Link>

        <h1 style={{ fontSize: 26, fontWeight: 800, textAlign: "center", marginBottom: 20 }}>{post.title}</h1>
        <p style={{ fontSize: 15, color: "#333", textAlign: "center", lineHeight: 1.7 }}>{post.body}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}