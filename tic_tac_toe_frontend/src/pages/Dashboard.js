import React from "react";

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
        <li><a href="/play">Play Game</a></li>
        <li><a href="/history">Game History</a></li>
      </ul>
    </div>
  );
}
export default Dashboard;
