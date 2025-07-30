import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
function Dashboard() {
  /**
   * Main dashboard after login/registration.
   * Shows options to start a new game or view history.
   */
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome! Start a new game or view your previous games.</p>
      <ul>
        <li><Link to="/play">Play Game</Link></li>
        <li><Link to="/history">Game History</Link></li>
      </ul>
    </div>
  );
}
export default Dashboard;
