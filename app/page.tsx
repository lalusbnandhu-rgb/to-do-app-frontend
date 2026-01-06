"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/dropdown/dropdown";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Search from "@/components/search/search";
import ThemeToggle from "@/components/ThemeToggle/Themetoggle";
import AddNoteDialog from "@/components/notePage/AddNoteDialog";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";

type Note = {
  id: string;      // 🔹 add id from MongoDB
  title: string;
  done: boolean;
};

type StoredUser = {
  email: string;
  password: string;
};

const MAX_TITLE_PREVIEW = 80;

// 🔹 frontend → backend base URL
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

export default function Home() {
  const router = useRouter();

  // auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // shared auth fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // todo state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [searchText, setSearchText] = useState("");
  const [userName, setUserName] = useState("");

  // 🔹 load todos from backend
  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/todos`);
      if (!res.ok) {
        console.error("Failed to fetch todos");
        return;
      }
      const data = await res.json();
      const mapped: Note[] = data.map((t: any) => ({
        id: t._id,                               // 🔹 keep Mongo _id
        title: t.title,
        done: t.completed ?? t.done ?? false,
      }));
      setNotes(mapped);
    } catch (err) {
      console.error("Error fetching todos", err);
    }
  };

  // ---- AUTH INIT ----
  useEffect(() => {
    const loggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("todo_logged_in") === "true";
    setIsLoggedIn(loggedIn);
    setAuthReady(true);

    if (loggedIn) {
      setUserName(localStorage.getItem("todo_username") ?? ""); // 🔹 load name
      fetchTodos();
    }
  }, []);


  const getStoredUser = (): StoredUser | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("todo_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!email || !password) {
      setAuthError("Email and password are required.");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    const newUser: StoredUser = { email, password };
    localStorage.setItem("todo_user", JSON.stringify(newUser));
    localStorage.setItem("todo_logged_in", "true");

    setIsLoggedIn(true);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAuthMode("login");

    // optional: load todos right after registering if you want
    fetchTodos();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const user = getStoredUser();
    if (!user) {
      setAuthError("No account found. Please register first.");
      setAuthMode("register");
      return;
    }

    if (user.email === email && user.password === password) {
      localStorage.setItem("todo_logged_in", "true");
      localStorage.setItem("todo_username", user.email); // persist name
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
      // 🔹 load todos after successful login
      fetchTodos();
    } else {
      setAuthError("Invalid email or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("todo_logged_in");
    setIsLoggedIn(false);
    setNotes([]);
    setFilter("all");       // 🔹 reset dropdown
    setSearchText("");
  };

  // ---- TODO DERIVED STATE ----
  const filteredNotes = notes.filter(note => {
    if (filter === "done" && !note.done) return false;
    if (filter === "todo" && note.done) return false;

    if (searchText) {
      return note.title.toLowerCase().includes(searchText.toLowerCase());
    }

    return true;
  });

  const toggleNote = (index: number) => {
    setNotes(prev =>
      prev.map((note, i) =>
        i === index ? { ...note, done: !note.done } : note
      )
    );
    // optional: also PATCH to backend later
  };

  // 🔹 UPDATED: save to backend, then update state
  const handleSaveNote = async (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    // editing: still local-only for now
    if (editingIndex !== null) {
      setNotes(prev =>
        prev.map((note, i) =>
          i === editingIndex ? { ...note, title: trimmed } : note
        )
      );
      setIsDialogOpen(false);
      setEditingIndex(null);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) {
        console.error("Failed to save todo");
        return;
      }

      const created = await res.json();
      setNotes(prev => [
        ...prev,
        {
          id: created._id,                          // 🔹 use backend id
          title: created.title ?? trimmed,
          done: created.completed ?? created.done ?? false,
        },
      ]);

      setIsDialogOpen(false);
      setEditingIndex(null);
    } catch (err) {
      console.error("Error saving todo", err);
    }
  };

  // 🔹 NEW: delete from backend, then from state
  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete todo");
        return;
      }

      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (err) {
      console.error("Error deleting todo", err);
    }
  };

  const startCreate = () => {
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleCancelDialog = () => {
    setIsDialogOpen(false);
    setEditingIndex(null);
  };

  const getPreviewTitle = (title: string) => {
    if (title.length <= MAX_TITLE_PREVIEW) return title;
    return title.slice(0, MAX_TITLE_PREVIEW) + "...";
  };

  if (!authReady) {
    return null;
  }

  // ---------- AUTH VIEW (LOGIN / REGISTER) ----------
  if (!isLoggedIn) {
    const isLogin = authMode === "login";

    return (
      <main className="loginContainer">
        <form
          className="loginCard"
          onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
        >
          <h1 className="loginTitle">
            {isLogin ? "Sign in" : "Create account"}
          </h1>

          {authError && <p className="loginError">{authError}</p>}

          <label className="loginLabel">
            Email
            <input
              className="loginInput"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="loginLabel">
            Password
            <input
              className="loginInput"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>

          {!isLogin && (
            <label className="loginLabel">
              Confirm Password
              <input
                className="loginInput"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </label>
          )}

          <button className="loginButton" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="loginSwitchText">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="loginSwitchLink"
              onClick={() => {
                setAuthMode(isLogin ? "register" : "login");
                setAuthError("");
              }}
            >
              {isLogin ? "Create an account" : "Log in"}
            </button>
          </p>
        </form>
      </main>
    );
  }

  // ---------- TODO APP VIEW ----------
  return (
    <div>
      <Header onLogout={handleLogout} userEmail={email} />
      <div className="header">
        <h3>TODO LIST</h3>
      </div>

      <div className="sub-header">
        <Search onSearch={setSearchText} />
        <Dropdown
          value={filter}
          onChange={value => {
            setFilter(value);
            setSearchText("");
          }}
        />
        <ThemeToggle />
      </div>

      <div className="page-container">
        {filteredNotes.length === 0 ? (
          <div className="emptyState">
            <img
              src="/images/empty-notes.svg"
              alt="No notes yet"
              className="emptyStateImage"
            />
            <p className="emptyStateText">
              No notes yet. Click + to add one.
            </p>
          </div>
        ) : (
          <ul className="checklist">
            {filteredNotes.map((note, index) => (
              <li
                key={note.id}   // 🔹 stable key
                className={`todoItem ${note.done ? "todoItem--done" : ""}`}
              >
                <div className="todoLeft">
                  <input
                    type="checkbox"
                    checked={note.done}
                    onChange={() => toggleNote(index)}
                    className="todoCheckbox"
                  />
                  <span className="todoText">
                    {getPreviewTitle(note.title)}
                  </span>
                </div>

                <div className="todoActions">
                  <button
                    className="todoIcon"
                    onClick={() => startEdit(index)}
                  >
                    <MdOutlineEdit />
                  </button>
                  <button
                    className="todoIcon"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AddNoteDialog
        isOpen={isDialogOpen}
        initialTitle={
          editingIndex !== null ? notes[editingIndex]?.title ?? "" : ""
        }
        onCancel={handleCancelDialog}
        onApply={handleSaveNote}
      />

      <Footer onAddClick={startCreate} />
    </div>
  );
}
