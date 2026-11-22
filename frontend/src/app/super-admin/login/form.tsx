"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(signIn, "");

  return (
    <form action={action} className="login-form">
      <label htmlFor="email">Work email</label>
      <input id="email" name="email" type="email" autoComplete="username" maxLength={254} required />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" maxLength={128} required />
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
