import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import { fetchGameHistory } from "../utils/api";
import GameStatsSidebar from "../components/GameStatsSidebar";

// PUBLIC_INTERFACE
function GameHistory() {
  /**
   * Page to display user's previous games and results, with sidebar stats.
   * Lists history of played games.
   */
  const { token, user } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchGameHistory(token).then(result => {
      if (result.error) setError(result.error);
      else setGames(result.games || []);
      setLoading(false);
    });
  }, [token]);

  return (
    <div style={{display:"flex", alignItems:"flex-start"}}>
      <GameStatsSidebar />
      <div style={{flex:1}}>
        <h2>Game History</h2>
        {!token && <p>You must be logged in to view your history.</p>}
        {error && <div style={{color:"red"}}>{error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table style={{width: "100%", background: "#fff", borderCollapse: "collapse", marginTop: "1rem"}}>
            <thead>
              <tr style={{background:'#f8f9fa'}}>
                <th style={{padding:'0.4em', border: '1px solid #eaeaea'}}>Game ID</th>
                <th style={{padding:'0.4em', border: '1px solid #eaeaea'}}>Opponent</th>
                <th style={{padding:'0.4em', border: '1px solid #eaeaea'}}>Result</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 && (
                <tr>
                  <td colSpan={3}><i>No completed games found.</i></td>
                </tr>
              )}
              {games.map(g => {
                let opponent = g.players.find(p => p !== user.username) || "—";
                // Result:
                let result = "In Progress";
                if (g.status === "complete") {
                  if (g.winner === null) result = "Draw";
                  else if (g.winner === user.username) result = "Win";
                  else result = "Lose";
                }
                return (
                  <tr key={g.id}>
                    <td style={{padding:'0.4em', border: '1px solid #eaeaea'}}>{g.id}</td>
                    <td style={{padding:'0.4em', border: '1px solid #eaeaea'}}>{opponent}</td>
                    <td style={{
                      padding:'0.4em',
                      border: '1px solid #eaeaea',
                      color: result === "Win" ? "green" : (result === "Lose" ? "red" : "#2b2b2b")
                    }}>{result}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
export default GameHistory;
