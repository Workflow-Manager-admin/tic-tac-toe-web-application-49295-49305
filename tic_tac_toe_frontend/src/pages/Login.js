import React, { useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

// PUBLIC_INTERFACE
function Login() {
  /**
   * Login page for the user.
   * Allows user to enter credentials and login.
   */
  const { login, loading, error } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form.username, form.password);
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{maxWidth: 320, margin: "auto"}}>
        <div>
          <label htmlFor="username">Username</label>
          <input required type="text" name="username" value={form.username} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input required type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        <button className="btn" type="submit" disabled={loading}>Log In</button>
        {error && <div style={{color: 'red'}}>{error}</div>}
      </form>
    </div>
  );
}

export default Login;
