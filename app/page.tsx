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
import { useLogin } from "@/components/Auth/useLogin";
import { useRegister } from "@/components/Auth/useRegister";

type Note = {
  id: string;
  title: string;
  done: boolean;
};

//how much of the note’s words is displayed in the UI
const MAX_TITLE_PREVIEW = 50;

// Use API base from .env (NEXT_PUBLIC_API_BASE), or default to localhost:4000 if it's not set
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

export default function Home() {
  const router = useRouter();

  // simple auth UI state
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authReady] = useState(true);

  //User login 
  const {
    isLoggedIn,
    userName,
    email,
    password,
    authError: loginError,
    setEmail,
    setPassword,
    setAuthError: setLoginError,
    handleLoginSubmit,
    handleLogout,
  } = useLogin();

  // User registertion
  const {
    username,
    regEmail,
    regPassword,
    confirmPassword,
    authError: registerError,
    setUsername,
    setRegEmail,
    setRegPassword,
    setConfirmPassword,
    setAuthError: setRegisterError,
    handleRegisterSubmit,
  } = useRegister();

  // todo state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [searchText, setSearchText] = useState("");

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/todos`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

      if (!res.ok) return;
      const data = await res.json();
      const mapped: Note[] = data.map((t: any) => ({
        id: t._id,
        title: t.title,
        done: t.completed ?? t.done ?? false,
      }));
      setNotes(mapped);
    } catch (err) {
      console.error("Error fetching todos", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTodos();
    }
  }, [isLoggedIn]);

  // ---- TODO handlers ----

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
  };

  // Save new or edited note
  const handleSaveNote = async (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

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
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ title: trimmed }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        console.error("Failed to save todo", res.status, errBody);
        return;
      }

      const created = await res.json();
      setNotes(prev => [
        ...prev,
        {
          id: created._id,
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

// Delete note
 const handleDeleteNote = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      console.error("Failed to delete todo", res.status, errBody);
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

  if (!authReady) return null;

  // ---------- AUTH VIEW ----------
  if (!isLoggedIn) {
    const isLogin = authMode === "login";
    const error = isLogin ? loginError : registerError;

    return (
      <main className="loginContainer">
        <form
          className="loginCard"
          onSubmit={async e => {
            if (isLogin) {
              await handleLoginSubmit(e);
            } else {
              await handleRegisterSubmit(e);

              // if register had no error, switch to login mode
              if (!registerError) {
                setAuthMode("login");
              }
            }
          }}
        >

          <h1 className="loginTitle">
            {isLogin ? "Sign in" : "Create account"}
          </h1>

          {error && <p className="loginError">{error}</p>}

          {!isLogin && (
            <label className="loginLabel">
              Username
              <input
                className="loginInput"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </label>
          )}

          <label className="loginLabel">
            Email
            <input
              className="loginInput"
              type="email"
              value={isLogin ? email : regEmail}
              onChange={e =>
                isLogin
                  ? setEmail(e.target.value)
                  : setRegEmail(e.target.value)
              }
              required
            />
          </label>

          <label className="loginLabel">
            Password
            <input
              className="loginInput"
              type="password"
              value={isLogin ? password : regPassword}
              onChange={e =>
                isLogin
                  ? setPassword(e.target.value)
                  : setRegPassword(e.target.value)
              }
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
                if (isLogin) {
                  setAuthMode("register");
                  setLoginError("");
                } else {
                  setAuthMode("login");
                  setRegisterError("");
                }
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
      <Header onLogout={handleLogout} userEmail={userName} />

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
                key={note.id}
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

      {/*----------rendering your details for add/edit note dialog ----------  */}
      <AddNoteDialog
        isOpen={isDialogOpen}
        initialTitle={
          editingIndex !== null ? notes[editingIndex]?.title ?? "" : ""
        }
        onCancel={handleCancelDialog}
        onApply={handleSaveNote}
      />

      {/* //--------footer with add button ----------   */}
      <Footer onAddClick={startCreate} />
    </div>
  );
}
