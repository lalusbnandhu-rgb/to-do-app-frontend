"use client";

import { FC } from "react";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  authError: string;
  onUsernameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onSubmitLogin: (e: React.FormEvent) => void;
  onSubmitRegister: (e: React.FormEvent) => void;
  onToggleMode: () => void;
};

const AuthForm: FC<AuthFormProps> = ({
  mode,
  username,
  email,
  password,
  confirmPassword,
  authError,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmitLogin,
  onSubmitRegister,
  onToggleMode,
}) => {
  const isLogin = mode === "login";

  return (
    <main className="loginContainer">
      <form
        className="loginCard"
        onSubmit={isLogin ? onSubmitLogin : onSubmitRegister}
      >
        <h1 className="loginTitle">
          {isLogin ? "Sign in" : "Create account"}
        </h1>

        {authError && <p className="loginError">{authError}</p>}

        {!isLogin && (
          <label className="loginLabel">
            Username
            <input
              className="loginInput"
              type="text"
              value={username}
              onChange={e => onUsernameChange(e.target.value)}
              required
            />
          </label>
        )}

        <label className="loginLabel">
          Email
          <input
            className="loginInput"
            type="email"
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            required
          />
        </label>

        <label className="loginLabel">
          Password
          <input
            className="loginInput"
            type="password"
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
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
              onChange={e => onConfirmPasswordChange(e.target.value)}
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
            onClick={onToggleMode}
          >
            {isLogin ? "Create an account" : "Log in"}
          </button>
        </p>
      </form>
    </main>
  );
};

export default AuthForm;
