"use client";

import { useState } from "react";
import { registerUser } from "@/components/lib/authApi";

export function useRegister() {
  const [username, setUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!username || !regEmail || !regPassword) {
      setAuthError("Username, email and password are required.");
      return;
    }
    if (regPassword !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }

    try {
      await registerUser(username, regEmail, regPassword);
      // optional: clear fields or switch mode
    } catch (err: any) {
      setAuthError(err.message ?? "Server error while registering");
    }
  };

  return {
    username,
    regEmail,
    regPassword,
    confirmPassword,
    authError,
    setUsername,
    setRegEmail,
    setRegPassword,
    setConfirmPassword,
    setAuthError,
    handleRegisterSubmit,
  };
}
