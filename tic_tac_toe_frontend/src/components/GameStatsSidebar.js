import React, { useEffect, useState, useContext } from "react";
import { fetchGameHistory } from "../utils/api";
import { AuthContext } from "../utils/AuthContext";

/**
 * Sidebar component showing the signed-in user's recent games,
 * win/loss/draw record, and statistics.
 * Used on main pages.
 */
// PUBLIC_INTERFACE
function GameStatsSidebar() {
  const { token, user } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Computed stats
  let stats = { win: 0, lose: 0, draw: 0, total: 0 };

  useEffect(() => {
    if (!token) {
      setGames([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchGameHistory(token)
      .then((result) => {
        if (result.error) setError(result.error);
        else setGames(result.games || []);
        setLoading(false);
      });
  }, [token]);

  // Calc Win/Loss/Draw stats
  if (games && user) {
    stats.total = games.length;
    for (let g of games) {
      if (g.status !== "complete") continue;
      if (g.winner === null) stats.draw++;
      else if (g.winner === user.username) stats.win++;
      else stats.lose++;
    }
  }

  // Helper for summary label
  const resultLabel = (g) => {
    if (g.status !== "complete") return <span style={{color:"#888"}}>In Progress</span>;
    if (g.winner == null) return <span style={{color:"#666"}}>Draw</span>;
    if (g.winner === user.username) return <span style={{color:"green"}}>Win</span>;
    return <span style={{color:"red"}}>Lose</span>;
  }

  return (
    <aside
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        padding: "1em",
        minWidth: 220,
        maxWidth: 270,
        borderRadius: "10px",
        margin: "1rem 2rem 1rem 0",
      }}
    >
      <h3 style={{marginTop:0, fontSize:"1.25em"}}>My Game Stats</h3>
      {!token ? <p>Login to view stats.</p> :
      loading ? <p>Loading...</p> :
      error ? <div style={{color:"red"}}>Error: {error}</div> :
      <>
        <div style={{marginBottom:"0.5em"}}>
          <b>Total games:</b> {stats.total} <br />
          <span style={{color:"green"}}>Wins:</span> {stats.win}<br/>
          <span style={{color:"red"}}>Losses:</span> {stats.lose}<br/>
          <span style={{color:"#444"}}>Draws:</span> {stats.draw}
        </div>
        <hr style={{margin:"0.7em 0"}}/>
        <div style={{fontWeight:500, marginBottom: "0.4em"}}>Recent Games</div>
        <ol style={{paddingLeft:"1.1em", margin:0}}>
          {games.length === 0 && (<li style={{color:"#666"}}>No games yet</li>)}
          {games.slice(0,4).map(g => {
            let opponent = (g.players || []).find(p => p !== user.username) || "—";
            return (
              <li key={g.id} style={{marginBottom:"0.2em",  fontSize:"0.97em"}}>
                #{g.id} vs {opponent}: {resultLabel(g)}
              </li>
            );
          })}
        </ol>
        {games.length > 4 && (
          <div style={{marginTop:"0.2em", fontSize:"0.92em"}}>And {games.length - 4} more…</div>
        )}
      </>
      }
    </aside>
  );
}

export default GameStatsSidebar;
