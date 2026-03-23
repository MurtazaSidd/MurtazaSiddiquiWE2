import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

const INIT_STUDENTS = [
  { id: "S001", name: "Ali Khan",    age: 20, major: "Computer Science", gpa: "3.8", email: "ali@uni.edu",    phone: "0300-1234567" },
  { id: "S002", name: "Sara Ahmed",  age: 22, major: "Mathematics",      gpa: "3.5", email: "sara@uni.edu",   phone: "0301-2345678" },
  { id: "S003", name: "John Smith",  age: 21, major: "Physics",          gpa: "3.2", email: "john@uni.edu",   phone: "0302-3456789" },
  { id: "S004", name: "Zara Ali",    age: 23, major: "Chemistry",        gpa: "3.9", email: "zara@uni.edu",   phone: "0303-4567890" },
  { id: "S005", name: "Usman Raza",  age: 20, major: "Computer Science", gpa: "3.1", email: "usman@uni.edu",  phone: "0304-5678901" },
];

const majorColors = {
  "Computer Science": { bg: "#e8f0fe", color: "#1a237e" },
  "Mathematics":      { bg: "#fce4ec", color: "#880e4f" },
  "Physics":          { bg: "#e8f5e9", color: "#1b5e20" },
  "Chemistry":        { bg: "#fff8e1", color: "#e65100" },
  "Biology":          { bg: "#f3e5f5", color: "#4a148c" },
  "English":          { bg: "#e0f7fa", color: "#006064" },
};

const getMajorStyle = (major) => majorColors[major] || { bg: "#f0f0f0", color: "#333" };

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ students }) {
  return (
    <nav style={{ background: "#1a237e", padding: "14px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link to="/" style={{ color: "white", fontWeight: 900, fontSize: 20, textDecoration: "none" }}>🎓 UniPortal</Link>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {[["Home", "/"], ["Students", "/students"], ["Add Student", "/add"], ["Profiles", "/profiles"]].map(([label, path]) => (
          <Link key={path} to={path} style={{ color: "white", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            {label}
          </Link>
        ))}
        <span style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
          {students.length} Students
        </span>
      </div>
    </nav>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────────
function Home({ students }) {
  const navigate = useNavigate();
  const avgGpa   = (students.reduce((s, st) => s + Number(st.gpa), 0) / students.length).toFixed(2);
  const majors   = new Set(students.map(s => s.major)).size;

  return (
    <div style={{ padding: "48px 40px", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontWeight: 900, fontSize: 36, marginBottom: 6 }}>Welcome to UniPortal</h1>
      <p style={{ color: "#888", fontSize: 15, marginBottom: 36 }}>Manage your university students in one place.</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
        {[
          { label: "Total Students", value: students.length, icon: "👨‍🎓", color: "#1a237e" },
          { label: "Avg GPA",        value: avgGpa,          icon: "📊", color: "#2e7d32" },
          { label: "Majors",         value: majors,          icon: "📚", color: "#880e4f" },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: 14, padding: "24px 28px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ color: "#888", fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 14 }}>
        <button onClick={() => navigate("/students")} style={primaryBtn}>View All Students →</button>
        <button onClick={() => navigate("/add")}      style={secondaryBtn}>+ Add New Student</button>
      </div>
    </div>
  );
}

// ── Students Table ────────────────────────────────────────────────────────────
function Students({ students, setStudents }) {
  const navigate = useNavigate();
  const [search,  setSearch]  = useState("");
  const [sortBy,  setSortBy]  = useState("id");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (col) => {
    if (sortBy === col) setSortAsc(!sortAsc);
    else { setSortBy(col); setSortAsc(true); }
  };

  const filtered = students
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.major.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (sortBy === "gpa") { va = Number(va); vb = Number(vb); }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });

  const remove = (id) => {
    if (window.confirm("Remove this student?"))
      setStudents(students.filter(s => s.id !== id));
  };

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: 4, opacity: sortBy === col ? 1 : 0.3 }}>
      {sortBy === col ? (sortAsc ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, margin: 0 }}>Student List</h2>
        <button onClick={() => navigate("/add")} style={primaryBtn}>+ Add Student</button>
      </div>

      <input
        placeholder="🔍 Search by name, major or ID..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, width: 320, marginBottom: 20 }}
      />

      <div style={{ background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a237e", color: "white" }}>
              {[["id","ID"], ["name","Name"], ["age","Age"], ["major","Major"], ["gpa","GPA"]].map(([col, label]) => (
                <th key={col} onClick={() => handleSort(col)} style={{ ...th, cursor: "pointer", userSelect: "none" }}>
                  {label}<SortIcon col={col} />
                </th>
              ))}
              <th style={th}>Email</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#aaa" }}>No students found.</td></tr>
            ) : filtered.map((s, i) => {
              const mc = getMajorStyle(s.major);
              return (
                <tr key={s.id} style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ ...td, fontWeight: 700, color: "#1a237e" }}>{s.id}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{s.name}</td>
                  <td style={td}>{s.age}</td>
                  <td style={td}>
                    <span style={{ background: mc.bg, color: mc.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                      {s.major}
                    </span>
                  </td>
                  <td style={{ ...td, fontWeight: 700 }}>{s.gpa}</td>
                  <td style={{ ...td, color: "#555", fontSize: 13 }}>{s.email}</td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => navigate(`/profile/${s.id}`)} style={actionBtn("#1a237e")}>View</button>
                      <button onClick={() => remove(s.id)}                 style={actionBtn("#c62828")}>Del</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ color: "#aaa", fontSize: 13, marginTop: 10 }}>Showing {filtered.length} of {students.length} students</p>
    </div>
  );
}

// ── Add Student ───────────────────────────────────────────────────────────────
function AddStudent({ students, setStudents }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", age: "", major: "", gpa: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  const handle  = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name)  e.name  = "Name is required";
    if (!form.age)   e.age   = "Age is required";
    if (!form.major) e.major = "Major is required";
    if (!form.gpa)   e.gpa   = "GPA is required";
    if (!form.email) e.email = "Email is required";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const newId = "S" + String(students.length + 1).padStart(3, "0");
    setStudents([...students, { ...form, id: newId }]);
    navigate("/students");
  };

  const Field = ({ name, placeholder, type = "text" }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>
        {placeholder}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={handle}
        style={{ ...inputStyle, width: "100%", boxSizing: "border-box", borderColor: errors[name] ? "#c62828" : "#ddd" }}
      />
      {errors[name] && <span style={{ color: "#c62828", fontSize: 12 }}>{errors[name]}</span>}
    </div>
  );

  return (
    <div style={{ padding: "32px 40px", maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 24 }}>Add New Student</h2>

      <div style={{ background: "white", borderRadius: 14, padding: "28px 32px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <Field name="name"  placeholder="Full Name" />
          <Field name="age"   placeholder="Age" type="number" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#555", display: "block", marginBottom: 4 }}>Major</label>
            <select name="major" value={form.major} onChange={handle} style={{ ...inputStyle, width: "100%", boxSizing: "border-box", borderColor: errors.major ? "#c62828" : "#ddd" }}>
              <option value="">Select Major</option>
              {["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "English"].map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
            {errors.major && <span style={{ color: "#c62828", fontSize: 12 }}>{errors.major}</span>}
          </div>
          <Field name="gpa"   placeholder="GPA (e.g. 3.5)" />
        </div>
        <Field name="email" placeholder="Email Address" type="email" />
        <Field name="phone" placeholder="Phone Number" />

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={submit}              style={{ ...primaryBtn, flex: 1 }}>Add Student</button>
          <button onClick={() => navigate(-1)}  style={{ ...secondaryBtn, flex: 1 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Profiles Grid ─────────────────────────────────────────────────────────────
function Profiles({ students }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.major.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, margin: 0 }}>Student Profiles</h2>
        <input placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
        {filtered.map(s => {
          const mc = getMajorStyle(s.major);
          return (
            <div key={s.id} style={{ background: "white", borderRadius: 14, padding: "24px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1a237e", color: "white", fontSize: 22, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                {s.name[0]}
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>{s.name}</h3>
              <p style={{ margin: "0 0 8px", color: "#888", fontSize: 12 }}>{s.id}</p>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: mc.bg, color: mc.color }}>{s.major}</span>
              <p style={{ margin: "10px 0 14px", fontWeight: 900, fontSize: 18, color: "#1a237e" }}>GPA: {s.gpa}</p>
              <button onClick={() => navigate(`/profile/${s.id}`)} style={{ ...primaryBtn, width: "100%", padding: "8px 0", fontSize: 13 }}>View Profile</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Profile Detail ────────────────────────────────────────────────────────────
function ProfileDetail({ students }) {
  const { id }   = useParams();
  const navigate = useNavigate();
  const s        = students.find(st => st.id === id);

  if (!s) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p>Student not found.</p>
      <button onClick={() => navigate("/students")} style={primaryBtn}>← Back</button>
    </div>
  );

  const mc  = getMajorStyle(s.major);
  const gpa = Number(s.gpa);
  const gpaColor = gpa >= 3.7 ? "#2e7d32" : gpa >= 3.0 ? "#1565c0" : "#c62828";

  return (
    <div style={{ padding: "32px 40px", maxWidth: 620, margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ ...secondaryBtn, marginBottom: 20 }}>← Back</button>

      <div style={{ background: "white", borderRadius: 16, padding: "32px 36px", boxShadow: "0 2px 14px rgba(0,0,0,0.09)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#1a237e", color: "white", fontSize: 28, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {s.name[0]}
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900 }}>{s.name}</h2>
            <p style={{ margin: "0 0 6px", color: "#888", fontSize: 13 }}>{s.id}</p>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: mc.bg, color: mc.color }}>{s.major}</span>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #f0f0f0", marginBottom: 24 }} />

        {/* Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "Age",   value: s.age + " years" },
            { label: "GPA",   value: s.gpa, valueColor: gpaColor },
            { label: "Email", value: s.email },
            { label: "Phone", value: s.phone || "N/A" },
          ].map(item => (
            <div key={item.label} style={{ background: "#f8f9fa", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: item.valueColor || "#222" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* GPA Bar */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
            <span style={{ fontWeight: 700 }}>GPA Progress</span>
            <span style={{ color: gpaColor, fontWeight: 700 }}>{s.gpa} / 4.0</span>
          </div>
          <div style={{ background: "#eee", borderRadius: 10, height: 10 }}>
            <div style={{ width: `${(gpa / 4.0) * 100}%`, height: "100%", background: gpaColor, borderRadius: 10 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [students, setStudents] = useState(INIT_STUDENTS);

  return (
    <BrowserRouter>
      <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f3f4f6" }}>
        <Navbar students={students} />
        <Routes>
          <Route path="/"             element={<Home       students={students} />} />
          <Route path="/students"     element={<Students   students={students} setStudents={setStudents} />} />
          <Route path="/add"          element={<AddStudent students={students} setStudents={setStudents} />} />
          <Route path="/profiles"     element={<Profiles   students={students} />} />
          <Route path="/profile/:id"  element={<ProfileDetail students={students} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const primaryBtn = {
  padding: "10px 24px", background: "#1a237e", color: "white",
  border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14,
};
const secondaryBtn = {
  padding: "10px 24px", background: "#f0f0f0", color: "#333",
  border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14,
};
const actionBtn = (bg) => ({
  padding: "5px 12px", background: bg, color: "white",
  border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 12,
});
const inputStyle = {
  padding: "9px 14px", fontSize: 14,
  border: "1px solid #ddd", borderRadius: 6, outline: "none",
};
const th = { padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 13 };
const td = { padding: "12px 16px", fontSize: 14, borderBottom: "1px solid #f0f0f0" };