"use client";

import { useState } from "react";
import { loginUser, type LoginResponse } from "@/components/lib/authApi";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const user: LoginResponse = await loginUser(email, password);
      setIsLoggedIn(true);
      setUserName(user.username ?? user.email);

        // 🔹 save JWT (JSON Web Token - secure way to send iformation from client to server)for later API calls
      localStorage.setItem("token", user.token);

      setEmail("");
      setPassword("");
    } catch (err: any) {
      setAuthError(err.message ?? "Server error while logging in");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setEmail("");
    setPassword("");
    localStorage.removeItem("token"); // optional: clear token
  };

  return {
    email,
    password,
    authError,
    isLoggedIn,
    userName,
    setEmail,
    setPassword,
    setAuthError,
    handleLoginSubmit,
    handleLogout,
  };
}
