import React, { useState, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

// PUBLIC_INTERFACE
function Register() {
  /**
   * Registration page for the user.
   * Allows user to create an account.
   */
  const { register, loading, error } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form.username, form.password);
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{maxWidth: 320, margin: "auto"}}>
        <div>
          <label htmlFor="username">Username</label>
          <input required type="text" name="username" value={form.username} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input required type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        <button className="btn" type="submit" disabled={loading}>Register</button>
        {error && <div style={{color: 'red'}}>{error}</div>}
      </form>
    </div>
  );
}

export default Register;
