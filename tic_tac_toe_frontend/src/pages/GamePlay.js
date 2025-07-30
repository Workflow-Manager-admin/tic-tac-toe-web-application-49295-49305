import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../utils/AuthContext";
import {
  fetchGames,
  createGame,
  joinGame,
  makeMove,
  fetchGameState
} from "../utils/api";

/**
 * Renders a 3x3 Tic Tac Toe board with clickable cells.
 */
function Board({ board, onCellClick, winner, disabled }) {
  // board: 2D array 3x3 ['X','O',''] for cells
  return (
    <div style={{
      display: "inline-block",
      border: "2px solid var(--border-color)",
      background: "#fff",
      margin: "1.2rem 0",
    }}>
      {[0,1,2].map(i =>
        <div key={i} style={{ display: "flex" }}>
          {[0,1,2].map(j => {
            const cellVal = board[i][j];
            return (
              <button
                key={j}
                style={{
                  width: 60, height: 60,
                  fontSize: "2rem",
                  border: "1px solid #eaeaea",
                  margin: 0, background: "#f8f9fa",
                  cursor: disabled || cellVal || winner ? "not-allowed" : "pointer"
                }}
                disabled={!!cellVal || winner || disabled}
                onClick={() => onCellClick(i, j)}
                data-testid={`cell-${i}-${j}`}
              >
                {cellVal}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function GamePlay() {
  /**
   * Game play page for Tic Tac Toe. Shows:
   * - List of games to join/start
   * - Once joined/created, shows board; lets player make moves
   * - Displays win/lose/draw UI+feedback
   */

  const { token, user } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(null); // active game object
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [refreshGames, setRefreshGames] = useState(0);

  // --- Initial fetch of games to join or play (if not in a game) ---
  useEffect(() => {
    if (!token || game) return;
    setFetching(true);
    fetchGames(token).then(result => {
      if (result.error) setError(result.error);
      else setGames(result.games || []);
      setFetching(false);
    });
  }, [token, game, refreshGames]);

  // --- Poll for game state if in a game (simple polling instead of websocket) ---
  useEffect(() => {
    if (!token || !game?.id || game.status !== "in_progress") return;
    const poll = setInterval(() => {
      fetchGameState(token, game.id).then(latest => {
        if (!latest.error) setGame(latest);
      });
    }, 1750);
    return () => clearInterval(poll);
  }, [token, game]);

  // --- Game creation handler ---
  const handleCreateGame = async () => {
    setStatus("Creating game...");
    setError("");
    const res = await createGame(token);
    if (res.error) setError(res.error);
    else {
      setGame(res);
      setStatus("Game created. Waiting for Player 2...");
    }
  };

  // --- Game join handler ---
  const handleJoinGame = async (gid) => {
    setStatus("Joining game...");
    setError("");
    const res = await joinGame(token, gid);
    if (res.error) setError(res.error);
    else {
      setGame(res);
      setStatus("Joined game! Your move.");
    }
  };

  // --- Making a move handler ---
  const handleCellClick = async (i, j) => {
    if (!game || !user) return;
    setStatus("Submitting move...");
    setError("");
    // Only let user move if it's their turn
    if (game.next_player !== user.username) {
      setError("It's not your turn.");
      return;
    }
    const move = { x: i, y: j };
    const res = await makeMove(token, game.id, move);
    if (res.error) setError(res.error);
    else {
      setGame(res);
      if (res.status === "complete") {
        if (res.winner === null) setStatus("Draw!");
        else if (res.winner === user.username) setStatus("You win! 🎉");
        else setStatus("You lose.");
      } else {
        setStatus("Move submitted.");
      }
    }
  };

  // --- UX helper: Reset to game list
  const handleBackToLobby = () => {
    setGame(null);
    setStatus("");
    setError("");
    setRefreshGames(c => c + 1);
  };

  // --- UI: display logic
  if (!token) {
    return <div className="container"><p>You must be logged in to play.</p></div>;
  }
  if (!game) {
    return (
      <div className="container">
        <h2>Game Lobby</h2>
        {error && <div style={{color: "red"}}>{error}</div>}
        {fetching && <p>Loading games...</p>}
        <button className="btn" onClick={handleCreateGame}>+ Create New Game</button>
        <h3>Open Games</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {games.length === 0 && <li>No available games to join. Create a new game!</li>}
          {games.map(g => (
            <li key={g.id} style={{margin: "0.5rem 0"}}>
              <span>Game #{g.id} - {g.players?.join(" vs ")}</span>
              <button className="btn" onClick={() => handleJoinGame(g.id)} style={{marginLeft:'1rem'}}>Join</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // -- If in a game (playing or waiting for opponent) --
  // Defensive: Construct a 3x3 board ('','X','O')
  let blank = [...Array(3)].map(()=>Array(3).fill(""));
  let board = blank;
  let winner = null;
  if (game.board) {
    board = game.board;
    winner = game.winner;
  }
  // Whose move?
  let playerMark = (game.players && game.players[0] === user.username) ? "X" : "O";
  let theirMark = playerMark === "X" ? "O" : "X";

  return (
    <div className="container">
      <h2>Game #{game.id}</h2>
      <div style={{ marginBottom: 10 }}>
        <strong>Your marker:</strong> {playerMark}
        <span style={{ marginLeft: 20 }}><strong>Opponent:</strong> {game.players?.find(p => p !== user.username) || "Waiting..."}</span>
      </div>
      {status && <div style={{color: status.includes("win") ? "green" : (status.includes("lose") ? "red" : "#333"), marginBottom:8 }}>{status}</div>}
      {error && <div style={{color: "red", marginBottom:8}}>{error}</div>}

      <Board
        board={board}
        winner={winner}
        onCellClick={handleCellClick}
        disabled={
          !game.players || game.players.length < 2 ||
          !!game.winner || game.status !== "in_progress"
        }
      />
      <div>
        {game.status !== "complete" &&
          <div>
            <p>Current turn: <b>{game.next_player || "—"}</b> ({(game.next_player === user.username) ? playerMark : theirMark})</p>
            {game.players?.length < 2 && <span>Waiting for an opponent...</span>}
          </div>
        }
        {game.status === "complete" &&
          <div>
            <b>Game completed.</b>
            {game.winner === null
              ? <span> It was a draw.</span>
              : (game.winner === user.username
                ? <span style={{color:'green'}}> You won! 🎉</span>
                : <span style={{color:'red'}}> You lost.</span>)
            }
          </div>
        }
        <button className="btn" style={{marginTop:12}} onClick={handleBackToLobby}>
          Back to Lobby
        </button>
      </div>
    </div>
  );
}
export default GamePlay;
