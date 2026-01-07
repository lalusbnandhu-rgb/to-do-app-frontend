"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // TODO: call your backend here
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    // fake success for now
    router.push("/"); // go to main TODO page
  }

  return (
    <div className="loginPage">
      <h1 className="loginTitle">Login</h1>

      <form onSubmit={handleSubmit} className="loginForm">
        <label className="loginLabel">
          Email
          <input
            type="email"
            className="loginInput"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>

        <label className="loginLabel">
          Password
          <input
            type="password"
            className="loginInput"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="loginError">{error}</p>}

        <button type="submit" className="loginButton">
          Sign in
        </button>
      </form>
    </div>
  );
}
