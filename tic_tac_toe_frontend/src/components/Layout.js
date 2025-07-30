import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

// PUBLIC_INTERFACE
function Layout({ children }) {
  /**
   * Layout wrapper for app. Includes nav bar with auth links.
   */
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <nav className="navbar" style={{display: "flex", padding: "1rem", background: "#f8f9fa", borderBottom: "1px solid #eaeaea"}}>
        <Link className="title" to="/" style={{marginRight: '1.5rem'}}>Tic Tac Toe</Link>
        <div style={{marginLeft: 'auto'}}>
          {!user ? (
            <>
              <Link to="/login" style={{marginRight: "1rem"}}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span style={{marginRight: "1rem"}}>{user.username}</span>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </nav>
      <main className="container" style={{marginTop: "2rem"}}>{children}</main>
    </>
  );
}

export default Layout;
